import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

console.log("🏠 UNI Home - Versione Originale Ripristinata...");

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
        console.log("✅ React app rendered successfully!");
    } catch (error) {
        console.error("❌ Error rendering React app:", error);
        document.body.innerHTML = `
            <div style="padding: 20px; color: red; font-family: Arial, sans-serif;">
                <h1>🏠 UNI Home - Errore di Caricamento</h1>
                <p>Si è verificato un errore durante il caricamento dell'applicazione.</p>
                <pre>${error.message}</pre>
                <p>Controlla la console per maggiori dettagli.</p>
            </div>
        `;
    }
} else {
    console.error("❌ Root element not found! Make sure there's a div with id='root' in index.html");
    document.body.innerHTML = `
        <div style="padding: 20px; color: red; font-family: Arial, sans-serif;">
            <h1>🏠 UNI Home - Errore di Configurazione</h1>
            <p>Elemento root non trovato. Assicurati che ci sia un div con id='root' nell'HTML.</p>
        </div>
    `;
}
