# Levvate Client Onboarding Application

A professional, production-ready multi-step client onboarding technical demonstration built with a modern full-stack TypeScript architecture.

## Overview

This application demonstrates a seamless onboarding flow for new clients, featuring a polished UI, persistent state management, and an asynchronous backend capable of cloud scale. It follows industry best practices for security, testing, and developer experience.

## Key Features

- ✅ **Professional UI/UX**: Built with **Mantine v7** and **Framer Motion** for a snappy, responsive, and animated user experience.
- ✅ **Interactive Progress Tracking**: A real-time **Stepper** allows users to visualize their progress and jump back to previous steps to update information.
- ✅ **Resume Anywhere**: Unique UUID-based tracking URLs allow clients to leave and resume their onboarding at any time.
- ✅ **Production-Ready Backend**: Fully asynchronous architecture using **Node.js/Express** and **LibSQL (Turso/SQLite)**.
- ✅ **Enterprise Security**:
  - **Data Masking**: Sensitive card numbers are automatically redacted before database storage.
  - **Security Headers**: Hardened with **Helmet.js** to prevent common web vulnerabilities.
  - **CORS Management**: Restricted origins for production environments.
- ✅ **High-Quality Codebase**:
  - **100% Line Coverage** on both frontend and backend.
  - Comprehensive unit and integration test suites using **Jest**.
  - Type safety enforced across the entire stack.

## Tech Stack

**Frontend:**
- **React 18 + TypeScript**
- **Mantine v7** (Component Library)
- **Framer Motion** (Animations)
- **React Router 6** (Navigation with v7 Future Flags enabled)
- **Axios** (API Communication)

**Backend:**
- **Node.js + Express**
- **LibSQL / Turso** (Cloud-ready SQLite)
- **Helmet.js** (Security)
- **Jest / Supertest** (Testing)

**Database:**
- **SQLite/LibSQL**: Hybrid local-file and cloud-hosted support.
- Tables: `clients`, `onboarding_progress`, `step_data`, `notifications`.

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm

### Local Installation

```bash
# Clone the repository
git clone <repository-url>
cd LevvateApplication

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:3000`

## Testing & Coverage

The project maintains extremely high testing standards to ensure reliability during demonstrations.

### Run all tests
```bash
# Backend
cd backend
npm test -- --runInBand

# Frontend
cd frontend
npm test -- --runInBand
```

### Coverage Reports
```bash
# Backend
cd backend
npm run test:coverage

# Frontend
cd frontend
npm run test:coverage
```

## API Documentation

### Key Endpoints

- `POST /api/clients`: Initialize a new onboarding session.
- `GET /api/clients/:uuid`: Retrieve all session data and progress.
- `POST /api/clients/:uuid/step/:step`: Submit data for a specific onboarding step.
- `GET /api/clients/:uuid/progress`: Fast-fetch only the current step and completion status.

## Onboarding Flow

1. **Client Info**: Basic contact and company details.
2. **Contract**: Review and accept a (non-binding) service agreement.
3. **Payment**: Secure payment method setup (Redacted storage).
4. **Scheduling**: Pick a date and time for the kick-off call.
5. **Review & Confirmation**: Full summary of all submitted data before completion.

## Cloud Deployment

This repository is optimized for deployment on **Render**, **Railway**, or **Vercel**.

### Render (Blueprint)
The included `render.yaml` allows for "one-click" deployment of both the frontend and backend services.

### Database (Turso)
To use a persistent cloud database:
1. Create a database in [Turso](https://turso.tech/).
2. Set `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` in your backend environment variables.

## Security & Privacy Notice (Demo)
- This is a technical demonstration.
- **Do not enter real financial or personal data.**
- Payment inputs are for UI demonstration only; data is masked before being saved.
- All service integrations (HubSpot, Slack, Email) are currently mocked to log to the console for easier review.

## License
MIT
