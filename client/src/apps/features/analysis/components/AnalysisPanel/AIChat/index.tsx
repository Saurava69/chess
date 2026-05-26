import React, { useState, useRef, useEffect } from "react";

import useAnalysisBoardStore from "@analysis/stores/AnalysisBoardStore";
import useRealtimeEngineStore from "@analysis/stores/RealtimeEngineStore";
import { useAuthedProfile } from "@/hooks/api/useProfile";
import * as styles from "./AIChat.module.css";

interface Message {
    role: "user" | "assistant";
    content: string;
    streaming?: boolean;
}

function formatEval(lines: ReturnType<typeof useRealtimeEngineStore>["displayedEngineLines"]): string {
    const line = lines.at(0);
    if (!line) return "";
    const { type, value } = line.evaluation;
    if (type === "mate") return `Mate in ${Math.abs(value)}`;
    const cp = (value / 100).toFixed(2);
    return value >= 0 ? `+${cp}` : cp;
}

function AIChat() {
    const [messages, setMessages]   = useState<Message[]>([]);
    const [input, setInput]         = useState("");
    const [streaming, setStreaming] = useState(false);

    const currentNode     = useAnalysisBoardStore(state => state.currentStateTreeNode);
    const { displayedEngineLines } = useRealtimeEngineStore();
    const { status: profileStatus } = useAuthedProfile();
    const isSignedIn = profileStatus === "success";

    const bottomRef   = useRef<HTMLDivElement>(null);
    const inputRef    = useRef<HTMLTextAreaElement>(null);
    const abortRef    = useRef<AbortController | null>(null);

    // Scroll to bottom on new content
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    async function sendMessage() {
        const text = input.trim();
        if (!text || streaming) return;

        const fen       = currentNode.state.fen;
        const engineEval = formatEval(displayedEngineLines);

        const userMsg: Message = { role: "user", content: text };
        const assistantMsg: Message = { role: "assistant", content: "", streaming: true };

        const nextMessages = [...messages, userMsg];
        setMessages([...nextMessages, assistantMsg]);
        setInput("");
        setStreaming(true);

        const ctrl = new AbortController();
        abortRef.current = ctrl;

        try {
            const resp = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: nextMessages.map(m => ({ role: m.role, content: m.content })),
                    fen,
                    engineEval,
                }),
                signal: ctrl.signal,
            });

            if (resp.status === 401) {
                setMessages(prev => {
                    const copy = [...prev];
                    copy[copy.length - 1] = { role: "assistant", content: "⚠️ Sign in to use the AI coach." };
                    return copy;
                });
                return;
            }

            if (resp.status === 429) {
                setMessages(prev => {
                    const copy = [...prev];
                    copy[copy.length - 1] = { role: "assistant", content: "⚠️ You've used all 10 AI chats for today. Come back tomorrow." };
                    return copy;
                });
                return;
            }

            if (!resp.ok || !resp.body) {
                throw new Error(`HTTP ${resp.status}`);
            }

            const reader  = resp.body.getReader();
            const decoder = new TextDecoder();
            let   buffer  = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop() || "";

                for (const line of lines) {
                    if (!line.startsWith("data: ")) continue;
                    try {
                        const event = JSON.parse(line.slice(6));
                        if (event.type === "token") {
                            setMessages(prev => {
                                const copy = [...prev];
                                const last = copy[copy.length - 1];
                                if (last.role === "assistant") {
                                    copy[copy.length - 1] = { ...last, content: last.content + event.text };
                                }
                                return copy;
                            });
                        } else if (event.type === "complete") {
                            setMessages(prev => {
                                const copy = [...prev];
                                const last = copy[copy.length - 1];
                                if (last.role === "assistant") {
                                    copy[copy.length - 1] = { ...last, streaming: false };
                                }
                                return copy;
                            });
                        } else if (event.type === "error") {
                            setMessages(prev => {
                                const copy = [...prev];
                                const last = copy[copy.length - 1];
                                if (last.role === "assistant") {
                                    copy[copy.length - 1] = { ...last, content: `Error: ${event.message}`, streaming: false };
                                }
                                return copy;
                            });
                        }
                    } catch { /* skip malformed */ }
                }
            }
        } catch (err: unknown) {
            if ((err as Error).name === "AbortError") return;
            const msg = err instanceof Error ? err.message : "Request failed";
            setMessages(prev => {
                const copy = [...prev];
                const last = copy[copy.length - 1];
                if (last.role === "assistant") {
                    copy[copy.length - 1] = { ...last, content: `Error: ${msg}`, streaming: false };
                }
                return copy;
            });
        } finally {
            setStreaming(false);
            abortRef.current = null;
        }
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }

    function clearChat() {
        if (streaming) abortRef.current?.abort();
        setMessages([]);
        setStreaming(false);
    }

    if (!isSignedIn) {
        return (
            <div className={styles.wrapper}>
                <div className={styles.header}>
                    <span className={styles.headerIcon}>✦</span>
                    <span className={styles.headerTitle}>AI Coach</span>
                </div>
                <div className={styles.signInGate}>
                    <span className={styles.signInIcon}>🔒</span>
                    <p className={styles.signInTitle}>Sign in to use AI Coach</p>
                    <p className={styles.signInDesc}>
                        Ask the AI coach about any position, get move explanations,
                        and receive personalised coaching.
                    </p>
                    <a href="/signin" className={styles.signInBtn}>
                        Sign in free →
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            {/* Header */}
            <div className={styles.header}>
                <span className={styles.headerIcon}>✦</span>
                <span className={styles.headerTitle}>AI Coach</span>
                {messages.length > 0 && (
                    <button className={styles.clearBtn} onClick={clearChat} title="Clear chat">
                        ✕
                    </button>
                )}
            </div>

            {/* Context pill */}
            <div className={styles.contextPill}>
                <span className={styles.fenLabel}>Position</span>
                <span className={styles.fenValue} title={currentNode.state.fen}>
                    {currentNode.state.move?.san ?? "Start"}
                </span>
                {displayedEngineLines.length > 0 && (
                    <>
                        <span className={styles.sep}>·</span>
                        <span className={styles.evalValue}>{formatEval(displayedEngineLines)}</span>
                    </>
                )}
            </div>

            {/* Messages */}
            <div className={styles.messages}>
                {messages.length === 0 && (
                    <div className={styles.empty}>
                        <p>Ask anything about the current position.</p>
                        <div className={styles.suggestions}>
                            {["What's the best plan here?", "Why is this move good?", "What should I watch out for?"].map(s => (
                                <button
                                    key={s}
                                    className={styles.suggestion}
                                    onClick={() => { setInput(s); inputRef.current?.focus(); }}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`${styles.bubble} ${msg.role === "user" ? styles.userBubble : styles.aiBubble}`}
                    >
                        {msg.role === "assistant" && (
                            <span className={styles.aiLabel}>AI</span>
                        )}
                        <p className={styles.bubbleText}>{msg.content}</p>
                        {msg.streaming && <span className={styles.cursor} />}
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className={styles.inputRow}>
                <textarea
                    ref={inputRef}
                    className={styles.input}
                    placeholder="Ask about this position…"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={2}
                    disabled={streaming}
                />
                <button
                    className={`${styles.sendBtn} ${streaming ? styles.sendBtnStreaming : ""}`}
                    onClick={sendMessage}
                    disabled={!input.trim() || streaming}
                    title="Send (Enter)"
                >
                    {streaming ? "…" : "↑"}
                </button>
            </div>
        </div>
    );
}

export default AIChat;
