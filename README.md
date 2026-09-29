# 🛡️ TrustGuard AI

### AI-Powered Security, Privacy & Trust Guardian

> **Theme:** AI Security, Privacy & Trust
> **Tagline:** *Detect threats. Protect your privacy. Make smarter digital decisions.*

TrustGuard AI is a full-stack cybersecurity platform designed to help users identify **phishing, social engineering, malicious links, and sensitive data exposure**.

It combines **Google Gemini AI**, heuristic security analysis, explainable threat detection, automated PII redaction, and secure data storage to provide users with a transparent and actionable security experience.

---

## ✨ Why TrustGuard AI?

Modern digital threats are becoming increasingly convincing.

A message may look like it came from a bank.
A link may look almost identical to a legitimate website.
A fake KYC request may create a sense of urgency.
A user may unknowingly share sensitive information.

Traditional security tools often provide only:

> ❌ **Dangerous**

TrustGuard AI goes further:

> 🔍 **What is suspicious?**
> 🧠 **Why is it suspicious?**
> 🛡️ **What information is exposed?**
> ✅ **What should the user do next?**

---

# 🎯 Problem Statement

Individuals and organizations increasingly encounter:

* Phishing messages and emails
* Fake KYC and banking alerts
* Malicious or deceptive URLs
* Social-engineering attacks
* Credential harvesting attempts
* Accidental exposure of Personally Identifiable Information (PII)
* API keys and other sensitive secrets shared in plain text

Many existing solutions provide a simple block/allow decision without explaining the underlying risk.

**TrustGuard AI addresses this problem through explainable AI-powered security analysis and privacy protection.**

---

# 💡 Solution Overview

TrustGuard AI acts as an intelligent digital security guardian.

### 🔍 Threat Analysis

Analyze:

* SMS / Messages
* Phishing emails
* Suspicious URLs
* Raw text

The system combines **Gemini AI analysis** with heuristic security rules to identify suspicious patterns.

### 🧠 Explainable AI

Instead of returning only a risk score, TrustGuard explains observable indicators such as:

* Brand impersonation
* Urgency and pressure tactics
* Credential harvesting
* Suspicious domains
* Financial manipulation
* Social engineering patterns

### 🔐 Privacy Protection

Automatically detects sensitive information including:

* Phone numbers
* Email addresses
* Government IDs
* Financial information
* API keys
* Other sensitive secrets

Users can instantly redact detected information:

```text
Original:
My phone number is 9876543210

Protected:
My phone number is [PHONE REDACTED]
```

### 🗄️ Secure Security Vault

Analysis history is stored using **Supabase PostgreSQL** with database-level security controls and user isolation.

### 📊 Security Dashboard

Users can monitor:

* Security score
* Threat history
* Risk trends
* Recent activity
* Privacy findings
* Security events

---

# 🚀 Key Features

| Feature                  | Description                                     |
| ------------------------ | ----------------------------------------------- |
| 🔍 Multi-Modal Scanner   | Analyze SMS, emails, URLs and raw text          |
| 🧠 Explainable AI        | Understand why content is considered suspicious |
| 🎯 Risk Gauge            | Visualizes Safe, Warning and Danger levels      |
| 🚨 Threat Breakdown      | Displays individual threat indicators           |
| 🔐 PII Detection         | Identifies sensitive personal information       |
| 🛡️ Instant Redaction    | Masks sensitive information automatically       |
| 📊 Security Score        | Tracks overall security posture                 |
| 🗂️ Scan History         | Search, filter and inspect previous scans       |
| 🧾 Audit Trail           | Records important security events               |
| ⚡ Offline Fallback       | Heuristic engine keeps demos functional         |
| 🔒 Secure Authentication | JWT authentication with bcrypt passwords        |
| 🛑 Rate Limiting         | Protects analysis endpoints from abuse          |

---

# 🏗️ System Architecture

```text
                         ┌─────────────────────────┐
                         │     TrustGuard AI       │
                         │       Web Client        │
                         │ React + Vite + Tailwind │
                         └────────────┬────────────┘
                                      │
                               HTTP + JWT
                                      │
                                      ▼
                    ┌─────────────────────────────────┐
                    │       Express.js Backend        │
                    │                                 │
                    │  ┌───────────────────────────┐  │
                    │  │ Authentication            │  │
                    │  │ Rate Limiting             │  │
                    │  │ Zod Validation            │  │
                    │  │ Authorization             │  │
                    │  └─────────────┬─────────────┘  │
                    │                │                │
                    │       ┌────────┴────────┐       │
                    │       ▼                 ▼       │
                    │  ┌────────────┐   ┌──────────┐ │
                    │  │ Gemini AI  │   │ Database │ │
                    │  │ Service    │   │ Service  │ │
                    │  └─────┬──────┘   └────┬─────┘ │
                    └────────┼────────────────┼───────┘
                             │                │
                           HTTPS          PostgreSQL
                             │                │
                             ▼                ▼
                    ┌──────────────┐  ┌──────────────┐
                    │ Google Gemini│  │   Supabase   │
                    │     API      │  │  PostgreSQL  │
                    └──────────────┘  │ RLS + Secure │
                                      │    Storage   │
                                      └──────────────┘
```

---

# 🧰 Tech Stack

## Frontend

* **React 18** — UI framework
* **Vite** — Frontend build tool
* **React Router DOM** — Routing
* **Tailwind CSS** — Styling
* **Recharts** — Security analytics and charts
* **Lucide React** — Interface icons
* **Axios** — API communication

## Backend

* **Node.js** — Runtime
* **Express.js** — REST API
* **JWT** — Authentication
* **bcryptjs** — Password hashing
* **Zod** — Request and AI response validation
* **Google Gemini API** — AI threat analysis
* **Supabase JS** — Database communication
* **Helmet** — Security headers
* **CORS** — Cross-origin protection
* **express-rate-limit** — API abuse protection
* **Morgan** — Request logging

## Database

* **Supabase PostgreSQL**
* **Row Level Security (RLS)**
* Foreign key constraints
* Database indexes
* Security audit records

---

# 📁 Project Structure

```text
trustguard-ai/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── .env.example
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validators/
│   │   └── server.js
│   │
│   ├── test-api.js
│   ├── package.json
│   └── .env.example
│
├── supabase/
│   ├── schema.sql
│   ├── seed.sql
│   └── README.md
│
├── .gitignore
├── package.json
└── README.md
```

---

# 🗄️ Supabase Database Setup

TrustGuard AI uses **Supabase PostgreSQL** as its primary database.

### 1. Create a Supabase Project

Create a project from:

**Supabase → New Project**

### 2. Open SQL Editor

Navigate to:

```text
Supabase Dashboard
        ↓
SQL Editor
        ↓
New Query
```

### 3. Run the Database Schema

Copy the contents of:

```text
supabase/schema.sql
```

and execute it in the Supabase SQL Editor.

The schema creates:

```text
users
scans
threats
privacy_findings
recommendations
security_events
```

along with:

* Foreign keys
* Indexes
* Row Level Security policies
* User-level data isolation

### 4. Optional Demo Data

For hackathon demonstrations, run:

```text
supabase/seed.sql
```

This populates the database with sample security activity.

### 5. Get Supabase Credentials

Go to:

```text
Project Settings
      ↓
API
```

Copy:

```text
Project URL
Service Role Key
```

Add them to:

```text
server/.env
```

> ⚠️ **Never commit your Supabase service-role key to GitHub.**

---

# 🤖 Google Gemini Setup

TrustGuard AI uses Google Gemini for intelligent security analysis.

### 1. Generate an API Key

Create an API key through:

**Google AI Studio**

### 2. Add the Key

Inside:

```text
server/.env
```

add:

```env
GEMINI_API_KEY=your_actual_gemini_api_key
```

### 🔐 Important Security Rule

The Gemini API key is **server-side only**.

```text
Browser
   │
   │ User request
   ▼
Express Backend
   │
   │ Gemini API Key
   ▼
Google Gemini
```

The API key is never placed inside frontend code.

---

# ⚡ Local Development

## Prerequisites

Make sure you have:

* Node.js 18+
* npm 9+
* Supabase account
* Gemini API key

---

## 1. Clone the Repository

```bash
git clone <your-repository-url>
cd trustguard-ai
```

---

## 2. Install Dependencies

From the root directory:

```bash
npm run install:all
```

Or manually:

```bash
cd server
npm install

cd ../client
npm install
```

---

## 3. Configure Environment Variables

### Backend

```bash
cp server/.env.example server/.env
```

### Frontend

```bash
cp client/.env.example client/.env
```

Then configure your Supabase and Gemini credentials.

---

## 4. Start the Application

From the project root:

```bash
npm run dev
```

The application should be available at:

```text
Frontend → http://localhost:5173
Backend  → http://localhost:5000
```

---

# 🎮 Demo Account

For hackathon demonstrations:

```text
Email:
demo@trustguard.ai

Password:
Password123!
```

You can also use the **Instant Demo** option from the login screen if enabled.

> ⚠️ Change or remove demo credentials before production deployment.

---

# 🔑 Environment Variables

## Backend — `server/.env`

| Variable                    | Purpose                 |
| --------------------------- | ----------------------- |
| `PORT`                      | Express server port     |
| `CLIENT_URL`                | Frontend URL for CORS   |
| `JWT_SECRET`                | JWT signing secret      |
| `SUPABASE_URL`              | Supabase project URL    |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase server secret  |
| `GEMINI_API_KEY`            | Google Gemini API key   |
| `GEMINI_MODEL`              | Gemini model identifier |

Example:

```env
PORT=5000
CLIENT_URL=http://localhost:5173

JWT_SECRET=your_strong_random_secret

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash
```

## Frontend — `client/.env`

```env
VITE_API_URL=/api
```

> 🚨 Never commit `.env` files containing real secrets.

---

# 📡 REST API

## Authentication

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| `POST` | `/api/auth/register` | Create account    |
| `POST` | `/api/auth/login`    | Authenticate user |
| `GET`  | `/api/auth/me`       | Verify session    |
| `POST` | `/api/auth/logout`   | End session       |

## Threat Scanning

| Method   | Endpoint             | Description               |
| -------- | -------------------- | ------------------------- |
| `POST`   | `/api/scans/analyze` | Analyze submitted content |
| `GET`    | `/api/scans`         | Retrieve user's scans     |
| `GET`    | `/api/scans/:id`     | Retrieve scan details     |
| `DELETE` | `/api/scans/:id`     | Delete user's scan        |

## Privacy

| Method | Endpoint              | Description           |
| ------ | --------------------- | --------------------- |
| `POST` | `/api/privacy/redact` | Detect and redact PII |

## Dashboard

| Method | Endpoint                  | Description              |
| ------ | ------------------------- | ------------------------ |
| `GET`  | `/api/dashboard/stats`    | Security statistics      |
| `GET`  | `/api/dashboard/activity` | Recent security activity |

## Profile

| Method | Endpoint       | Description      |
| ------ | -------------- | ---------------- |
| `GET`  | `/api/profile` | Retrieve profile |
| `PUT`  | `/api/profile` | Update profile   |

---

# 🛡️ Security Architecture

TrustGuard AI implements multiple layers of security.

### 🔐 1. Secret Protection

Sensitive API credentials remain exclusively on the backend.

```text
❌ Frontend → Gemini API Key
✅ Backend  → Gemini API Key
```

### 🗄️ 2. Row Level Security

Supabase PostgreSQL uses RLS policies to isolate user data.

```text
User A
  ↓
Only User A's data

User B
  ↓
Only User B's data
```

### 🔑 3. Authentication

Passwords are securely hashed using bcrypt before storage.

Authentication uses signed JWT tokens.

### 🛑 4. Rate Limiting

The analysis endpoint uses rate limiting to reduce:

* API abuse
* Automated attacks
* Quota exhaustion
* Excessive requests

### 🧪 5. Request Validation

Zod validates incoming requests and AI-generated structured responses.

### 🧠 6. Prompt Injection Protection

User-submitted content is treated as **data to analyze**, rather than instructions for the AI.

---

# 🤝 AI Trust & Safety

TrustGuard AI is designed around transparency rather than absolute claims.

### No False Certainty

Instead of:

```text
"This is definitely a scam."
```

the system uses language such as:

```text
"This content contains indicators commonly associated
with phishing."
```

### Explainable Results

Users can see the specific indicators contributing to the assessment.

Examples:

```text
⚠ Urgency Coercion
⚠ Brand Impersonation
⚠ Suspicious URL
⚠ Credential Harvesting
```

### Human Verification

Every security report reminds users:

> **AI-generated security assessments may be imperfect. Verify important information through trusted official channels.**

---

# 📊 Security Analysis Flow

```text
              User Input
                  │
                  ▼
          ┌───────────────┐
          │ Input         │
          │ Validation    │
          └───────┬───────┘
                  │
          ┌───────▼────────┐
          │ Heuristic      │
          │ Security Scan  │
          └───────┬────────┘
                  │
                  ▼
          ┌───────────────┐
          │ Gemini AI     │
          │ Analysis      │
          └───────┬───────┘
                  │
          ┌───────▼────────┐
          │ Schema         │
          │ Validation     │
          └───────┬────────┘
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
   Threat Analysis      PII Detection
        │                   │
        └─────────┬─────────┘
                  ▼
          ┌───────────────┐
          │ Risk Score &  │
          │ Explanation   │
          └───────┬───────┘
                  │
                  ▼
          ┌───────────────┐
          │ Dashboard +   │
          │ Secure History│
          └───────────────┘
```

---

# 🌐 Deployment

## Frontend

Recommended platforms:

* Vercel
* Netlify

### Configuration

Set:

```text
Root Directory:
client
```

Build command:

```bash
npm run build
```

Output directory:

```text
dist
```

Environment variable:

```env
VITE_API_URL=https://your-backend-api.onrender.com/api
```

---

## Backend

Recommended platforms:

* Render
* Railway

### Configuration

```text
Root Directory:
server
```

Build command:

```bash
npm install
```

Start command:

```bash
node src/server.js
```

Configure:

```env
PORT=5000
CLIENT_URL=https://your-frontend-app.vercel.app

JWT_SECRET=your_strong_random_secret

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

GEMINI_API_KEY=your_gemini_api_key
```

---

# 🔒 Production Security Checklist

Before deploying to production:

* [ ] Replace all demo credentials
* [ ] Generate a strong random `JWT_SECRET`
* [ ] Never commit `.env` files
* [ ] Never expose the Supabase service-role key
* [ ] Never expose the Gemini API key
* [ ] Configure production CORS origins
* [ ] Enable HTTPS
* [ ] Review Supabase RLS policies
* [ ] Review API rate limits
* [ ] Remove unnecessary seed/demo data
* [ ] Test authentication and authorization
* [ ] Test scan ownership validation

---

# 🧪 Testing

The backend includes an API integration test:

```bash
cd server
node test-api.js
```

The test suite can be used to verify major API flows including authentication and protected endpoints.

---

# 🏆 Hackathon Demo Flow

For a quick demonstration, follow this flow:

```text
        🚀 Login
           │
           ▼
     📊 Dashboard
           │
           ▼
     🔍 Start Scan
           │
           ▼
    📩 Paste Suspicious
       Message / URL
           │
           ▼
      🧠 AI Analysis
           │
           ▼
    🚨 Threat Breakdown
           │
           ▼
      🔐 PII Detection
           │
           ▼
      🛡️ Redaction
           │
           ▼
      📊 Security Score
           │
           ▼
      🗂️ Scan History
```

---

# 🌟 What Makes TrustGuard AI Different?

TrustGuard AI combines multiple security capabilities into one workflow:

```text
             TRUSTGUARD AI
                   │
       ┌───────────┼───────────┐
       │           │           │
       ▼           ▼           ▼
   🔍 Threat    🔐 Privacy   🧠 Explainable
   Detection    Protection      AI
       │           │           │
       └───────────┼───────────┘
                   │
                   ▼
            📊 Security
               Insights
                   │
                   ▼
             👤 User Action
```

The goal is not simply to detect suspicious content.

The goal is to help users **understand the risk, protect sensitive information, and make informed security decisions.**

---

# 📜 License

This project is created for educational, research, and hackathon purposes.

---

# 👨‍💻 Built With

**React • Node.js • Express • Supabase • PostgreSQL • Google Gemini • Tailwind CSS • Recharts**

### 🛡️ TrustGuard AI

> **Detect threats. Protect your privacy. Make smarter digital decisions.**
