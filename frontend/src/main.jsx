import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App-UNIHome-Complete-Fixed.jsx";
// import TestApp from "./App-Test-Debug.jsx";
// import "./index.css"; // Commentato per evitare problemi CSS

console.log("🚀 UNI Home - App Completa con Fix Bug...");

const rootElement = document.getElementById("root");
console.log("Root element:", rootElement);

if (rootElement) {
    console.log("Creating React 18 root...");
    try {
        const root = ReactDOM.createRoot(rootElement);
        root.render(
            <React.StrictMode>
                <App />
            </React.StrictMode>
        );
        console.log("✅ UNI Home App rendered successfully");
    } catch (error) {
        console.error("❌ Error rendering app:", error);
        // Fallback di emergenza
        rootElement.innerHTML = `            <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: linear-gradient(135deg, #6366f1 0%, #06b6d4 100%); color: white; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; text-align: center;">
                <div>
                    <h1>🏠 UNI Home - Errore di Rendering</h1>
                    <p>Errore: ${error.message}</p>
                    <button onclick="location.reload()" style="padding: 12px 24px; margin: 10px; border: none; border-radius: 8px; background: #6366f1; color: white; cursor: pointer; font-weight: 600; transition: all 0.2s;">
                        Ricarica App
                    </button>
                </div>
            </div>
        `;
    }
} else {
    console.error("❌ Root element not found!");
}
