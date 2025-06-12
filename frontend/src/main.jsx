import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App-Fixed.jsx";
// import "./index.css"; // Commentato per evitare problemi CSS

console.log("🚀 AlloggiFinder - App Completa con Routing...");

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
        console.log("✅ AlloggiFinder rendered successfully");
    } catch (error) {
        console.error("❌ Error rendering app:", error);
        // Fallback di emergenza
        rootElement.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-family: Arial, sans-serif; text-align: center;">
                <div>
                    <h1>🚨 Errore di Rendering</h1>
                    <p>Errore: ${error.message}</p>
                    <button onclick="location.reload()" style="padding: 10px 20px; margin: 10px; border: none; border-radius: 5px; background: #ff4444; color: white; cursor: pointer;">
                        Ricarica
                    </button>
                </div>
            </div>
        `;
    }
} else {
    console.error("❌ Root element not found!");
}
