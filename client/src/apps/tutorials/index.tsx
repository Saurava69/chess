import React from "react";
import { createRoot } from "react-dom/client";

// Simple tutorials component
const Tutorials: React.FC = () => {
    return (
        <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
            <h1 style={{ color: "#47acff", textAlign: "center", marginBottom: "30px" }}>
                Chess Tutorials
            </h1>
            <p style={{ textAlign: "center", fontSize: "1.2em", color: "#666", marginBottom: "40px" }}>
                Master chess with our comprehensive tutorial series
            </p>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
                <div style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "8px" }}>
                    <h3>Chess Basics</h3>
                    <p>Learn the fundamentals: piece movement, special rules, and basic strategy.</p>
                </div>
                
                <div style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "8px" }}>
                    <h3>Opening Principles</h3>
                    <p>Master the key principles of chess openings and early game development.</p>
                </div>
                
                <div style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "8px" }}>
                    <h3>Tactical Patterns</h3>
                    <p>Study essential tactical motifs: pins, forks, skewers, and combinations.</p>
                </div>
                
                <div style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "8px" }}>
                    <h3>Chess Strategy</h3>
                    <p>Develop positional understanding and long-term planning skills.</p>
                </div>
                
                <div style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "8px" }}>
                    <h3>Essential Endgames</h3>
                    <p>Master the most important endgame positions and techniques.</p>
                </div>
                
                <div style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "8px" }}>
                    <h3>Improvement Tips</h3>
                    <p>Practical advice for systematic chess improvement and study methods.</p>
                </div>
            </div>
        </div>
    );
};

// Mount the component
const container = document.querySelector(".root");
if (container) {
    const root = createRoot(container);
    root.render(<Tutorials />);
}