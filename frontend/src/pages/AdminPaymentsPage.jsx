import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';

const AdminPaymentsPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.username === 'admin') {
      fetchAdminStats();
    }
  }, [user]);

  const fetchAdminStats = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/payments/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        setError('Errore nel caricamento delle statistiche');
      }
    } catch (err) {
      setError('Errore di connessione');
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async (paymentId) => {
    if (!confirm('Sei sicuro di voler rimborsare questo pagamento?')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const reason = prompt('Motivo del rimborso:');
      if (!reason) return;

      const response = await fetch('http://localhost:5000/api/payments/admin/refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          paymentId,
          reason
        })
      });

      if (response.ok) {
        alert('✅ Rimborso processato con successo');
        fetchAdminStats(); // Ricarica le statistiche
      } else {
        alert('❌ Errore nel processare il rimborso');
      }
    } catch (err) {
      alert('❌ Errore di connessione');
    }
  };

  if (!user || user.username !== 'admin') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '40px',
          borderRadius: '20px',
          textAlign: 'center'
        }}>
          <h1>🚫 Accesso Negato</h1>
          <p>Solo gli amministratori possono accedere a questa pagina.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <div style={{textAlign: 'center'}}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid rgba(255,255,255,0.3)',
            borderTop: '3px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p>Caricamento statistiche...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <div style={{
          background: 'rgba(255, 0, 0, 0.1)',
          padding: '40px',
          borderRadius: '20px',
          textAlign: 'center'
        }}>
          <h1>❌ Errore</h1>
          <p>{error}</p>
          <button 
            onClick={fetchAdminStats}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '10px',
              cursor: 'pointer'
            }}
          >
            🔄 Riprova
          </button>
        </div>
      </div>
    );
  }

  const cardStyle = {
    background: 'white',
    borderRadius: '15px',
    padding: '25px',
    marginBottom: '20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h1 style={{
          color: 'white',
          textAlign: 'center',
          marginBottom: '40px',
          fontSize: '2.5rem'
        }}>
          🏦 Dashboard Admin - Pagamenti
        </h1>

        {/* Statistiche Generali */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={cardStyle}>
            <h3 style={{color: '#2d3748', marginBottom: '10px'}}>📊 Transazioni Totali</h3>
            <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#6366f1'}}>
              {stats?.totalTransactions || 0}
            </div>
            <div style={{fontSize: '14px', color: '#6b7280'}}>
              Crescita mensile: +{stats?.monthlyGrowth || 0}%
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={{color: '#2d3748', marginBottom: '10px'}}>💰 Volume Totale</h3>
            <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#10b981'}}>
              €{stats?.totalAmount?.toLocaleString() || '0'}
            </div>
            <div style={{fontSize: '14px', color: '#6b7280'}}>
              Media: €{stats?.averageTransaction?.toFixed(2) || '0'}
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={{color: '#2d3748', marginBottom: '10px'}}>🏦 Commissioni</h3>
            <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b'}}>
              €{stats?.totalCommissions?.toLocaleString() || '0'}
            </div>
            <div style={{fontSize: '14px', color: '#6b7280'}}>
              Fee: €{stats?.totalFees || '0'}
            </div>
          </div>
        </div>

        {/* Top Città */}
        <div style={cardStyle}>
          <h3 style={{color: '#2d3748', marginBottom: '20px'}}>🏛️ Top Città per Volume</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px'
          }}>
            {stats?.topCities?.map((city, index) => (
              <div key={city.city} style={{
                background: '#f8f9fa',
                padding: '15px',
                borderRadius: '10px',
                textAlign: 'center'
              }}>
                <div style={{fontSize: '24px', marginBottom: '5px'}}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏙️'}
                </div>
                <div style={{fontWeight: 'bold', marginBottom: '5px'}}>{city.city}</div>
                <div style={{color: '#6b7280', fontSize: '14px'}}>
                  {city.transactions} transazioni
                </div>
                <div style={{color: '#10b981', fontWeight: 'bold'}}>
                  €{city.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transazioni Recenti */}
        <div style={cardStyle}>
          <h3 style={{color: '#2d3748', marginBottom: '20px'}}>⏰ Transazioni Recenti</h3>
          
          <div style={{overflow: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{background: '#f8f9fa'}}>
                  <th style={{padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0'}}>ID</th>
                  <th style={{padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0'}}>Utente</th>
                  <th style={{padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0'}}>Importo</th>
                  <th style={{padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0'}}>Commissione</th>
                  <th style={{padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0'}}>Città</th>
                  <th style={{padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0'}}>Azioni</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentTransactions?.map((transaction) => (
                  <tr key={transaction.id} style={{borderBottom: '1px solid #f1f5f9'}}>
                    <td style={{padding: '12px'}}>#{transaction.id}</td>
                    <td style={{padding: '12px'}}>User #{transaction.userId}</td>
                    <td style={{padding: '12px', color: '#10b981', fontWeight: 'bold'}}>
                      €{transaction.amount.toFixed(2)}
                    </td>
                    <td style={{padding: '12px', color: '#f59e0b'}}>
                      €{transaction.commission.toFixed(2)}
                    </td>
                    <td style={{padding: '12px'}}>{transaction.city}</td>
                    <td style={{padding: '12px'}}>
                      <button
                        onClick={() => handleRefund(transaction.id)}
                        style={{
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        💸 Rimborso
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Actions Panel */}
        <div style={cardStyle}>
          <h3 style={{color: '#2d3748', marginBottom: '20px'}}>🛠️ Azioni Amministrative</h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px'
          }}>
            <button
              onClick={fetchAdminStats}
              style={{
                background: '#6366f1',
                color: 'white',
                border: 'none',
                padding: '15px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              🔄 Aggiorna Dati
            </button>
            
            <button
              onClick={() => window.open('/payment-test', '_blank')}
              style={{
                background: '#10b981',
                color: 'white',
                border: 'none',
                padding: '15px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              🧪 Test Pagamenti
            </button>
            
            <button
              onClick={() => alert('Feature in arrivo: Export dati')}
              style={{
                background: '#f59e0b',
                color: 'white',
                border: 'none',
                padding: '15px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              📊 Export Dati
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPaymentsPage;
