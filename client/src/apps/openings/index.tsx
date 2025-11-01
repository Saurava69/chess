import React from "react";
import { createRoot } from "react-dom/client";

// Simple openings component
const Openings: React.FC = () => {
    return (
        <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
            <h1 style={{ color: "#47acff", textAlign: "center", marginBottom: "30px" }}>
                Chess Openings Guide
            </h1>
            <p style={{ textAlign: "center", fontSize: "1.2em", color: "#666", marginBottom: "40px" }}>
                Master the most important chess openings and build your repertoire
            </p>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "20px" }}>
                <div style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "8px" }}>
                    <h3 style={{ color: "#47acff" }}>Queen's Gambit</h3>
                    <p><strong>1.d4 d5 2.c4</strong></p>
                    <p>The most classical chess opening, offering White excellent chances for initiative and positional pressure.</p>
                    <ul>
                        <li>Queen's Gambit Declined</li>
                        <li>Queen's Gambit Accepted</li>
                        <li>Slav Defense</li>
                        <li>Semi-Slav variations</li>
                    </ul>
                </div>
                
                <div style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "8px" }}>
                    <h3 style={{ color: "#47acff" }}>Sicilian Defense</h3>
                    <p><strong>1.e4 c5</strong></p>
                    <p>The most popular response to 1.e4, giving Black dynamic counterplay and winning chances.</p>
                    <ul>
                        <li>Najdorf Variation</li>
                        <li>Dragon Variation</li>
                        <li>Accelerated Dragon</li>
                        <li>Closed Sicilian</li>
                    </ul>
                </div>
                
                <div style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "8px" }}>
                    <h3 style={{ color: "#47acff" }}>Italian Game</h3>
                    <p><strong>1.e4 e5 2.Nf3 Nc6 3.Bc4</strong></p>
                    <p>One of the oldest and most instructive openings, focusing on rapid development and center control.</p>
                    <ul>
                        <li>Classical Italian</li>
                        <li>Italian Attack</li>
                        <li>Evans Gambit</li>
                        <li>Hungarian Defense</li>
                    </ul>
                </div>
                
                <div style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "8px" }}>
                    <h3 style={{ color: "#47acff" }}>Ruy Lopez</h3>
                    <p><strong>1.e4 e5 2.Nf3 Nc6 3.Bb5</strong></p>
                    <p>The Spanish Opening offers rich strategic content and deep positional understanding.</p>
                    <ul>
                        <li>Closed Ruy Lopez</li>
                        <li>Exchange Variation</li>
                        <li>Berlin Defense</li>
                        <li>Marshall Attack</li>
                    </ul>
                </div>
                
                <div style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "8px" }}>
                    <h3 style={{ color: "#47acff" }}>King's Indian Defense</h3>
                    <p><strong>1.d4 Nf6 2.c4 g6</strong></p>
                    <p>A hypermodern defense allowing White central control while preparing sharp counterattacks.</p>
                    <ul>
                        <li>Classical variation</li>
                        <li>Sämisch System</li>
                        <li>Four Pawns Attack</li>
                        <li>Fianchetto variation</li>
                    </ul>
                </div>
                
                <div style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "8px" }}>
                    <h3 style={{ color: "#47acff" }}>English Opening</h3>
                    <p><strong>1.c4</strong></p>
                    <p>A flexible flank opening that can transpose to many different structures and systems.</p>
                    <ul>
                        <li>Symmetrical variation</li>
                        <li>King's English</li>
                        <li>Reversed Sicilian</li>
                        <li>Four Knights system</li>
                    </ul>
                </div>
            </div>
            
            <div style={{ marginTop: "40px", padding: "20px", background: "#f9f9f9", borderRadius: "8px" }}>
                <h2 style={{ color: "#47acff", textAlign: "center" }}>Opening Principles</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginTop: "20px" }}>
                    <div>
                        <h4>1. Control the Center</h4>
                        <p>Fight for e4, e5, d4, d5 with pawns and pieces</p>
                    </div>
                    <div>
                        <h4>2. Develop Pieces</h4>
                        <p>Bring knights and bishops into active positions</p>
                    </div>
                    <div>
                        <h4>3. King Safety</h4>
                        <p>Castle early to protect your king</p>
                    </div>
                    <div>
                        <h4>4. Don't Move Twice</h4>
                        <p>Avoid moving the same piece multiple times</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Mount the component
const container = document.querySelector(".root");
if (container) {
    const root = createRoot(container);
    root.render(<Openings />);
}