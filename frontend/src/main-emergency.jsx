// EMERGENCY WORKING VERSION - NO EXTERNAL DEPENDENCIES
console.log("🚨 EMERGENCY MODE ACTIVATED");

// Check if we have access to basic APIs
console.log("✅ Document:", typeof document !== 'undefined');
console.log("✅ Window:", typeof window !== 'undefined');

// Find root element
const root = document.getElementById('root');
console.log("✅ Root element found:", !!root);

if (!root) {
    console.error("❌ CRITICAL: No root element found!");
    document.body.innerHTML = '<h1 style="color: red; text-align: center; padding: 50px;">ERRORE: Elemento root non trovato!</h1>';
} else {
    console.log("🚀 Setting up emergency app...");
    
    // Clear any existing content
    root.innerHTML = '';
    
    // Create app directly with vanilla JS
    const app = document.createElement('div');
    app.style.cssText = `
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        color: white;
        padding: 20px;
        box-sizing: border-box;
    `;
    
    app.innerHTML = `
        <div style="
            text-align: center;
            background: rgba(255,255,255,0.1);
            padding: 40px;
            border-radius: 20px;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            max-width: 600px;
            width: 100%;
        ">
            <h1 style="
                font-size: 3rem;
                margin-bottom: 20px;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            ">
                🏠 AlloggiFinder
            </h1>
            
            <p style="
                font-size: 1.5rem;
                margin-bottom: 30px;
                opacity: 0.9;
            ">
                MODALITÀ EMERGENZA ATTIVA
            </p>
            
            <div style="
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 15px;
                margin: 30px 0;
            ">
                <div style="padding: 15px; background: rgba(40, 167, 69, 0.8); border-radius: 10px;">
                    ✅ HTML Caricato
                </div>
                <div style="padding: 15px; background: rgba(40, 167, 69, 0.8); border-radius: 10px;">
                    ✅ JS Funzionante
                </div>
                <div style="padding: 15px; background: rgba(40, 167, 69, 0.8); border-radius: 10px;">
                    ✅ Vite Server
                </div>
            </div>
            
            <button 
                id="testBtn"
                style="
                    background: rgba(255,255,255,0.2);
                    border: 2px solid rgba(255,255,255,0.3);
                    color: white;
                    padding: 15px 30px;
                    font-size: 18px;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin: 20px 10px;
                "
            >
                Test Interattività
            </button>
            
            <button 
                id="reactBtn"
                style="
                    background: rgba(0,123,255,0.8);
                    border: 2px solid rgba(0,123,255,1);
                    color: white;
                    padding: 15px 30px;
                    font-size: 18px;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin: 20px 10px;
                "
            >
                Carica React
            </button>
            
            <div id="status" style="
                margin-top: 30px;
                padding: 20px;
                background: rgba(0,0,0,0.2);
                border-radius: 10px;
                font-family: monospace;
                font-size: 14px;
                text-align: left;
            ">
                <strong>📊 Status Sistema:</strong><br>
                • URL: ${window.location.href}<br>
                • User Agent: ${navigator.userAgent.split(' ')[0]}<br>
                • Timestamp: ${new Date().toLocaleString()}<br>
                • Ready State: ${document.readyState}
            </div>
        </div>
    `;
    
    root.appendChild(app);
    
    // Add interactivity
    let clickCount = 0;
    document.getElementById('testBtn').addEventListener('click', function() {
        clickCount++;
        this.textContent = `Cliccato ${clickCount} volte!`;
        this.style.background = 'rgba(40, 167, 69, 0.8)';
        console.log(`✅ Button clicked ${clickCount} times`);
    });
    
    // React loading button
    document.getElementById('reactBtn').addEventListener('click', function() {
        console.log("🔄 Attempting to load React...");
        this.textContent = "Caricamento React...";
        this.disabled = true;
        
        // Try to load React from CDN
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/react@18/umd/react.development.js';
        script.onload = () => {
            console.log("✅ React loaded from CDN!");
            this.textContent = "✅ React Caricato!";
            this.style.background = 'rgba(40, 167, 69, 0.8)';
            
            // Now try to load ReactDOM
            const domScript = document.createElement('script');
            domScript.src = 'https://unpkg.com/react-dom@18/umd/react-dom.development.js';
            domScript.onload = () => {
                console.log("✅ ReactDOM loaded!");
                document.getElementById('status').innerHTML += '<br>✅ React 18 caricato da CDN!';
            };
            document.head.appendChild(domScript);
        };
        script.onerror = () => {
            console.error("❌ Failed to load React from CDN");
            this.textContent = "❌ Errore caricamento React";
            this.style.background = 'rgba(220, 53, 69, 0.8)';
        };
        document.head.appendChild(script);
    });
    
    console.log("✅ EMERGENCY APP LOADED SUCCESSFULLY!");
}

// Global error handling
window.onerror = function(msg, url, line, col, error) {
    console.error("🚨 GLOBAL ERROR:", msg, error);
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'position: fixed; top: 10px; right: 10px; background: red; color: white; padding: 10px; border-radius: 5px; z-index: 9999; max-width: 300px; font-size: 12px;';
    errorDiv.innerHTML = `<strong>ERROR:</strong><br>${msg}<br>Line: ${line}`;
    document.body.appendChild(errorDiv);
    return false;
};

console.log("🎯 Emergency script execution completed!");
