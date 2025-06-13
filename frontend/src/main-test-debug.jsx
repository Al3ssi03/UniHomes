import React from "react";
import ReactDOM from "react-dom/client";
import TestApp from "./App-Test-Debug.jsx";

console.log("🚀 Starting Test Debug App...");

const rootElement = document.getElementById("root");
console.log("Root element:", rootElement);

if (rootElement) {
    console.log("Creating React 18 root...");
    try {
        const root = ReactDOM.createRoot(rootElement);
        root.render(
            <React.StrictMode>
                <TestApp />
            </React.StrictMode>
        );
        console.log("✅ Test Debug App rendered successfully");
    } catch (error) {
        console.error("❌ Error rendering Test Debug App:", error);
        rootElement.innerHTML = `
            <div style="color: red; padding: 20px;">
                <h1>❌ Rendering Error</h1>
                <p>Error: ${error.message}</p>
                <pre>${error.stack}</pre>
            </div>
        `;
    }
} else {
    console.error("❌ Root element not found");
}
