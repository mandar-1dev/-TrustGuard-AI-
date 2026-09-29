import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

async function testAll() {
  console.log('🧪 Starting TrustGuard AI Automated API Tests...\n');

  try {
    // 1. Health Check
    const health = await axios.get(`${API_BASE}/health`);
    console.log('✅ 1. Health check passed:', health.data.status, `(DB: ${health.data.database}, AI: ${health.data.aiEngine})`);

    // 2. Demo User Login
    const loginRes = await axios.post(`${API_BASE}/auth/login`, {
      email: 'demo@trustguard.ai',
      password: 'Password123!'
    });
    console.log('✅ 2. Demo user login passed:', loginRes.data.user.name);
    const token = loginRes.data.token;
    const authHeaders = { Authorization: `Bearer ${token}` };

    // 3. New User Registration
    const testEmail = `tester_${Date.now()}@example.com`;
    const regRes = await axios.post(`${API_BASE}/auth/register`, {
      name: 'Cyber Sentinel',
      email: testEmail,
      password: 'SecurePassword123!'
    });
    console.log('✅ 3. User registration passed:', regRes.data.user.email);
    const regToken = regRes.data.token;
    const regHeaders = { Authorization: `Bearer ${regToken}` };

    // 4. Scan Threat Message (Test 1 from prompt)
    const scan1 = await axios.post(`${API_BASE}/scans/analyze`, {
      inputType: 'message',
      content: 'Your bank account will be blocked today. Verify your KYC immediately using this link: https://fake-bank-auth.xyz/login'
    }, { headers: regHeaders });
    console.log('✅ 4. Threat Scan passed! Risk Score:', scan1.data.data.risk_score, 'Threat Level:', scan1.data.data.threat_level);
    console.log('   Threats detected:', scan1.data.data.threats?.length || 0);

    // 5. Scan Safe Message (Test 2 from prompt)
    const scan2 = await axios.post(`${API_BASE}/scans/analyze`, {
      inputType: 'message',
      content: 'Your food delivery is arriving today between 7 PM and 8 PM.'
    }, { headers: regHeaders });
    console.log('✅ 5. Safe Scan passed! Risk Score:', scan2.data.data.risk_score, 'Threat Level:', scan2.data.data.threat_level);

    // 6. Privacy Redaction (Test 3 from prompt)
    const redactRes = await axios.post(`${API_BASE}/privacy/redact`, {
      content: 'My name is Rahul. My phone number is 9876543210 and my email is rahul@example.com.'
    }, { headers: regHeaders });
    console.log('✅ 6. Privacy redaction passed! Redacted items count:', redactRes.data.data.itemsRedactedCount);
    console.log('   Protected content:', redactRes.data.data.redactedContent);

    // 7. Dashboard Stats
    const statsRes = await axios.get(`${API_BASE}/dashboard/stats`, { headers: regHeaders });
    console.log('✅ 7. Dashboard stats passed! Security Score:', statsRes.data.data.securityScore, 'Total Scans:', statsRes.data.data.totalScans);

    // 8. History / Get Scans
    const historyRes = await axios.get(`${API_BASE}/scans`, { headers: regHeaders });
    console.log('✅ 8. Scans list passed! Count:', historyRes.data.count);

    // 9. Profile
    const profileRes = await axios.get(`${API_BASE}/profile`, { headers: regHeaders });
    console.log('✅ 9. Profile retrieved passed:', profileRes.data.data.user.name);

    console.log('\n🎉 ALL 9 BACKEND API TESTS COMPLETED SUCCESSFULLY!');
    process.exit(0);
  } catch (error) {
    console.error('❌ API Test Failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

testAll();
