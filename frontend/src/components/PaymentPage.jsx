import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import StripePaymentForm from './StripePaymentForm';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [paymentData, setPaymentData] = useState({
    amount: location.state?.amount || 0,
    description: location.state?.description || '',
    userId: null,
    announcementId: location.state?.announcementId || null,
    customerName: location.state?.customerName || '',
    customerEmail: location.state?.customerEmail || ''
  });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Gestione successo pagamento
  const handlePaymentSuccess = (paymentIntent) => {
    console.log('✅ Pagamento completato con successo:', paymentIntent);
    setPaymentSuccess(true);
    setError(null);
    
    // Mostra messaggio di successo e reindirizza
    setTimeout(() => {
      navigate('/dashboard', { 
        state: { 
          message: 'Pagamento completato con successo!',
          type: 'success'
        }
      });
    }, 3000);
  };

  // Gestione errore pagamento
  const handlePaymentError = (errorMessage) => {
    console.error('❌ Errore pagamento:', errorMessage);
    setError(errorMessage);
    setPaymentSuccess(false);
  };

  // Commissioni admin (5% su ogni transazione)
  const ADMIN_COMMISSION_RATE = 0.05;
  const calculateCommission = (amount) => amount * ADMIN_COMMISSION_RATE;
  const calculateTotal = (amount) => amount + calculateCommission(amount);

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    content: {
      maxWidth: '600px',
      width: '100%',
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '20px',
      padding: '40px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
    },
    title: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#2d3748',
      marginBottom: '30px',
      textAlign: 'center'
    },
    section: {
      marginBottom: '30px',
      padding: '25px',
      background: 'white',
      borderRadius: '15px',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
      border: '1px solid rgba(0, 0, 0, 0.05)'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '10px',
      fontSize: '16px',
      marginBottom: '15px',
      outline: 'none'
    },
    select: {
      width: '100%',
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '10px',
      fontSize: '16px',
      marginBottom: '15px',
      outline: 'none',
      background: 'white'
    },
    button: {
      width: '100%',
      padding: '15px',
      background: 'linear-gradient(135deg, #00ff88, #00cc66)',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      fontSize: '18px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    buttonSecondary: {
      width: '100%',
      padding: '15px',
      background: 'transparent',
      color: '#667eea',
      border: '2px solid #667eea',
      borderRadius: '10px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      marginBottom: '15px'
    },
    priceBreakdown: {
      background: '#f8f9fa',
      padding: '20px',
      borderRadius: '10px',
      marginBottom: '20px'
    },
    priceRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '10px',
      fontSize: '16px'
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '20px',
      fontWeight: '700',
      color: '#2d3748',
      borderTop: '2px solid #e2e8f0',
      paddingTop: '15px',
      marginTop: '15px'
    },
    securityBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      background: '#e6fffa',
      padding: '15px',
      borderRadius: '10px',
      marginBottom: '20px',
      border: '1px solid #81e6d9'
    },
    error: {
      background: '#fee2e2',
      color: '#dc2626',
      padding: '15px',
      borderRadius: '10px',
      marginBottom: '20px',
      border: '1px solid #fecaca'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>💳 Pagamento Sicuro</h1>

        {/* Badge Sicurezza */}
        <div style={styles.securityBadge}>
          <span style={{fontSize: '24px'}}>🔒</span>
          <div>
            <strong>Pagamento Protetto</strong>
            <div style={{fontSize: '14px', opacity: 0.8}}>
              I tuoi dati sono protetti con crittografia SSL e gestiti da Stripe
            </div>
          </div>
        </div>

        {/* Messaggio di Successo */}
        {paymentSuccess && (
          <div style={{
            background: '#d4edda',
            color: '#155724',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '20px',
            border: '1px solid #c3e6cb',
            textAlign: 'center'
          }}>
            ✅ <strong>Pagamento Completato con Successo!</strong>
            <div style={{marginTop: '10px', fontSize: '14px'}}>
              Sarai reindirizzato alla dashboard tra pochi secondi...
            </div>
          </div>
        )}

        {error && (
          <div style={styles.error}>
            ❌ {error}
          </div>
        )}

        {!paymentSuccess && (
          <>
            {/* Dettagli Pagamento */}
            <div style={styles.section}>
              <h3 style={{marginBottom: '20px'}}>💰 Dettagli Pagamento</h3>
              
              <div style={{marginBottom: '20px'}}>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: '600'}}>
                  Importo Base (€)
                </label>
                <input
                  type="number"
                  style={styles.input}
                  placeholder="Es. 500"
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData({...paymentData, amount: parseFloat(e.target.value) || 0})}
                />
              </div>

              <div style={{marginBottom: '20px'}}>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: '600'}}>
                  Descrizione
                </label>
                <input
                  type="text"
                  style={styles.input}
                  placeholder="Es. Caparra per appartamento in Via Roma"
                  value={paymentData.description}
                  onChange={(e) => setPaymentData({...paymentData, description: e.target.value})}
                />
              </div>

              <div style={{marginBottom: '20px'}}>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: '600'}}>
                  Nome Completo
                </label>
                <input
                  type="text"
                  style={styles.input}
                  placeholder="Es. Mario Rossi"
                  value={paymentData.customerName}
                  onChange={(e) => setPaymentData({...paymentData, customerName: e.target.value})}
                />
              </div>

              <div style={{marginBottom: '20px'}}>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: '600'}}>
                  Email
                </label>
                <input
                  type="email"
                  style={styles.input}
                  placeholder="Es. mario.rossi@email.com"
                  value={paymentData.customerEmail}
                  onChange={(e) => setPaymentData({...paymentData, customerEmail: e.target.value})}
                />
              </div>
            </div>

            {/* Metodo di Pagamento */}
            <div style={styles.section}>
              <h3 style={{marginBottom: '20px'}}>💳 Metodo di Pagamento</h3>
              
              <select
                style={styles.select}
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="stripe">💳 Carta di Credito/Debito (Stripe)</option>
                <option value="paypal">🟦 PayPal (Prossimamente)</option>
                <option value="bank">🏦 Bonifico Bancario (Prossimamente)</option>
              </select>

              {paymentMethod === 'stripe' && paymentData.amount > 0 && (
                <StripePaymentForm
                  paymentData={paymentData}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              )}

              {paymentMethod === 'paypal' && (
                <div style={{background: '#e6f3ff', padding: '15px', borderRadius: '10px', marginTop: '15px'}}>
                  <p style={{margin: '0 0 10px 0', fontWeight: '600'}}>🟦 PayPal</p>
                  <p style={{margin: 0, fontSize: '14px', opacity: 0.8}}>
                    Funzionalità PayPal in arrivo. Per ora utilizza il pagamento con carta.
                  </p>
                </div>
              )}

              {paymentMethod === 'bank' && (
                <div style={{background: '#fff5e6', padding: '15px', borderRadius: '10px', marginTop: '15px'}}>
                  <p style={{margin: '0 0 10px 0', fontWeight: '600'}}>🏦 Bonifico Bancario</p>
                  <p style={{margin: 0, fontSize: '14px', opacity: 0.8}}>
                    Funzionalità bonifico in arrivo. Per ora utilizza il pagamento con carta.
                  </p>
                </div>
              )}
            </div>

            {/* Pulsante Torna Indietro */}
            <button 
              style={styles.buttonSecondary}
              onClick={() => navigate(-1)}
            >
              ← Torna Indietro
            </button>
          </>
        )}

        {/* Informazioni Sicurezza */}
        <div style={{marginTop: '30px', padding: '20px', background: '#f8f9fa', borderRadius: '10px'}}>
          <h4 style={{margin: '0 0 15px 0', fontSize: '16px'}}>🛡️ Garanzie di Sicurezza</h4>
          <ul style={{margin: 0, paddingLeft: '20px', fontSize: '14px', opacity: 0.8}}>
            <li>Crittografia SSL a 256 bit per tutte le transazioni</li>
            <li>Conformità PCI DSS per la sicurezza dei dati</li>
            <li>Monitoraggio 24/7 per transazioni fraudolente</li>
            <li>Garanzia di rimborso in caso di problemi</li>
            <li>Supporto clienti disponibile 7 giorni su 7</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
