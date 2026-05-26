import React, { useState, useRef, useEffect } from "react";

import { getNodeChain, getNodeMoveNumber } from "shared/types/game/position/StateTreeNode";
import { Classification } from "shared/constants/Classification";
import useAnalysisBoardStore from "@analysis/stores/AnalysisBoardStore";
import useAnalysisGameStore from "@analysis/stores/AnalysisGameStore";
import useRealtimeEngineStore from "@analysis/stores/RealtimeEngineStore";
import useAICommentaryStore from "@analysis/stores/AICommentaryStore";
import { classificationColours, classificationImages } from "@analysis/constants/classifications";
import { useAuthedProfile } from "@/hooks/api/useProfile";
import playBoardSound from "@/lib/boardSounds";
import * as styles from "./AIChat.module.css";

interface Message {
    role: "user" | "assistant";
    content: string;
    streaming?: boolean;
}

type PanelView = "review" | "chat";

function formatEval(lines: ReturnType<typeof useRealtimeEngineStore>["displayedEngineLines"]): string {
    const line = lines.at(0);
    if (!line) return "";
    const { type, value } = line.evaluation;
    if (type === "mate") return `Mate in ${Math.abs(value)}`;
    const cp = (value / 100).toFixed(2);
    return value >= 0 ? `+${cp}` : cp;
}

const SUGGESTIONS = [
    "What's the best plan here?",
    "What's the idea behind this move?",
    "What should I watch out for?",
];

// Classification label short-form
const classifLabel: Partial<Record<Classification, string>> = {
    [Classification.BRILLIANT]:  "!!"  ,
    [Classification.CRITICAL]:   "!?"  ,
    [Classification.INACCURACY]: "?!"  ,
    [Classification.MISTAKE]:    "?"   ,
    [Classification.BLUNDER]:    "??"  ,
    [Classification.RISKY]:      "⚠"   ,
};

function AIChat() {
    const [view, setView]           = useState<PanelView>("review");
    const [messages, setMessages]   = useState<Message[]>([]);
    const [input, setInput]         = useState("");
    const [streaming, setStreaming] = useState(false);

    const { analysisGame }           = useAnalysisGameStore();
    const currentNode                = useAnalysisBoardStore(state => state.currentStateTreeNode);
    const { setCurrentStateTreeNode } = useAnalysisBoardStore();
    const { displayedEngineLines }   = useRealtimeEngineStore();
    const { commentaries, aiError }  = useAICommentaryStore();
    const { status: profileStatus }  = useAuthedProfile();
    const isSignedIn = profileStatus === "success";

    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef  = useRef<HTMLTextAreaElement>(null);
    const abortRef  = useRef<AbortController | null>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // All mainline nodes that have AI commentary
    const reviewNodes = getNodeChain(analysisGame.stateTree).filter(
        n => n.state.move && commentaries[n.id]?.status === "done"
    );

    // ── Navigate to a node ───────────────────────────────────────
    function goToNode(node: typeof currentNode) {
        setCurrentStateTreeNode(node);
        playBoardSound(node);
    }

    // ── Send chat message ────────────────────────────────────────
    async function sendMessage() {
        const text = input.trim();
        if (!text || streaming) return;

        const fen        = currentNode.state.fen;
        const engineEval = formatEval(displayedEngineLines);

        const userMsg: Message      = { role: "user",      content: text };
        const assistantMsg: Message = { role: "assistant", content: "", streaming: true };

        const nextMessages = [...messages, userMsg];
        setMessages([...nextMessages, assistantMsg]);
        setInput("");
        setStreaming(true);

        const ctrl = new AbortController();
        abortRef.current = ctrl;

        const replaceLastAssistant = (update: Partial<Message>) => {
            setMessages(prev => {
                const copy = [...prev];
                const last = copy[copy.length - 1];
                if (last.role === "assistant") copy[copy.length - 1] = { ...last, ...update };
                return copy;
            });
        };

        try {
            const resp = await fetch("/api/ai/chat", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({
                    messages: nextMessages.map(m => ({ role: m.role, content: m.content })),
                    fen,
                    engineEval,
                }),
                signal: ctrl.signal,
            });

            if (resp.status === 401) {
                replaceLastAssistant({ content: "Sign in to use the AI coach.", streaming: false });
                return;
            }
            if (resp.status === 429) {
                replaceLastAssistant({ content: "You've used all 10 AI chats for today. Come back tomorrow.", streaming: false });
                return;
            }
            if (!resp.ok || !resp.body) throw new Error(`HTTP ${resp.status}`);

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
                                if (last.role === "assistant")
                                    copy[copy.length - 1] = { ...last, content: last.content + event.text };
                                return copy;
                            });
                        } else if (event.type === "complete") {
                            replaceLastAssistant({ streaming: false });
                        } else if (event.type === "error") {
                            replaceLastAssistant({ content: "Something went wrong. Try again.", streaming: false });
                        }
                    } catch { /* skip malformed */ }
                }
            }
        } catch (err: unknown) {
            if ((err as Error).name === "AbortError") return;
            replaceLastAssistant({ content: "Something went wrong. Try again.", streaming: false });
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

    // ── Sign-in gate ─────────────────────────────────────────────
    if (!isSignedIn) {
        return (
            <div className={styles.wrapper}>
                <div className={styles.signInGate}>
                    <span className={styles.signInIcon}>✦</span>
                    <p className={styles.signInTitle}>AI Coach</p>
                    <p className={styles.signInDesc}>
                        Move-by-move review, key moment analysis, and a chat coach for any question.
                    </p>
                    <a href="/signin" className={styles.signInBtn}>Sign in free →</a>
                </div>
            </div>
        );
    }

    // ── Main UI ───────────────────────────────────────────────────
    return (
        <div className={styles.wrapper}>
            {/* Top bar with view switcher */}
            <div className={styles.topbar}>
                <span className={styles.topbarIcon}>✦</span>
                <div className={styles.viewTabs}>
                    <button
                        className={`${styles.viewTab} ${view === "review" ? styles.viewTabActive : ""}`}
                        onClick={() => setView("review")}
                    >
                        Review
                        {reviewNodes.length > 0 && (
                            <span className={styles.badge}>{reviewNodes.length}</span>
                        )}
                    </button>
                    <button
                        className={`${styles.viewTab} ${view === "chat" ? styles.viewTabActive : ""}`}
                        onClick={() => setView("chat")}
                    >
                        Chat
                    </button>
                </div>
            </div>

            {view === "review" ? (
                /* ── Review: clickable list of all commented moves ── */
                <div className={styles.reviewList}>
                    {aiError === "signin" && (
                        <p className={styles.reviewEmpty}>Sign in to see AI coaching.</p>
                    )}
                    {aiError === "limit_analysis" && (
                        <p className={styles.reviewEmpty}>2 AI analyses used today. Resets at midnight.</p>
                    )}
                    {!aiError && reviewNodes.length === 0 && (
                        <div className={styles.reviewEmptyState}>
                            <p className={styles.reviewEmpty}>
                                {Object.keys(commentaries).length > 0
                                    ? "Loading commentary…"
                                    : "Analyse a game with AI to see coaching here."}
                            </p>
                        </div>
                    )}
                    {reviewNodes.map(node => {
                        const commentary = commentaries[node.id];
                        const moveNum    = Math.ceil(getNodeMoveNumber(node));
                        const isWhite    = node.state.moveColour === "white";
                        const classif    = node.state.classification as Classification | undefined;
                        const isActive   = currentNode.id === node.id;

                        return (
                            <div
                                key={node.id}
                                className={`${styles.reviewItem} ${isActive ? styles.reviewItemActive : ""}`}
                                onClick={() => goToNode(node)}
                            >
                                {/* Move number + side indicator */}
                                <div className={styles.reviewMoveNum}>
                                    {moveNum}{isWhite ? "." : "…"}
                                </div>

                                {/* Move SAN + classification */}
                                <div className={styles.reviewMove}>
                                    <span className={styles.reviewMoveSan}>
                                        {node.state.move?.san}
                                    </span>
                                    {classif && (
                                        <span
                                            className={styles.reviewClassif}
                                            style={{ color: classificationColours[classif] }}
                                        >
                                            {classifLabel[classif] ?? classif}
                                        </span>
                                    )}
                                </div>

                                {/* Commentary */}
                                {commentary?.status === "done" && (
                                    <p className={styles.reviewText}>{commentary.text}</p>
                                )}
                                {commentary?.status === "loading" && (
                                    <p className={`${styles.reviewText} ${styles.reviewLoading}`}>
                                        Analyzing…
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* ── Chat: free-form Q&A ────────────────────────── */
                <>
                    <div className={styles.messages}>
                        {messages.length === 0 ? (
                            <div className={styles.empty}>
                                <p className={styles.emptyHint}>Ask anything about this position</p>
                                <div className={styles.suggestions}>
                                    {SUGGESTIONS.map(s => (
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
                        ) : messages.map((msg, i) => (
                            <div key={i} className={`${styles.bubble} ${msg.role === "user" ? styles.userBubble : styles.aiBubble}`}>
                                {msg.role === "assistant" && !msg.streaming && msg.content && (
                                    <span className={styles.aiLabel}>Coach</span>
                                )}
                                <p className={styles.bubbleText}>
                                    {msg.content || (msg.streaming ? "" : "…")}
                                    {msg.streaming && <span className={styles.cursor} />}
                                </p>
                            </div>
                        ))}
                        <div ref={bottomRef} />
                    </div>

                    <div className={styles.inputRow}>
                        {messages.length > 0 && (
                            <button className={styles.newChatBtn} onClick={clearChat} title="New chat">↺</button>
                        )}
                        <textarea
                            ref={inputRef}
                            className={styles.input}
                            placeholder="Ask about this position… (Enter to send)"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            rows={1}
                            disabled={streaming}
                        />
                        <button
                            className={`${styles.sendBtn} ${streaming ? styles.sendBtnActive : ""}`}
                            onClick={streaming ? clearChat : sendMessage}
                            title={streaming ? "Stop" : "Send (Enter)"}
                            disabled={!streaming && !input.trim()}
                        >
                            {streaming ? "■" : "↑"}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default AIChat;
