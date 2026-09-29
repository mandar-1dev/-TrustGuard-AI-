# Supabase PostgreSQL Setup Guide for TrustGuard AI

TrustGuard AI uses Supabase PostgreSQL as its primary relational database to securely persist user accounts, AI threat analyses, privacy findings, and security event logs.

---

## 1. Quick Setup (Supabase Cloud)

1. **Create a Supabase Project**:
   - Go to [https://supabase.com](https://supabase.com) and log in or create a free account.
   - Click **"New Project"**.
   - Enter project name `trustguard-ai` and set a strong database password.
   - Select your preferred region and click **"Create New Project"**.

2. **Run the Database Schema**:
   - In your Supabase project dashboard, navigate to the **SQL Editor** in the left sidebar.
   - Click **"New query"**.
   - Open and copy the contents of `supabase/schema.sql` from this repository.
   - Paste it into the SQL Editor and click **"Run"** (or press Ctrl + Enter).
   - All tables (`users`, `scans`, `threats`, `privacy_findings`, `recommendations`, `security_events`), indexes, and Row Level Security (RLS) policies will be created.

3. **(Optional) Run Seed Data**:
   - If you want example scans and mock security events for instant demo purposes, open a new SQL query in the SQL Editor.
   - Copy the contents of `supabase/seed.sql` and click **"Run"**.
   - Note: Demo user credentials:
     - **Email**: `demo@trustguard.ai`
     - **Password**: `Password123!`

4. **Retrieve API Credentials**:
   - In Supabase, navigate to **Project Settings** (gear icon) -> **API**.
   - Copy the following values:
     - **Project URL** (`https://<project-ref>.supabase.co`)
     - **service_role secret key** (found under "Project API keys" -> `service_role`).

5. **Configure Backend Environment**:
   - Open `server/.env` (copy from `server/.env.example`).
   - Add your Supabase credentials:
     ```env
     SUPABASE_URL=https://<your-project-ref>.supabase.co
     SUPABASE_SERVICE_ROLE_KEY=eyJh...<your-service-role-key>
     ```

---

## 2. Security Architecture & RLS

- **Server-Side Isolation**: The Express backend interacts with Supabase using the service role key to manage relational integrity.
- **Access Control Guarantee**: Every API query strictly enforces:
  `scan.user_id === authenticatedUser.id`
  No user can query, view, or delete another user's scan data.
- **Row Level Security**: Tables have RLS enabled with granular policies (`USING (auth.uid() = user_id)`) to defend against unauthorized direct client access.
- **Zero Public Exposure**: The `SUPABASE_SERVICE_ROLE_KEY` is NEVER bundled or exposed to the frontend React application.
