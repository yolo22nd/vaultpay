# VaultPay - Secure P2P Lending & Transaction System

> **Candidate Name:** Om Tank

> **Role Applied:** Full Stack Python Developer

> **Assignment Choice:** 2, though a **Hybrid Implementation** (Combined Assignment 1 & 2)

---

## 📖 Project Overview

VaultPay is a robust Fintech application designed to demonstrate **High-Concurreny Financial Transactions** and **Identity Security**.

Instead of choosing just one assignment, I have implemented a **Hybrid System** that addresses the core engineering challenges of both tasks:

1.  **From Assignment 1:** Secure Identity Management with **AES-256 Encryption** for sensitive government IDs (Aadhaar).
2.  **From Assignment 2:** Real-time Peer-to-Peer payments using **Atomic ACID Transactions**, **Row-Level Locking**, and **Idempotency** to ensure financial integrity.

### 🚀 Key Engineering Features

- **Concurrency Control:** Uses `select_for_update()` to lock database rows during transfers, preventing Race Conditions and Double-Spending attacks.
- **Idempotency:** Implemented `Idempotency-Key` middleware to handle network retries safely (Network Partition tolerance).
- **Data Security:** Aadhaar numbers are encrypted _at rest_ using Fernet (AES-256) and decrypted only on-demand via authenticated APIs.
- **Real-Time UX:** Frontend uses "Short Polling" (via TanStack Query) to provide immediate balance updates and "Flash" notifications, mimicking high-frequency trading apps.
- **Immutable Audit Log:** Transactions are stored in a read-only appending ledger.

---

## 🛠 Technology Stack

| Area           | Technology                       | Reason for Choice                                                     |
| :------------- | :------------------------------- | :-------------------------------------------------------------------- |
| **Backend**    | Python, Django, DRF              | Robust ORM for complex transaction management (`transaction.atomic`). |
| **Database**   | SQLite (Dev) / PostgreSQL (Prod) | ACID compliance is mandatory for financial ledgers.                   |
| **Frontend**   | React, Vite, Tailwind CSS        | Fast component rendering and modern accessible UI.                    |
| **State Mgmt** | TanStack Query (React Query)     | Efficient server-state management and auto-polling.                   |
| **Security**   | `cryptography` (Fernet)          | Standard library for symmetric encryption.                            |
| **DevOps**     | Docker (Optional)                | Containerized environment for consistent deployment.                  |

---

## 📸 Database Schema

The system uses a relational schema designed for data integrity.

### 1. User Model (`users_user`)

Extends AbstractUser to include financial and security fields.

- `id`: PK
- `email`: Unique Index (Login ID)
- `wallet_balance`: **Decimal(12, 2)** (Crucial: Never use Float for money)
- `aadhaar_encrypted`: **TextField** (Stores the AES-256 Ciphertext)

### 2. Transaction Ledger (`wallet_transaction`)

An immutable log of money movement.

- `reference_id`: UUID (Unique Transaction Reference)
- `sender_id`: FK -> User
- `receiver_id`: FK -> User
- `amount`: Decimal
- `status`: Enum (SUCCESS, FAILED, PENDING)
- `created_at`: Timestamp

### 3. Idempotency Log (`wallet_idempotencylog`)

Ensures safety against network retries.

- `key`: UUID (Header from Frontend)
- `user_id`: FK -> User
- `response_body`: JSON (The cached response)

_[Insert Schema Diagram Screenshot Here]_

---

## ⚙️ Setup & Run Instructions

### Prerequisites

- Node.js (v18+)
- Python (v3.10+)

### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Create and Activate Virtual Environment
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# Install Dependencies
pip install -r requirements.txt

# Run Migrations
python manage.py migrate

# Seed Data (Crucial Step!)
# This uses AI-generated logic to populate the DB with 20 users and 100 transactions
python manage.py seed_data

# Start Server
python manage.py runserver
```

_Backend runs on: `http://127.0.0.1:8000`_

### 2. Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install Dependencies
npm install

# Start Development Server
npm run dev
```

_Frontend runs on: `http://localhost:5173`_

### 3. Login Credentials (For Testing)

To test immediately without registering:

- **Superuser Email:** `omtank22@gmail.com`
- **Password:** `password123`
  _(Or use the Registration page to create a new user with an Aadhaar ID)_

---

## 📡 API Documentation

### Auth & Identity

| Method | Endpoint               | Description                                             |
| :----- | :--------------------- | :------------------------------------------------------ |
| `POST` | `/api/users/register/` | Register new user (Encrypts Aadhaar automatically).     |
| `POST` | `/api/users/login/`    | Returns JWT Access & Refresh tokens.                    |
| `GET`  | `/api/users/profile/`  | Fetches profile. **Decrypts** Aadhaar if user is owner. |

### Wallet & Transactions

| Method | Endpoint                | Description                                                 |
| :----- | :---------------------- | :---------------------------------------------------------- |
| `POST` | `/api/wallet/transfer/` | **Atomic.** Requires `Idempotency-Key` header. Locks rows.  |
| `GET`  | `/api/wallet/history/`  | Returns paginated list of transactions (Real-time polling). |

---

## 🤖 AI Flavor: Tool Usage Log

**Effectiveness Score:** **5/5**

**Justification:**
AI tools allowed me to focus on high-level architectural decisions (like concurrency locking and security patterns) by handling the repetitive implementation details. Specifically, generating realistic seed data saved ~2 hours of manual database entry, allowing for immediate load testing of the dashboard.

### AI-Assisted Tasks List

| Task Category       | Detail of AI Usage                                                                                                                                                     | Tool Used          |
| :------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------- |
| **Data Generation** | Generated a Python Management Command (`seed_data.py`) to populate the database with 20 realistic Indian users and 100 linked financial transactions using `Faker`.    | Gemini (AI Studio) |
| **Security Logic**  | Generated the `VaultSecurity` utility class for AES-256 encryption/decryption using the `cryptography` library to ensure best practices (IV handling).                 | Gemini (AI Studio) |
| **Testing**         | Wrote a `pytest` script to simulate **Race Conditions** (simultaneous requests) to verify that my `select_for_update` locking logic actually prevents double-spending. | Gemini (AI Studio) |
| **Frontend UI**     | Generated the Tailwind CSS classes for the "Flashing Balance" component to visualize real-time updates without writing custom CSS animations.                          | Gemini (AI Studio) |
| **Architecture**    | Refactored the Transfer API to include `IdempotencyLog` logic, ensuring safe retries for POST requests.                                                                | Gemini (AI Studio) |

---

## 📸 Screenshots

### 1. Dashboard (Real-Time Balance & History)

_[Insert Screenshot of Dashboard]_

### 2. Secure Profile (Masked vs Decrypted Aadhaar)

_[Insert Screenshot of Profile Card]_

### 3. Database Admin (Encrypted Data at Rest)

_[Insert Screenshot of Django Admin showing cipher text]_

---

### 🎥 Video Demo

[Link to Screen Recording / Loom Video]
