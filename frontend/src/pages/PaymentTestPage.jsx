import React, { useState } from 'react';
import StripePaymentForm from '../components/StripePaymentForm';

const PaymentTestPage = () => {
  const [testPaymentData, setTestPaymentData] = useState({
    amount: 50,
    description: 'Test pagamento UniHomes',
    announcementId: 1,
    customerName: 'Test User',
    customerEmail: 'test@example.com'
  });

  const handlePaymentSuccess = (paymentIntent) => {
    console.log('✅ Pagamento test completato:', paymentIntent);
    alert(`✅ Pagamento test completato con successo!\nID: ${paymentIntent.id}\nStatus: ${paymentIntent.status}`);
  };

  const handlePaymentError = (error) => {
    console.error('❌ Errore pagamento test:', error);
    alert(`❌ Errore nel pagamento test: ${error}`);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h1 style={{
          color: 'white',
          textAlign: 'center',
          marginBottom: '30px',
          fontSize: '2.5rem'
        }}>
          🧪 Test Pagamenti Stripe
        </h1>

        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <h2>🎛️ Configura Test</h2>
          
          <div style={{marginBottom: '15px'}}>
            <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>
              Importo (€):
            </label>
            <input
              type="number"
              value={testPaymentData.amount}
              onChange={(e) => setTestPaymentData({
                ...testPaymentData,
                amount: parseFloat(e.target.value) || 0
              })}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px'
              }}
            />
          </div>

          <div style={{marginBottom: '15px'}}>
            <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>
              Descrizione:
            </label>
            <input
              type="text"
              value={testPaymentData.description}
              onChange={(e) => setTestPaymentData({
                ...testPaymentData,
                description: e.target.value
              })}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px'
              }}
            />
          </div>

          <div style={{
            background: '#f0f8ff',
            padding: '15px',
            borderRadius: '10px',
            border: '1px solid #b3d9ff'
          }}>
            <h3>💳 Dati di Test Stripe</h3>
            <p><strong>Carta Test:</strong> 4242 4242 4242 4242</p>
            <p><strong>Data di Scadenza:</strong> Qualsiasi data futura (es: 12/25)</p>
            <p><strong>CVC:</strong> Qualsiasi 3 cifre (es: 123)</p>
            <p><strong>Nome:</strong> Qualsiasi nome</p>
            <p><strong>ZIP:</strong> Qualsiasi ZIP (es: 12345)</p>
          </div>
        </div>

        {/* Form di Pagamento Stripe */}
        <StripePaymentForm
          paymentData={testPaymentData}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />

        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '15px',
          padding: '20px',
          marginTop: '20px',
          color: 'white'
        }}>
          <h3>📊 Informazioni di Test</h3>
          <ul style={{margin: 0, paddingLeft: '20px'}}>
            <li>Importo Base: €{testPaymentData.amount}</li>
            <li>Commissione (5%): €{(testPaymentData.amount * 0.05).toFixed(2)}</li>
            <li>Totale: €{(testPaymentData.amount * 1.05).toFixed(2)}</li>
            <li>Modalità: Test Stripe</li>
          </ul>
          
          <div style={{
            marginTop: '20px',
            padding: '15px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '10px'
          }}>
            <strong>🔧 Note per lo Sviluppo:</strong>
            <ul style={{margin: '10px 0 0 0', paddingLeft: '20px', fontSize: '14px'}}>
              <li>In produzione sostituire con chiavi Stripe reali</li>
              <li>Configurare webhook per gestire eventi</li>
              <li>Implementare logging avanzato</li>
              <li>Aggiungere notifiche email per conferme</li>
              <li>Testare errori e casi edge</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentTestPage;
