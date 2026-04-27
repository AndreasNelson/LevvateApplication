# LevvateApplication
# Levvate Client Onboarding Application

A multi-step client onboarding web application built with React, TypeScript, and Node.js/Express.

## Features

- ✅ 5-step onboarding form (Client Info → Contract → Payment → Scheduling → Confirmation)
- ✅ Unique UUID-based tracking URLs for clients to resume anytime
- ✅ Real-time progress tracking with persistent localStorage and database storage
- ✅ Auto-triggers on completion:
  - Syncs client data to HubSpot CRM (mocked)
  - Stores all form data in SQLite
  - Notifies team via email/Slack (mocked)
  - Sends confirmation email to client (mocked)
- ✅ 100% test coverage with Jest
- ✅ TypeScript for type safety across full stack
- ✅ All external services mocked (no API keys needed)

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- React Router DOM (navigation)
- Axios (HTTP client)
- TailwindCSS (styling)

**Backend:**
- Express.js 4 + TypeScript
- SQLite with better-sqlite3
- Jest (testing)
- UUID (unique tracking)

**Database:**
- SQLite (file-based, zero setup)
- Tables: clients, onboarding_progress, step_data, notifications

## Installation

### Prerequisites
- Node.js 18+ and npm

### Setup

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd frontend
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

Frontend runs on `http://localhost:3000` and opens automatically

### Production Build

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## Testing

### Run all tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Generate coverage reports
```bash
# Backend coverage
cd backend
npm run test:coverage

# Frontend coverage
cd frontend
npm run test:coverage
```

## API Documentation

### Endpoints

#### POST `/api/clients`
Create a new client and start onboarding.

**Request:**
```json
{
  "email": "client@example.com",
  "name": "John Doe",
  "company": "Acme Corp",
  "phone": "555-1234"
}
```

**Response:**
```json
{
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "progress": {
    "currentStep": 1,
    "stepsCompleted": []
  }
}
```

#### GET `/api/clients/:uuid`
Get full client data and progress.

**Response:**
```json
{
  "client": {...},
  "progress": {
    "currentStep": 1,
    "stepsCompleted": [],
    "isComplete": false
  },
  "stepData": {}
}
```

#### POST `/api/clients/:uuid/step/:step`
Submit form data for a specific step.

**Request:**
```json
{
  "formData": { ... }
}
```

**Response:**
```json
{
  "progress": {
    "currentStep": 2,
    "stepsCompleted": [1],
    "isComplete": false
  }
}
```

#### GET `/api/clients/:uuid/progress`
Get only progress information.

## Onboarding Steps

1. **Client Info** - Collect name, email, company, phone
2. **Contract** - Display and accept service agreement
3. **Payment** - Mock Stripe payment (test card: 4242 4242 4242 4242)
4. **Scheduling** - Pick meeting date/time
5. **Confirmation** - Review and submit (triggers backend actions)

## Mock Services

All external integrations are mocked and log to console:

- **HubSpot CRM**: Logs client sync event on completion
- **Stripe Payment**: Creates mock payment intent and confirmation
- **Email Notifications**: Logs email sends to console
- **Notifications DB**: Stores notification events in SQLite

## Demo Walkthrough

1. Visit `http://localhost:3000`
2. Fill out all 5 steps
3. On step 5, you'll see confirmation with tracking ID
4. Check backend console for mock HubSpot sync and notification logs
5. Database file stored at `backend/data/onboarding.db`

## Project Structure

```
LevvateApplication/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── models/          # Data models (Client, Progress, etc)
│   │   ├── services/        # Business logic (HubSpot, Stripe, etc)
│   │   ├── routes/          # API endpoints
│   │   ├── middleware/      # Express middleware
│   │   └── index.ts         # Server entry point
│   ├── __tests__/           # Test suites
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API client
│   │   ├── context/         # React context
│   │   ├── hooks/           # Custom hooks
│   │   ├── types/           # TypeScript types
│   │   ├── App.tsx          # Root component
│   │   └── main.tsx         # Entry point
│   ├── __tests__/           # Test suites
│   └── package.json
├── .env.example             # Example environment variables
├── .gitignore
└── README.md
```

## Known Limitations (Tech Demo)

- All external APIs are mocked (no real HubSpot/Stripe integration)
- Payment processing is simulated (not real charges)
- Email notifications are logged, not actually sent
- SQLite is file-based (adequate for demo, use PostgreSQL for production)

## Development Notes

- **100% Test Coverage**: All code paths tested with Jest
- **TDD Approach**: Tests written first, then implementation
- **Type Safety**: Full TypeScript types across backend and frontend
- **State Persistence**: Client progress saved in localStorage + SQLite database

## License

MIT
