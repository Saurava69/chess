import React, { useState } from "react";
import { createRoot } from "react-dom/client";

import PageWrapper from "@/components/layout/PageWrapper";
import "@/i18n";
import "@/index.css";
import * as styles from "./Openings.module.css";

// ─── Board position types ────────────────────────────────────────
type PieceColor = "w" | "b";
interface Square { piece?: string; color?: PieceColor }
type Board = Square[][];

// ─── FEN parser (rank/file only, no castling/en-passant needed) ──
function fenToBoard(fen: string): Board {
    const pieceMap: Record<string, { piece: string; color: PieceColor }> = {
        r: { piece: "♜", color: "b" }, n: { piece: "♞", color: "b" },
        b: { piece: "♝", color: "b" }, q: { piece: "♛", color: "b" },
        k: { piece: "♚", color: "b" }, p: { piece: "♟", color: "b" },
        R: { piece: "♖", color: "w" }, N: { piece: "♘", color: "w" },
        B: { piece: "♗", color: "w" }, Q: { piece: "♕", color: "w" },
        K: { piece: "♔", color: "w" }, P: { piece: "♙", color: "w" },
    };
    const ranks = fen.split(" ")[0].split("/");
    return ranks.map(rank => {
        const row: Square[] = [];
        for (const ch of rank) {
            if (/\d/.test(ch)) for (let i = 0; i < parseInt(ch); i++) row.push({});
            else row.push(pieceMap[ch] ?? {});
        }
        return row;
    });
}

// ─── Opening data ────────────────────────────────────────────────
interface Opening {
    id: string;
    name: string;
    category: "e4" | "d4" | "flank";
    side: "white" | "black" | "flexible";
    moves: string[];
    desc: string;
    variations: string[];
    fen: string;
}

const OPENINGS: Opening[] = [
    {
        id: "queens-gambit",
        name: "Queen's Gambit",
        category: "d4",
        side: "white",
        moves: ["1.d4", "d5", "2.c4"],
        desc: "The most classical opening — White offers a pawn to seize central control and gain lasting initiative.",
        variations: ["Queen's Gambit Declined", "Queen's Gambit Accepted", "Slav Defense", "Semi-Slav"],
        fen: "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3 0 2",
    },
    {
        id: "sicilian",
        name: "Sicilian Defense",
        category: "e4",
        side: "black",
        moves: ["1.e4", "c5"],
        desc: "The most popular Black response to 1.e4 — asymmetric, dynamic, and full of winning chances for both sides.",
        variations: ["Najdorf Variation", "Dragon Variation", "Scheveningen", "Closed Sicilian"],
        fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2",
    },
    {
        id: "italian",
        name: "Italian Game",
        category: "e4",
        side: "white",
        moves: ["1.e4", "e5", "2.Nf3", "Nc6", "3.Bc4"],
        desc: "One of the oldest openings — rapid development, bishop pressure on f7, and rich middlegame complexity.",
        variations: ["Classical Italian", "Evans Gambit", "Italian Attack", "Hungarian Defense"],
        fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
    },
    {
        id: "ruy-lopez",
        name: "Ruy Lopez",
        category: "e4",
        side: "white",
        moves: ["1.e4", "e5", "2.Nf3", "Nc6", "3.Bb5"],
        desc: "The Spanish Opening — one of the most deeply analysed openings, rich in strategy and long-term planning.",
        variations: ["Closed Ruy Lopez", "Berlin Defense", "Exchange Variation", "Marshall Attack"],
        fen: "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
    },
    {
        id: "kings-indian",
        name: "King's Indian Defense",
        category: "d4",
        side: "black",
        moves: ["1.d4", "Nf6", "2.c4", "g6"],
        desc: "A hypermodern classic — Black concedes the center early and counterattacks with the fianchettoed bishop.",
        variations: ["Classical Variation", "Sämisch System", "Four Pawns Attack", "Fianchetto"],
        fen: "rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq g6 0 3",
    },
    {
        id: "english",
        name: "English Opening",
        category: "flank",
        side: "flexible",
        moves: ["1.c4"],
        desc: "A flexible flank system — controls d5 without committing early, transposes to many different structures.",
        variations: ["Symmetrical English", "King's English", "Reversed Sicilian", "Four Knights"],
        fen: "rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq c3 0 1",
    },
];

const PRINCIPLES = [
    { num: "01", icon: "♟", title: "Control the Center", desc: "Fight for e4, e5, d4, d5 with pawns and pieces. Central control translates directly to piece activity." },
    { num: "02", icon: "♞", title: "Develop Pieces", desc: "Bring knights and bishops to active squares before advancing. Each tempo wasted costs you." },
    { num: "03", icon: "♚", title: "King Safety", desc: "Castle within the first 10 moves. An exposed king in the opening is an invitation to be attacked." },
    { num: "04", icon: "♛", title: "No Early Queen Sorties", desc: "Avoid bringing the queen out early — it becomes a target and loses tempi when chased by minor pieces." },
];

const FILTERS = [
    { id: "all",   label: "All openings" },
    { id: "e4",    label: "1.e4 Openings" },
    { id: "d4",    label: "1.d4 Openings" },
    { id: "flank", label: "Flank" },
] as const;

type FilterId = typeof FILTERS[number]["id"];

// ─── Mini board component ────────────────────────────────────────
function MiniBoard({ fen }: { fen: string }) {
    const board = fenToBoard(fen);
    const squares: React.ReactNode[] = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const dark = (r + c) % 2 === 1;
            const sq = board[r][c];
            squares.push(
                <div
                    key={`${r}-${c}`}
                    className={`${styles.miniSq} ${dark ? styles.miniSqDark : styles.miniSqLight}`}
                >
                    {sq.piece && (
                        <span className={sq.color === "w" ? styles.miniPieceW : styles.miniPieceB}>
                            {sq.piece}
                        </span>
                    )}
                </div>
            );
        }
    }
    return <div className={styles.miniBoard}>{squares}</div>;
}

// ─── Opening card ────────────────────────────────────────────────
function OpeningCard({ opening, index }: { opening: Opening; index: number }) {
    const sideBadgeClass =
        opening.side === "white"    ? styles.badgeWhite :
        opening.side === "black"    ? styles.badgeBlack :
        styles.badgeFlexible;

    const sideLabel =
        opening.side === "white"    ? "● White favoured" :
        opening.side === "black"    ? "● Black counterplay" :
        "● Flexible";

    return (
        <div
            className={`${styles.card} ${styles.fadeIn}`}
            style={{ animationDelay: `${index * 60}ms` }}
        >
            {/* Board preview */}
            <div className={styles.cardBoard}>
                <MiniBoard fen={opening.fen} />
                <span className={`${styles.sideBadge} ${sideBadgeClass}`}>{sideLabel}</span>
            </div>

            {/* Card body */}
            <div className={styles.cardBody}>
                <h3 className={styles.cardName}>{opening.name}</h3>

                {/* Move chips */}
                <div className={styles.moveChips}>
                    {opening.moves.map((m, i) => (
                        <span key={i} className={styles.moveChip}>{m}</span>
                    ))}
                </div>

                <p className={styles.cardDesc}>{opening.desc}</p>

                {/* Variations */}
                <ul className={styles.variations}>
                    {opening.variations.map(v => (
                        <li key={v}>{v}</li>
                    ))}
                </ul>

                <a href="/analysis" className={styles.cardCta}>
                    Study opening <span className={styles.ctaArrow}>→</span>
                </a>
            </div>
        </div>
    );
}

// ─── Main page ───────────────────────────────────────────────────
function Openings() {
    const [filter, setFilter] = useState<FilterId>("all");

    const visible = OPENINGS.filter(o =>
        filter === "all" || o.category === filter
    );

    return (
        <PageWrapper>
            {/* ── Hero header ─────────────────────────────────── */}
            <div className={styles.hero}>
                <div className={styles.heroInner}>
                    <span className={styles.eyebrow}>Study Guide</span>
                    <h1 className={styles.heroTitle}>Chess Openings</h1>
                    <p className={styles.heroSubtitle}>
                        Master the moves that set the tone for the entire game.
                        Study board positions, key ideas, and the theory behind every line.
                    </p>

                    {/* Filter tabs */}
                    <div className={styles.filters}>
                        {FILTERS.map(f => (
                            <button
                                key={f.id}
                                className={`${styles.filterBtn} ${filter === f.id ? styles.filterActive : ""}`}
                                onClick={() => setFilter(f.id)}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Openings grid ───────────────────────────────── */}
            <div className={styles.shell}>
                <div className={styles.grid}>
                    {visible.map((o, i) => (
                        <OpeningCard key={o.id} opening={o} index={i} />
                    ))}
                </div>

                {/* ── Principles ──────────────────────────────── */}
                <section className={styles.principlesSection}>
                    <div className={styles.principlesHeader}>
                        <h2 className={styles.principlesTitle}>Opening Principles</h2>
                        <p className={styles.principlesSubtitle}>
                            These four rules govern sound play in every opening — memorise them before studying specific lines.
                        </p>
                    </div>
                    <div className={styles.principlesGrid}>
                        {PRINCIPLES.map(p => (
                            <div key={p.num} className={styles.principleCard}>
                                <div className={styles.principleLeft}>
                                    <span className={styles.principleIcon}>{p.icon}</span>
                                </div>
                                <div className={styles.principleRight}>
                                    <span className={styles.principleNum}>{p.num}</span>
                                    <h4 className={styles.principleTitle}>{p.title}</h4>
                                    <p className={styles.principleDesc}>{p.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── CTA strip ───────────────────────────────── */}
                <div className={styles.ctaStrip}>
                    <div className={styles.ctaStripLeft}>
                        <span className={styles.ctaStripKicker}>Ready to study?</span>
                        <h3 className={styles.ctaStripTitle}>Analyse your games with Stockfish</h3>
                        <p className={styles.ctaStripDesc}>
                            Import any game and let the engine show you where the opening went wrong.
                        </p>
                    </div>
                    <a href="/analysis" className={styles.ctaStripBtn}>
                        Open analyser →
                    </a>
                </div>
            </div>
        </PageWrapper>
    );
}

// ─── Mount ───────────────────────────────────────────────────────
const container = document.querySelector(".root");
if (container) {
    const root = createRoot(container);
    root.render(<Openings />);
}
