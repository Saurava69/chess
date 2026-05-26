import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";

import PageWrapper from "@/components/layout/PageWrapper";
import { removeDefaultConsentLink } from "@/lib/consent";

import "@/i18n";
import "@/index.css";
import * as styles from "./Homepage.module.css";

import iconAnalysis from "@assets/img/icons/analysis.png";
import iconArchive from "@assets/img/icons/archive.png";
import iconNews from "@assets/img/icons/news.png";
import iconSettings from "@assets/img/icons/settings.png";

/* ─── Hero board data ─────────────────────────────────────────── */
const HERO_BOARD: Array<Array<{ piece?: string; color?: "w" | "b" }>> = [
    [{ piece: "♜", color: "b" }, { piece: "♞", color: "b" }, { piece: "♝", color: "b" }, { piece: "♛", color: "b" }, { piece: "♚", color: "b" }, { piece: "♝", color: "b" }, { piece: "♞", color: "b" }, { piece: "♜", color: "b" }],
    [{ piece: "♟", color: "b" }, { piece: "♟", color: "b" }, { piece: "♟", color: "b" }, { piece: "♟", color: "b" }, {}, { piece: "♟", color: "b" }, { piece: "♟", color: "b" }, { piece: "♟", color: "b" }],
    [{}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, { piece: "♟", color: "b" }, {}, {}, {}],
    [{}, {}, {}, {}, { piece: "♙", color: "w" }, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}],
    [{ piece: "♙", color: "w" }, { piece: "♙", color: "w" }, { piece: "♙", color: "w" }, { piece: "♙", color: "w" }, {}, { piece: "♙", color: "w" }, { piece: "♙", color: "w" }, { piece: "♙", color: "w" }],
    [{ piece: "♖", color: "w" }, { piece: "♘", color: "w" }, { piece: "♗", color: "w" }, { piece: "♕", color: "w" }, { piece: "♔", color: "w" }, { piece: "♗", color: "w" }, { piece: "♘", color: "w" }, { piece: "♖", color: "w" }],
];
const LAST_MOVE = new Set(["4-4", "3-4"]);

function HeroBoard() {
    const squares: React.ReactNode[] = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const dark = (r + c) % 2 === 1;
            const cell = HERO_BOARD[r][c];
            const key = `${r}-${c}`;
            squares.push(
                <div
                    key={key}
                    className={[
                        styles.square,
                        dark ? styles.squareDark : styles.squareLight,
                        LAST_MOVE.has(key) ? styles.lastMove : ""
                    ].join(" ")}
                >
                    {cell.piece && (
                        <span
                            className={[
                                styles.piece,
                                cell.color === "w" ? styles.pieceWhite : styles.pieceBlack
                            ].join(" ")}
                            style={{ animationDelay: `${(r * 8 + c) * 10}ms` }}
                        >
                            {cell.piece}
                        </span>
                    )}
                </div>
            );
        }
    }

    return (
        <div className={`${styles.boardOuter} ${styles.fadeIn}`} style={{ animationDelay: "200ms" }}>
            {/* Top player — black */}
            <div className={styles.boardPlayers}>
                <div className={styles.boardPlayer}>
                    <div className={styles.playerAvatar}><span>♚</span></div>
                    <div>
                        <div className={styles.playerName}>Magnus_C</div>
                        <div className={styles.playerRating}>2847</div>
                    </div>
                </div>
                <div className={styles.clockBadge}>5:00</div>
            </div>

            <div className={styles.boardFrame}>
                <div className={styles.board}>{squares}</div>
            </div>

            {/* Bottom player — white */}
            <div className={styles.boardPlayers}>
                <div className={styles.boardPlayer}>
                    <div className={styles.playerAvatar}><span>♔</span></div>
                    <div>
                        <div className={styles.playerName}>Hikaru_N</div>
                        <div className={styles.playerRating}>2736</div>
                    </div>
                </div>
                <div className={`${styles.clockBadge} ${styles.active}`}>4:47</div>
            </div>

            <div className={styles.moveTicker}>
                <div className={styles.moveTickerDot} />
                <span className={styles.moveTickerText}>
                    1. e4 e5 &nbsp;·&nbsp; <span className={styles.moveTickerMove}>2. Nf3 Nc6</span>
                </span>
            </div>
        </div>
    );
}

/* ─── Mini puzzle board ───────────────────────────────────────── */
function MiniBoard() {
    const cells: React.ReactNode[] = [];
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            const dark = (r + c) % 2 === 1;
            cells.push(
                <div
                    key={`${r}-${c}`}
                    className={`${styles.square} ${dark ? styles.squareDark : styles.squareLight}`}
                />
            );
        }
    }
    return (
        <div className={styles.puzzleMiniWrap}>
            <div className={styles.puzzleMini}>{cells}</div>
            <div className={styles.puzzleMiniPiece}>♞</div>
        </div>
    );
}

/* ─── Feature tiles ───────────────────────────────────────────── */
interface FeatureTile {
    icon: string;
    label: string;
    desc: string;
    href: string;
    cta: string;
}

const FEATURES: FeatureTile[] = [
    {
        icon: iconAnalysis,
        label: "Analyse",
        desc: "Deep-dive any position with Stockfish. Find blunders, brilliant moves, and missed wins.",
        href: "/analysis",
        cta: "Open board"
    },
    {
        icon: iconArchive,
        label: "Archive",
        desc: "Browse and search every game you've imported, organised exactly the way you like.",
        href: "/archive",
        cta: "Browse games"
    },
    {
        icon: iconNews,
        label: "News",
        desc: "Stay sharp — latest tournaments, results, and stories from the chess world.",
        href: "/news",
        cta: "Read latest"
    },
    {
        icon: iconSettings,
        label: "Openings",
        desc: "Study lines, branches, and the theory behind the moves the masters play.",
        href: "/openings",
        cta: "Study lines"
    },
];

/* ─── Homepage ────────────────────────────────────────────────── */
function Homepage() {
    useEffect(() => {
        removeDefaultConsentLink();
        const seo = document.getElementById("seo-content");
        if (seo) seo.style.display = "none";
    }, []);

    return (
        <PageWrapper>
            <div className={styles.shell}>

                {/* ── Hero ───────────────────────────────────────── */}
                <section className={styles.hero}>
                    <div className={styles.fadeIn} style={{ animationDelay: "40ms" }}>
                        <span className={styles.eyebrow}>
                            Stockfish · Free · No sign-up
                        </span>

                        <h1 className={styles.title}>
                            Play sharper.{" "}
                            <span className={styles.titleAccent}>Analyse deeper.</span>
                        </h1>

                        <p className={styles.subtitle}>
                            A free chess workshop powered by Stockfish — analyse your
                            games, archive every move, and study the openings that
                            actually win.
                        </p>

                        <div className={styles.ctaRow}>
                            <a href="/analysis" className={styles.ctaPrimary}>
                                Start analysing
                                <span className={styles.ctaArrow}>→</span>
                            </a>
                            <a href="/archive" className={styles.ctaSecondary}>
                                Browse archive
                            </a>
                        </div>

                        <div className={styles.statsStrip}>
                            <div className={styles.statItem}>
                                <span className={styles.statValue}>1.2M+</span>
                                <span className={styles.statLabel}>Games analysed</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statValue}>Depth 22</span>
                                <span className={styles.statLabel}>Stockfish engine</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statValue}>$0</span>
                                <span className={styles.statLabel}>Forever free</span>
                            </div>
                        </div>
                    </div>

                    <HeroBoard />
                </section>

                {/* ── Live stats bar ──────────────────────────────── */}
                <div className={styles.statsBar}>
                    <div className={styles.statsBarInner}>
                        <div className={styles.statBarItem}>
                            <div className={styles.statBarDot} />
                            <span className={styles.statBarValue}>2,847</span>
                            <span className={styles.statBarLabel}>players online</span>
                        </div>
                        <div className={styles.statBarItem}>
                            <div className={styles.statBarDot} />
                            <span className={styles.statBarValue}>312</span>
                            <span className={styles.statBarLabel}>games in progress</span>
                        </div>
                        <div className={styles.statBarItem}>
                            <div className={styles.statBarDot} />
                            <span className={styles.statBarValue}>89</span>
                            <span className={styles.statBarLabel}>analyses today</span>
                        </div>
                    </div>
                </div>

                {/* ── Features grid ───────────────────────────────── */}
                <section className={styles.featuresSection}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Everything you need</h2>
                        <a className={styles.sectionLink} href="/help">
                            How it works →
                        </a>
                    </div>

                    <div className={styles.featureGrid}>
                        {FEATURES.map((tile, i) => (
                            <a
                                key={tile.label}
                                href={tile.href}
                                className={`${styles.featureTile} ${styles.fadeIn}`}
                                style={{ animationDelay: `${300 + i * 65}ms` }}
                            >
                                <div className={styles.featureTileGlow} />
                                <div className={styles.tileIconWrap}>
                                    <img src={tile.icon} alt="" />
                                </div>
                                <h3 className={styles.tileTitle}>{tile.label}</h3>
                                <p className={styles.tileDesc}>{tile.desc}</p>
                                <span className={styles.tileCta}>
                                    {tile.cta}
                                    <span className={styles.tileCtaArrow}> →</span>
                                </span>
                            </a>
                        ))}
                    </div>
                </section>

                {/* ── Bottom cards ────────────────────────────────── */}
                <div className={styles.bottomRow}>
                    {/* Puzzle card */}
                    <div className={`${styles.puzzleCard} ${styles.fadeIn}`} style={{ animationDelay: "520ms" }}>
                        <MiniBoard />
                        <div className={styles.puzzleBody}>
                            <span className={styles.kicker}>Daily Puzzle</span>
                            <h3 className={styles.puzzleTitle}>White to move and win</h3>
                            <p className={styles.puzzleDesc}>
                                Sharpen your tactics with a fresh problem every day — pins,
                                forks, and quiet moves that decide the game.
                            </p>
                            <a className={styles.puzzleCta} href="/analysis">
                                Solve today's puzzle
                            </a>
                        </div>
                    </div>

                    {/* Engine card */}
                    <div className={`${styles.engineCard} ${styles.fadeIn}`} style={{ animationDelay: "600ms" }}>
                        <span className={styles.engineKicker}>Engine readout</span>
                        <h3 className={styles.engineTitle}>Stockfish, your second brain</h3>
                        <div className={styles.engineBars}>
                            {[
                                { move: "e4",  pct: "91%", score: "+0.32", delay: "680ms" },
                                { move: "d4",  pct: "76%", score: "+0.21", delay: "760ms" },
                                { move: "Nf3", pct: "60%", score: "+0.15", delay: "840ms" },
                                { move: "c4",  pct: "52%", score: "+0.12", delay: "920ms" },
                            ].map(bar => (
                                <div className={styles.engineBar} key={bar.move}>
                                    <span className={styles.engineMove}>{bar.move}</span>
                                    <div className={styles.engineBarTrack}>
                                        <div
                                            className={styles.engineBarFill}
                                            style={{ width: bar.pct, animationDelay: bar.delay }}
                                        />
                                    </div>
                                    <span className={styles.engineBarScore}>{bar.score}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </PageWrapper>
    );
}

const container = document.querySelector(".root");
if (container) {
    const root = createRoot(container);
    root.render(<Homepage />);
}
