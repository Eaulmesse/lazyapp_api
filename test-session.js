const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

async function testSession() {
  try {
    console.log('🧪 Test du système de session...\n');
    
    // 1. Test sans token (doit fonctionner pour /audit)
    console.log('1️⃣ Test sans token sur /audit...');
    const response1 = await axios.post(`${API_URL}/audit`, {
      testId: 'test-123',
      url: 'https://example.com',
      results: { score: 95 }
    });
    console.log('✅ Réponse sans token:', response1.status);
    console.log('📊 Audit créé avec userId:', response1.data.userId);
    
    // 2. Test avec token invalide (doit fonctionner pour /audit)
    console.log('\n2️⃣ Test avec token invalide sur /audit...');
    const response2 = await axios.post(`${API_URL}/audit`, {
      testId: 'test-456',
      url: 'https://example.com',
      results: { score: 85 }
    }, {
      headers: {
        'Authorization': 'Bearer invalid-token'
      }
    });
    console.log('✅ Réponse avec token invalide:', response2.status);
    console.log('📊 Audit créé avec userId:', response2.data.userId);
    
    // 3. Test avec token valide (si vous en avez un)
    console.log('\n3️⃣ Test avec token valide sur /audit...');
    console.log('⚠️  Vous devez d\'abord vous connecter pour obtenir un token valide');
    console.log('   Utilisez: POST /api/user/login avec vos credentials');
    
    console.log('\n🎉 Tests terminés !');
    
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
  }
}

testSession(); 