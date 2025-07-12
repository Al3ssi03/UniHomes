import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';

// Carica Stripe (sostituisci con la tua chiave pubblica)
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx'); // TEST KEY - sostituire in produzione

// Stili per CardElement
const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
    },
    invalid: {
      color: '#9e2146',
    },
  },
  hidePostalCode: false,
};

// Componente del form di pagamento
const CheckoutForm = ({ paymentData, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState('');

  // Calcola commissioni
  const ADMIN_COMMISSION_RATE = 0.05;
  const calculateCommission = (amount) => amount * ADMIN_COMMISSION_RATE;
  const calculateTotal = (amount) => amount + calculateCommission(amount);

  useEffect(() => {
    // Crea payment intent quando il componente viene montato
    if (paymentData.amount > 0) {
      createPaymentIntent();
    }
  }, [paymentData.amount]);

  const createPaymentIntent = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: Math.round(calculateTotal(paymentData.amount) * 100), // Stripe usa centesimi
          currency: 'eur',
          description: paymentData.description,
          announcementId: paymentData.announcementId
        })
      });

      if (response.ok) {
        const data = await response.json();
        setClientSecret(data.paymentIntent.client_secret);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Errore nel creare il pagamento');
      }
    } catch (err) {
      console.error('Errore creazione payment intent:', err);
      setError('Errore di connessione');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    try {
      // Conferma il pagamento
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: paymentData.customerName || 'Cliente UniHomes',
            email: paymentData.customerEmail || '',
          },
        }
      });

      if (error) {
        console.error('Errore pagamento:', error);
        setError(error.message);
        onError(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        console.log('✅ Pagamento completato:', paymentIntent);
        onSuccess(paymentIntent);
      }
    } catch (err) {
      console.error('Errore durante il pagamento:', err);
      setError('Errore durante il pagamento');
      onError('Errore durante il pagamento');
    } finally {
      setProcessing(false);
    }
  };

  const styles = {
    form: {
      background: 'white',
      padding: '30px',
      borderRadius: '15px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      marginBottom: '20px'
    },
    cardContainer: {
      background: '#f8f9fa',
      padding: '20px',
      borderRadius: '10px',
      border: '1px solid #e2e8f0',
      marginBottom: '20px'
    },
    button: {
      width: '100%',
      padding: '15px',
      background: processing ? '#6c757d' : 'linear-gradient(135deg, #00ff88, #00cc66)',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      fontSize: '18px',
      fontWeight: '600',
      cursor: processing ? 'not-allowed' : 'pointer',
      transition: 'all 0.3s ease'
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
    error: {
      background: '#fee2e2',
      color: '#dc2626',
      padding: '15px',
      borderRadius: '10px',
      marginBottom: '20px',
      border: '1px solid #fecaca'
    },
    securityInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      background: '#e6fffa',
      padding: '15px',
      borderRadius: '10px',
      marginBottom: '20px',
      border: '1px solid #81e6d9',
      fontSize: '14px'
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3 style={{marginBottom: '20px', fontSize: '20px', fontWeight: '700'}}>
        💳 Dettagli Carta di Credito
      </h3>

      {/* Informazioni Sicurezza */}
      <div style={styles.securityInfo}>
        <span style={{fontSize: '24px'}}>🔒</span>
        <div>
          <strong>Pagamento Sicuro con Stripe</strong>
          <div style={{opacity: 0.8}}>
            I tuoi dati sono crittografati e protetti secondo gli standard PCI DSS
          </div>
        </div>
      </div>

      {error && (
        <div style={styles.error}>
          ❌ {error}
        </div>
      )}

      {/* Riepilogo Prezzi */}
      {paymentData.amount > 0 && (
        <div style={styles.priceBreakdown}>
          <h4 style={{margin: '0 0 15px 0'}}>📊 Riepilogo Pagamento</h4>
          
          <div style={styles.priceRow}>
            <span>Importo Base:</span>
            <span>€{paymentData.amount.toFixed(2)}</span>
          </div>
          
          <div style={styles.priceRow}>
            <span>Commissione Piattaforma (5%):</span>
            <span>€{calculateCommission(paymentData.amount).toFixed(2)}</span>
          </div>
          
          <div style={styles.totalRow}>
            <span>Totale:</span>
            <span>€{calculateTotal(paymentData.amount).toFixed(2)}</span>
          </div>
          
          <div style={{fontSize: '12px', opacity: 0.7, marginTop: '10px'}}>
            ℹ️ {paymentData.description}
          </div>
        </div>
      )}

      {/* Campo Carta */}
      <div style={styles.cardContainer}>
        <label style={{display: 'block', marginBottom: '10px', fontWeight: '600'}}>
          💳 Informazioni Carta
        </label>
        <CardElement options={cardElementOptions} />
      </div>

      {/* Informazioni di Test */}
      <div style={{
        background: '#fff3cd',
        padding: '15px',
        borderRadius: '10px',
        marginBottom: '20px',
        border: '1px solid #ffeaa7',
        fontSize: '14px'
      }}>
        <strong>🧪 Modalità Test</strong>
        <div style={{marginTop: '5px'}}>
          Usa la carta test: <code>4242 4242 4242 4242</code><br/>
          Data: qualsiasi futura | CVC: qualsiasi 3 cifre
        </div>
      </div>

      <button 
        type="submit" 
        disabled={!stripe || processing || !paymentData.amount}
        style={styles.button}
      >
        {processing 
          ? '⏳ Elaborazione...' 
          : `💳 Paga €${paymentData.amount > 0 ? calculateTotal(paymentData.amount).toFixed(2) : '0.00'}`
        }
      </button>
    </form>
  );
};

// Componente wrapper principale
const StripePaymentForm = ({ paymentData, onSuccess, onError }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm 
        paymentData={paymentData}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
};

export default StripePaymentForm;
