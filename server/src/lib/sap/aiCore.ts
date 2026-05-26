// SAP AI Core streaming provider
// Adapted from system-design-simulator/server/src/providers/sap-ai-core.ts

export interface AIMessage {
    role: "user" | "assistant";
    content: string;
}

export type AIEvent =
    | { type: "token";    data: { text: string } }
    | { type: "complete"; data: { content: string } }
    | { type: "error";   data: { message: string } };

type OnEvent = (event: AIEvent) => void;

// ─── Token cache ────────────────────────────────────────────────────────────
let tokenCache: { accessToken: string; expiresAt: number } | null = null;

async function resolveToken(): Promise<string> {
    const clientId     = process.env.SAP_CLIENT_ID     || "";
    const clientSecret = process.env.SAP_CLIENT_SECRET || "";
    let   tokenUrl     = process.env.SAP_TOKEN_URL     || "";

    if (!tokenUrl.endsWith("/oauth/token")) {
        tokenUrl = `${tokenUrl.replace(/\/$/, "")}/oauth/token`;
    }

    if (!clientId || !clientSecret || !tokenUrl) {
        throw new Error("SAP AI Core: missing OAuth credentials (SAP_CLIENT_ID / SAP_CLIENT_SECRET / SAP_TOKEN_URL)");
    }

    if (tokenCache && Date.now() < tokenCache.expiresAt) {
        return tokenCache.accessToken;
    }

    const resp = await fetch(tokenUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        },
        body: "grant_type=client_credentials",
    });

    if (!resp.ok) {
        throw new Error(`SAP OAuth token fetch failed: ${resp.status} ${await resp.text()}`);
    }

    const data = await resp.json() as { access_token: string; expires_in?: number };
    const expiresIn = data.expires_in || 3600;

    tokenCache = {
        accessToken: data.access_token,
        expiresAt: Date.now() + (expiresIn - 60) * 1000,
    };

    return tokenCache.accessToken;
}

// ─── Deployment resolution ───────────────────────────────────────────────────
let cachedDeployUrl: string | null = null;
let cachedDeployModel: string | null = null;

async function resolveDeployUrl(token: string): Promise<string> {
    const baseUrl       = (process.env.SAP_BASE_URL || "").replace(/\/$/, "");
    const resourceGroup = process.env.SAP_RESOURCE_GROUP || "default";
    const model         = process.env.SAP_MODEL || "anthropic--claude-4.6-sonnet";

    if (cachedDeployUrl && cachedDeployModel === model) return cachedDeployUrl;

    const resp = await fetch(`${baseUrl}/v2/lm/deployments?$top=50&status=RUNNING`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "AI-Resource-Group": resourceGroup,
        },
    });

    if (!resp.ok) throw new Error(`Failed to fetch SAP deployments: ${resp.status}`);

    const data = await resp.json() as { resources?: Array<Record<string, unknown>> };
    const deployments = (data.resources || [])
        .filter((d) => d.status === "RUNNING")
        .map((d) => {
            const details       = d.details as Record<string, unknown> | undefined;
            const backendDetails = (details?.resources as Record<string, unknown>)?.backend_details as Record<string, unknown> | undefined;
            const modelInfo     = backendDetails?.model as Record<string, unknown> | undefined;
            return {
                id:            d.id as string,
                model:         (modelInfo?.name as string) || "",
                deploymentUrl: (d.deploymentUrl as string) || "",
            };
        });

    const match =
        deployments.find((d) => d.model === model) ||
        deployments.find((d) => d.model.includes(model) || model.includes(d.model));

    if (!match) {
        const available = deployments.slice(0, 5).map((d) => d.model).join(", ");
        throw new Error(`No running SAP deployment for model "${model}". Available: ${available}`);
    }

    const url = match.deploymentUrl || `${baseUrl}/v2/inference/deployments/${match.id}`;
    cachedDeployUrl   = url;
    cachedDeployModel = model;
    return url;
}

// ─── Anthropic streaming ─────────────────────────────────────────────────────
async function streamAnthropic(
    deployUrl: string,
    token: string,
    messages: AIMessage[],
    systemPrompt: string,
    onEvent: OnEvent,
): Promise<void> {
    const body = {
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
    };

    const resourceGroup = process.env.SAP_RESOURCE_GROUP || "default";

    const response = await fetch(`${deployUrl}/invoke-with-response-stream`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "AI-Resource-Group": resourceGroup,
            "anthropic-beta": "prompt-caching-2024-07-31",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const err = await response.text();
        onEvent({ type: "error", data: { message: `SAP AI Core error: ${response.status} — ${err}` } });
        return;
    }

    const reader  = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer      = "";
    let fullContent = "";

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6).trim();
            if (!data) continue;
            try {
                const parsed = JSON.parse(data);
                if (parsed.type === "content_block_delta" && parsed.delta?.type === "text_delta") {
                    fullContent += parsed.delta.text;
                    onEvent({ type: "token", data: { text: parsed.delta.text } });
                }
            } catch { /* ignore malformed lines */ }
        }
    }

    onEvent({ type: "complete", data: { content: fullContent } });
}

// ─── OpenAI-compat streaming ─────────────────────────────────────────────────
async function streamOpenAI(
    deployUrl: string,
    token: string,
    model: string,
    messages: AIMessage[],
    systemPrompt: string,
    onEvent: OnEvent,
): Promise<void> {
    const resourceGroup = process.env.SAP_RESOURCE_GROUP || "default";

    const body = {
        model,
        stream: true,
        messages: [
            { role: "system", content: systemPrompt },
            ...messages.map((m) => ({ role: m.role, content: m.content })),
        ],
    };

    const response = await fetch(`${deployUrl}/chat/completions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "AI-Resource-Group": resourceGroup,
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const err = await response.text();
        onEvent({ type: "error", data: { message: `SAP AI Core error: ${response.status} — ${err}` } });
        return;
    }

    const reader  = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer      = "";
    let fullContent = "";

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
                const parsed = JSON.parse(data);
                const text   = parsed.choices?.[0]?.delta?.content;
                if (text) {
                    fullContent += text;
                    onEvent({ type: "token", data: { text } });
                }
            } catch { /* ignore */ }
        }
    }

    onEvent({ type: "complete", data: { content: fullContent } });
}

// ─── Public entry point (streaming) ─────────────────────────────────────────
export async function streamAI(
    messages: AIMessage[],
    systemPrompt: string,
    onEvent: OnEvent,
): Promise<void> {
    const token     = await resolveToken();
    const deployUrl = await resolveDeployUrl(token);
    const model     = process.env.SAP_MODEL || "anthropic--claude-4.6-sonnet";
    const isAnthropic = model.startsWith("anthropic--");

    if (isAnthropic) {
        await streamAnthropic(deployUrl, token, messages, systemPrompt, onEvent);
    } else {
        await streamOpenAI(deployUrl, token, model, messages, systemPrompt, onEvent);
    }
}

// ─── Public entry point (non-streaming) ─────────────────────────────────────
/**
 * Calls SAP AI Core and returns the full text response.
 * Internally uses the streaming endpoint (/invoke-with-response-stream for
 * Anthropic) since SAP AI Core may not expose a synchronous /invoke endpoint.
 */
export async function callAI(
    messages: AIMessage[],
    systemPrompt: string,
): Promise<string> {
    return new Promise((resolve, reject) => {
        let fullText = "";

        streamAI(messages, systemPrompt, (event) => {
            if (event.type === "token") {
                fullText += event.data.text;
            } else if (event.type === "complete") {
                resolve(fullText);
            } else if (event.type === "error") {
                reject(new Error(event.data.message));
            }
        }).catch(reject);
    });
}
