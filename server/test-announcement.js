const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const Announcement = require('./models/announcement');

async function testAnnouncementCreation() {
  try {
    console.log('🧪 Test Creazione Annuncio...');
    
    // Verifica che ci sia almeno un utente
    const users = await User.findAll();
    console.log('📋 Utenti nel database:', users.length);
    
    if (users.length === 0) {
      console.log('❌ Nessun utente trovato nel database');
      return;
    }
    
    const testUser = users[0];
    console.log('👤 Utente test:', testUser.nome, testUser.username);
    
    // Dati di test
    const testData = {
      titolo: 'Test Annuncio Debug',
      descrizione: 'Questo è un test per debug',
      prezzo: 750,
      città: 'Milano Test',
      indirizzo: 'Via Test Debug 456',
      userId: testUser.id
    };
    
    console.log('📝 Dati test:', testData);
    
    // Crea annuncio direttamente nel database
    const newAnnouncement = await Announcement.create(testData);
    console.log('✅ Annuncio creato con successo!');
    console.log('🆔 ID annuncio:', newAnnouncement.id);
    console.log('📋 Dettagli:', {
      id: newAnnouncement.id,
      titolo: newAnnouncement.titolo,
      prezzo: newAnnouncement.prezzo,
      città: newAnnouncement.città
    });
    
    // Verifica che sia stato salvato
    const saved = await Announcement.findByPk(newAnnouncement.id);
    if (saved) {
      console.log('✅ Verifica database: Annuncio salvato correttamente');
    } else {
      console.log('❌ Errore: Annuncio non trovato dopo creazione');
    }
    
  } catch (error) {
    console.error('❌ Errore durante il test:', error);
  } finally {
    process.exit();
  }
}

testAnnouncementCreation();
