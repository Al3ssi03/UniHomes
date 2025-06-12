// Test file to verify Vite processing
import React from 'react';
import ReactDOM from 'react-dom/client';

console.log('🔬 Test main.jsx loading...');
console.log('React available:', typeof React);
console.log('ReactDOM available:', typeof ReactDOM);

const root = document.getElementById('root');
console.log('Root element:', root);

if (root) {
    console.log('Creating root...');
    const reactRoot = ReactDOM.createRoot(root);
    console.log('Root created:', reactRoot);
    
    reactRoot.render(
        React.createElement('div', { 
            style: { 
                padding: '20px', 
                backgroundColor: '#4CAF50', 
                color: 'white', 
                fontSize: '24px' 
            } 
        }, 'SUCCESS: React is rendering!')
    );
    console.log('✅ Render complete');
} else {
    console.error('❌ No root element found');
}
