import React from "react";
import { createRoot } from "react-dom/client";

// Simple navigation header component for homepage
const Homepage: React.FC = () => {
    return (
        <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
            <h1 style={{ color: "#47acff", textAlign: "center", marginBottom: "30px" }}>
                Start analysing!
            </h1>
        </div>
    );
};

// Mount the component
const container = document.querySelector(".root");
if (container) {
    const root = createRoot(container);
    root.render(<Homepage />);
}