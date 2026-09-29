-- ==========================================================
-- TRUSTGUARD AI - OPTIONAL SEED DATA (DEVELOPMENT ONLY)
-- Clearly marked as demo data (is_demo = true)
-- ==========================================================

-- Demo User:
-- Email: demo@trustguard.ai
-- Password: Password123! (bcrypt hash below: $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi)
INSERT INTO users (id, name, email, password_hash, role, created_at)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Alex Vance (Security Demo)',
    'demo@trustguard.ai',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'user',
    NOW() - INTERVAL '7 days'
)
ON CONFLICT (email) DO NOTHING;

-- Demo Scan 1: High Risk Phishing SMS
INSERT INTO scans (id, user_id, input_type, input_content, risk_score, threat_level, summary, ai_explanation, is_demo, created_at)
VALUES (
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b22',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'message',
    'URGENT: Your Chase checking account has been temporarily restricted due to suspicious activity. Verify KYC identity immediately at https://chase-security-verify.net/login or funds will be frozen within 2 hours.',
    94,
    'HIGH',
    'Potential high-urgency banking phishing attempt seeking credential theft.',
    '["The message creates an artificial sense of extreme urgency with a 2-hour deadline.", "The URL \'chase-security-verify.net\' mimics legitimate Chase branding on an unauthorized domain.", "Direct request for immediate credential or KYC verification without standard out-of-band prompts."]'::jsonb,
    TRUE,
    NOW() - INTERVAL '2 hours'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO threats (scan_id, threat_type, severity, description)
VALUES 
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'Phishing & Impersonation', 'HIGH', 'Impersonates Chase Bank security department using an unauthorized domain.'),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'Urgency & Psychological Coercion', 'HIGH', 'Applies artificial pressure (2-hour account suspension threat).'),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'Credential Harvesting', 'HIGH', 'Targets online banking credentials and identity documents.');

INSERT INTO recommendations (scan_id, recommendation, priority)
VALUES 
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'Do NOT click the provided link or submit any banking credentials.', 1),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'Navigate directly to official chase.com or use the official mobile app to review account notices.', 2),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'Report the phishing SMS to your mobile provider via 7726 (SPAM).', 3);

-- Demo Scan 2: Medium Risk Privacy Leak Email
INSERT INTO scans (id, user_id, input_type, input_content, risk_score, threat_level, summary, ai_explanation, is_demo, created_at)
VALUES (
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'email',
    'Hi team, here is the candidate application. Candidate Rahul Sharma, contact: rahul.sharma@example.com, phone: +1-415-555-0199, SSN: 123-45-6789. Please forward to hiring committee.',
    55,
    'MEDIUM',
    'Sensitive Personally Identifiable Information (PII) transmitted in plain text.',
    '["Unencrypted personal identifiers (SSN, personal email, phone number) transmitted over open communication channels.", "Violation of minimal data exposure standards, exposing individual to identity theft risks."]'::jsonb,
    TRUE,
    NOW() - INTERVAL '1 day'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO privacy_findings (scan_id, data_type, severity, description)
VALUES 
    ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'government_id', 'HIGH', 'Full Social Security Number / National ID detected in plain text.'),
    ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'phone', 'MEDIUM', 'Direct personal mobile phone number exposed.'),
    ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'email', 'LOW', 'Individual personal contact email exposed.'),
    ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'personal_name', 'LOW', 'Full individual name detected.');

INSERT INTO recommendations (scan_id, recommendation, priority)
VALUES 
    ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'Redact government identification numbers and phone numbers before forwarding.', 1),
    ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'Use a secured HR portal or end-to-end encrypted file vault for candidate documentation.', 2);

-- Demo Scan 3: Low Risk / Safe Delivery Notice
INSERT INTO scans (id, user_id, input_type, input_content, risk_score, threat_level, summary, ai_explanation, is_demo, created_at)
VALUES (
    'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380d44',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'message',
    'Your package from Amazon is out for delivery today between 2:00 PM and 5:00 PM. No signature required.',
    12,
    'SAFE',
    'Informational automated package delivery notification with no threat indicators.',
    '["No requests for sensitive credentials, payments, or personal information.", "Contains no suspicious external hyperlinks or aggressive urgency threats."]'::jsonb,
    TRUE,
    NOW() - INTERVAL '3 days'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO recommendations (scan_id, recommendation, priority)
VALUES 
    ('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 'No immediate security action required. Keep tracking directly in your official carrier app.', 1);

-- Demo Security Events
INSERT INTO security_events (user_id, event_type, description, created_at)
VALUES 
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'LOGIN', 'Successful user authentication from web client', NOW() - INTERVAL '7 days'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'SCAN_CREATED', 'Scanned package delivery notification (SAFE)', NOW() - INTERVAL '3 days'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'PRIVACY_RISK_DETECTED', 'Detected Government ID and PII exposure in candidate email', NOW() - INTERVAL '1 day'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'SCAN_CREATED', 'Scanned banking SMS notification (HIGH)', NOW() - INTERVAL '2 hours'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'HIGH_RISK_DETECTED', 'Urgent Chase Phishing Attempt identified and blocked', NOW() - INTERVAL '2 hours');
