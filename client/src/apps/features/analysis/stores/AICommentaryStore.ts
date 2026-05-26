import { create } from "zustand";

export interface CommentaryEntry {
    status: "loading" | "done" | "error";
    text: string;
}

export type AIError = null | "signin" | "limit_analysis" | "limit_chat";

interface AICommentaryStore {
    aiCoachEnabled: boolean;
    commentaries: Record<string, CommentaryEntry>;
    aiError: AIError;

    setAiCoachEnabled: (enabled: boolean) => void;
    setCommentary: (nodeId: string, entry: CommentaryEntry) => void;
    appendCommentaryToken: (nodeId: string, token: string) => void;
    setBatchCommentaries: (batch: Record<string, string>) => void;
    setAIError: (err: AIError) => void;
    clearCommentaries: () => void;
}

const useAICommentaryStore = create<AICommentaryStore>(set => ({
    aiCoachEnabled: false,
    commentaries: {},
    aiError: null,

    setAiCoachEnabled(enabled) {
        set({ aiCoachEnabled: enabled });
    },

    setCommentary(nodeId, entry) {
        set(state => ({
            commentaries: { ...state.commentaries, [nodeId]: entry }
        }));
    },

    appendCommentaryToken(nodeId, token) {
        set(state => {
            const existing = state.commentaries[nodeId];
            return {
                commentaries: {
                    ...state.commentaries,
                    [nodeId]: {
                        status: "loading",
                        text: (existing?.text ?? "") + token,
                    }
                }
            };
        });
    },

    setBatchCommentaries(batch) {
        set(state => {
            const updates: Record<string, CommentaryEntry> = {};
            for (const [nodeId, text] of Object.entries(batch)) {
                updates[nodeId] = { status: "done", text };
            }
            return { commentaries: { ...state.commentaries, ...updates } };
        });
    },

    setAIError(err) {
        set({ aiError: err });
    },

    clearCommentaries() {
        set({ commentaries: {}, aiError: null });
    },
}));

export default useAICommentaryStore;
