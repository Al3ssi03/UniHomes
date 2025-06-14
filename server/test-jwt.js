const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('./models/user');

async function testJWTAuth() {
  try {
    console.log('🧪 Test Autenticazione JWT...');
    
    // Trova un utente esistente
    const users = await User.findAll();
    if (users.length === 0) {
      console.log('❌ Nessun utente nel database');
      return;
    }
    
    const testUser = users[0];
    console.log('👤 Utente test:', testUser.nome, testUser.username);
    
    // Genera un token valido
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    console.log('🔑 JWT Secret:', secret);
    
    const token = jwt.sign(
      { userId: testUser.id, username: testUser.username },
      secret,
      { expiresIn: '1h' }
    );
    
    console.log('🎫 Token generato:', token.substring(0, 50) + '...');
    
    // Verifica il token
    try {
      const decoded = jwt.verify(token, secret);
      console.log('✅ Token valido, decoded:', decoded);
    } catch (verifyError) {
      console.log('❌ Token non valido:', verifyError.message);
    }
    
    console.log('\n📋 Per testare nel frontend, usa questo token:');
    console.log('localStorage.setItem("authToken", "' + token + '");');
    
  } catch (error) {
    console.error('❌ Errore:', error);
  } finally {
    process.exit();
  }
}

testJWTAuth();
