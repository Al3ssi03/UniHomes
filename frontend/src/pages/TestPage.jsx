// 📁 src/pages/TestPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function TestPage() {
  const [backendStatus, setBackendStatus] = useState('testing');
  const [listings, setListings] = useState([]);
  const [authTest, setAuthTest] = useState(null);

  useEffect(() => {
    testBackend();
  }, []);

  const testBackend = async () => {
    try {
      console.log("🧪 Testing backend connection...");
      
      // Test announcements endpoint
      const res = await axios.get('http://localhost:5000/api/announcements');
      setListings(res.data.announcements || []);
      setBackendStatus('connected');
      console.log("✅ Backend connected successfully");
      
    } catch (err) {
      console.error("❌ Backend connection failed:", err);
      setBackendStatus('failed');
    }
  };

  const testLogin = async () => {
    try {
      console.log("🔐 Testing login with test user...");
      
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        username: 'mario.rossi',
        password: 'password123'
      });
      
      setAuthTest({ status: 'success', data: res.data });
      console.log("✅ Login successful:", res.data);
      
    } catch (err) {
      console.error("❌ Login failed:", err);
      setAuthTest({ status: 'failed', error: err.response?.data || err.message });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          🧪 AlloggiGinder - Sistema di Test
        </h1>

        {/* Backend Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Backend Status</h2>
          <div className="flex items-center mb-4">
            <span className="mr-3">Stato:</span>
            {backendStatus === 'testing' && <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">🔄 Testing...</span>}
            {backendStatus === 'connected' && <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">✅ Connesso</span>}
            {backendStatus === 'failed' && <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full">❌ Disconnesso</span>}
          </div>
          
          {backendStatus === 'connected' && (
            <div>
              <p className="text-green-600 mb-2">✅ Server backend raggiungibile su http://localhost:5000</p>
              <p className="text-gray-600">📋 {listings.length} annunci caricati dal database</p>
            </div>
          )}
          
          <button 
            onClick={testBackend}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            🔄 Riprova Test
          </button>
        </div>

        {/* Auth Test */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Test Autenticazione</h2>
          <p className="text-gray-600 mb-4">
            Test login con utente di prova: <code className="bg-gray-100 px-2 py-1 rounded">mario.rossi</code>
          </p>
          
          <button 
            onClick={testLogin}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
          >
            🔐 Test Login
          </button>
          
          {authTest && (
            <div className="mt-4 p-4 rounded-lg">
              {authTest.status === 'success' ? (
                <div className="bg-green-50 border border-green-200">
                  <p className="text-green-800 font-medium">✅ Login riuscito!</p>
                  <pre className="text-xs text-green-600 mt-2 overflow-auto">
                    {JSON.stringify(authTest.data, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200">
                  <p className="text-red-800 font-medium">❌ Login fallito</p>
                  <pre className="text-xs text-red-600 mt-2 overflow-auto">
                    {JSON.stringify(authTest.error, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Listings Preview */}
        {listings.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Anteprima Annunci</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.slice(0, 3).map(listing => (
                <div key={listing.id} className="border rounded-lg p-4">
                  <h3 className="font-bold text-gray-800">{listing.titolo}</h3>
                  <p className="text-gray-600">📍 {listing.città}</p>
                  <p className="text-blue-600 font-medium">€{listing.prezzo}/mese</p>
                  <p className="text-sm text-gray-500 mt-2">{listing.tipologia}</p>
                </div>
              ))}
            </div>
            {listings.length > 3 && (
              <p className="text-gray-500 text-center mt-4">
                ...e altri {listings.length - 3} annunci
              </p>
            )}
          </div>
        )}

        {/* Test Links */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Test Pages</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="/" className="bg-blue-600 text-white text-center py-3 rounded hover:bg-blue-700 transition-colors">
              🏠 Home
            </a>
            <a href="/auth" className="bg-green-600 text-white text-center py-3 rounded hover:bg-green-700 transition-colors">
              🔐 Login
            </a>
            <a href="/crea" className="bg-purple-600 text-white text-center py-3 rounded hover:bg-purple-700 transition-colors">
              ➕ Crea Annuncio
            </a>
            <a href="/i-miei-annunci" className="bg-orange-600 text-white text-center py-3 rounded hover:bg-orange-700 transition-colors">
              📋 I Miei Annunci
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
