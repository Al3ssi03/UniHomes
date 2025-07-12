const express = require('express');
const { authenticateToken } = require('./auth');
const User = require('../models/user');
const Announcement = require('../models/announcement');
const router = express.Router();

// MIDDLEWARE per verificare autenticazione
const requireAuth = authenticateToken;

// Configurazione commissioni
const ADMIN_COMMISSION_RATE = 0.05; // 5% di commissione
const PLATFORM_FEE = 2.00; // Fee fissa di €2

// POST - Crea intent di pagamento
router.post('/create-intent', requireAuth, async (req, res) => {
  try {
    const { amount, currency = 'eur', description, announcementId } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        message: 'Importo non valido' 
      });
    }
    
    // Calcola commissioni
    const baseAmount = parseFloat(amount);
    const adminCommission = Math.round(baseAmount * ADMIN_COMMISSION_RATE * 100) / 100;
    const platformFee = PLATFORM_FEE;
    const totalAmount = baseAmount + adminCommission + platformFee;
    
    console.log('💳 Creazione intent di pagamento:', {
      baseAmount,
      adminCommission,
      platformFee,
      totalAmount,
      userId: req.userId
    });
    
    // In un'implementazione reale, qui useresti Stripe:
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: Math.round(totalAmount * 100), // Stripe usa centesimi
    //   currency: currency,
    //   description: description,
    //   metadata: {
    //     userId: req.userId,
    //     announcementId: announcementId,
    //     adminCommission: adminCommission
    //   }
    // });
    
    // Per ora simula una risposta Stripe
    const mockPaymentIntent = {
      id: `pi_mock_${Date.now()}`,
      client_secret: `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
      amount: Math.round(totalAmount * 100),
      currency: currency,
      status: 'requires_payment_method',
      created: Math.floor(Date.now() / 1000),
      description: description,
      metadata: {
        userId: req.userId,
        announcementId: announcementId || null,
        adminCommission: Math.round(adminCommission * 100),
        platformFee: Math.round(platformFee * 100)
      }
    };
    
    // Salva la transazione nel database (opzionale)
    // await PaymentTransaction.create({
    //   userId: req.userId,
    //   announcementId: announcementId,
    //   paymentIntentId: mockPaymentIntent.id,
    //   amount: baseAmount,
    //   adminCommission: adminCommission,
    //   platformFee: platformFee,
    //   totalAmount: totalAmount,
    //   currency: currency,
    //   status: 'pending',
    //   description: description
    // });
    
    res.json({
      success: true,
      paymentIntent: mockPaymentIntent,
      breakdown: {
        baseAmount: baseAmount,
        adminCommission: adminCommission,
        platformFee: platformFee,
        totalAmount: totalAmount,
        currency: currency
      }
    });
    
  } catch (error) {
    console.error('Errore creazione intent di pagamento:', error);
    res.status(500).json({ 
      message: 'Errore durante la creazione del pagamento' 
    });
  }
});

// POST - Conferma pagamento
router.post('/confirm-payment', requireAuth, async (req, res) => {
  try {
    const { paymentIntentId, paymentMethodId } = req.body;
    
    if (!paymentIntentId) {
      return res.status(400).json({ 
        message: 'ID pagamento richiesto' 
      });
    }
    
    console.log('✅ Conferma pagamento:', {
      paymentIntentId,
      paymentMethodId,
      userId: req.userId
    });
    
    // In un'implementazione reale:
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
    //   payment_method: paymentMethodId
    // });
    
    // Simula conferma pagamento
    const mockConfirmation = {
      id: paymentIntentId,
      status: 'succeeded',
      amount_received: Math.floor(Math.random() * 100000) + 10000, // Importo random per demo
      currency: 'eur',
      created: Math.floor(Date.now() / 1000),
      receipt_url: `https://pay.stripe.com/receipts/mock_${paymentIntentId}`
    };
    
    // Aggiorna lo status nel database
    // await PaymentTransaction.update(
    //   { 
    //     status: 'completed',
    //     stripePaymentIntentId: paymentIntentId,
    //     completedAt: new Date()
    //   },
    //   { 
    //     where: { paymentIntentId: paymentIntentId } 
    //   }
    // );
    
    res.json({
      success: true,
      paymentIntent: mockConfirmation,
      message: 'Pagamento completato con successo'
    });
    
  } catch (error) {
    console.error('Errore conferma pagamento:', error);
    res.status(500).json({ 
      message: 'Errore durante la conferma del pagamento' 
    });
  }
});

// GET - Recupera storico pagamenti dell'utente
router.get('/history', requireAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    // In un'implementazione reale recupereresti dal database:
    // const payments = await PaymentTransaction.findAndCountAll({
    //   where: { userId: req.userId },
    //   order: [['createdAt', 'DESC']],
    //   limit: parseInt(limit),
    //   offset: (parseInt(page) - 1) * parseInt(limit),
    //   include: [
    //     {
    //       model: Announcement,
    //       attributes: ['id', 'titolo', 'citta']
    //     }
    //   ]
    // });
    
    // Per ora restituisce dati mock
    const mockPayments = [
      {
        id: 1,
        amount: 500.00,
        adminCommission: 25.00,
        platformFee: 2.00,
        totalAmount: 527.00,
        currency: 'EUR',
        status: 'completed',
        description: 'Caparra appartamento Via Roma',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 giorni fa
        announcement: {
          id: 1,
          titolo: 'Appartamento in Centro',
          citta: 'Roma'
        }
      },
      {
        id: 2,
        amount: 300.00,
        adminCommission: 15.00,
        platformFee: 2.00,
        totalAmount: 317.00,
        currency: 'EUR',
        status: 'pending',
        description: 'Camera singola zona universitaria',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 giorni fa
        announcement: {
          id: 2,
          titolo: 'Camera Singola Universitaria',
          citta: 'Milano'
        }
      }
    ];
    
    res.json({
      payments: mockPayments,
      totalCount: mockPayments.length,
      totalPages: Math.ceil(mockPayments.length / parseInt(limit)),
      currentPage: parseInt(page)
    });
    
  } catch (error) {
    console.error('Errore recupero storico pagamenti:', error);
    res.status(500).json({ 
      message: 'Errore durante il recupero dello storico' 
    });
  }
});

// GET - Recupera statistiche pagamenti (solo admin)
router.get('/admin/stats', requireAuth, async (req, res) => {
  try {
    // Verifica che l'utente sia admin
    const user = await User.findByPk(req.userId);
    if (!user || user.username !== 'admin') {
      return res.status(403).json({ 
        message: 'Accesso negato: privilegi admin richiesti' 
      });
    }
    
    // In un'implementazione reale:
    // const stats = await PaymentTransaction.findAll({
    //   attributes: [
    //     [sequelize.fn('COUNT', sequelize.col('id')), 'totalTransactions'],
    //     [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount'],
    //     [sequelize.fn('SUM', sequelize.col('adminCommission')), 'totalCommissions'],
    //     [sequelize.fn('SUM', sequelize.col('platformFee')), 'totalFees']
    //   ],
    //   where: { status: 'completed' }
    // });
    
    // Dati mock per l'admin
    const mockStats = {
      totalTransactions: 156,
      totalAmount: 78500.00,
      totalCommissions: 3925.00,
      totalFees: 312.00,
      averageTransaction: 503.21,
      monthlyGrowth: 12.5,
      topCities: [
        { city: 'Roma', transactions: 45, amount: 22500.00 },
        { city: 'Milano', transactions: 38, amount: 19000.00 },
        { city: 'Firenze', transactions: 28, amount: 14000.00 },
        { city: 'Bologna', transactions: 25, amount: 12500.00 },
        { city: 'Napoli', transactions: 20, amount: 10500.00 }
      ],
      recentTransactions: [
        {
          id: 156,
          userId: 23,
          amount: 450.00,
          commission: 22.50,
          city: 'Roma',
          createdAt: new Date()
        }
      ]
    };
    
    res.json(mockStats);
    
  } catch (error) {
    console.error('Errore recupero statistiche admin:', error);
    res.status(500).json({ 
      message: 'Errore durante il recupero delle statistiche' 
    });
  }
});

// POST - Rimborso (solo admin)
router.post('/admin/refund', requireAuth, async (req, res) => {
  try {
    const { paymentId, reason, amount } = req.body;
    
    // Verifica che l'utente sia admin
    const user = await User.findByPk(req.userId);
    if (!user || user.username !== 'admin') {
      return res.status(403).json({ 
        message: 'Accesso negato: privilegi admin richiesti' 
      });
    }
    
    if (!paymentId || !reason) {
      return res.status(400).json({ 
        message: 'ID pagamento e motivo del rimborso sono obbligatori' 
      });
    }
    
    console.log('💰 Rimborso richiesto dall\'admin:', {
      paymentId,
      reason,
      amount,
      adminId: req.userId
    });
    
    // In un'implementazione reale:
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // const refund = await stripe.refunds.create({
    //   payment_intent: paymentId,
    //   amount: amount ? Math.round(amount * 100) : undefined,
    //   reason: 'requested_by_customer',
    //   metadata: {
    //     reason: reason,
    //     adminId: req.userId
    //   }
    // });
    
    // Simula rimborso
    const mockRefund = {
      id: `re_mock_${Date.now()}`,
      amount: amount ? Math.round(amount * 100) : Math.floor(Math.random() * 50000) + 10000,
      currency: 'eur',
      created: Math.floor(Date.now() / 1000),
      payment_intent: paymentId,
      reason: 'requested_by_customer',
      status: 'succeeded'
    };
    
    res.json({
      success: true,
      refund: mockRefund,
      message: 'Rimborso processato con successo'
    });
    
  } catch (error) {
    console.error('Errore rimborso:', error);
    res.status(500).json({ 
      message: 'Errore durante il rimborso' 
    });
  }
});

module.exports = router;
