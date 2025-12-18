# VaultPay - Secure P2P Lending & Transaction System

> **Candidate Name:** Om Tank
> **Role Applied:** Full Stack Python Developer
> **Assignment Choice:** 2, though a **Hybrid Implementation** (Combined Assignment 1 & 2)

---

### 🔗 Quick Links

- 🎥 **Video Demo:** [Insert Loom/YouTube Link Here]
- 🌐 **Live Website:** [Insert Netlify/Render Link Here]
- 🐳 **Docker Container:** [Insert DockerHub/Registry Link Here]

---

## 📖 Project Overview

VaultPay is a robust Fintech application designed to demonstrate **High-Concurrency Financial Transactions** and **Identity Security**.

Instead of choosing just one assignment, I have implemented a **Hybrid System** that addresses the core engineering challenges of both tasks:

1.  **From Assignment 1:** Secure Identity Management with **AES-256 Encryption** for sensitive government IDs (Aadhaar).
2.  **From Assignment 2:** Real-time Peer-to-Peer payments using **Atomic ACID Transactions**, **Row-Level Locking**, and **Idempotency** to ensure financial integrity.

### ✅ Task Fulfillment Checklist

Both assignments were fully implemented within the scope of this single application.

| Assignment         | Component           | Status  | Implementation Details                                                |
| :----------------- | :------------------ | :------ | :-------------------------------------------------------------------- |
| **1. Identity**    | **JWT Auth**        | ✅ Done | Implemented via `simplejwt` (Access/Refresh tokens).                  |
| **1. Identity**    | **Encryption**      | ✅ Done | Aadhaar stored as AES-256 ciphertext in DB (`core.security`).         |
| **1. Identity**    | **Profile API**     | ✅ Done | Decryption happens only on-demand via authenticated GET request.      |
| **2. Transaction** | **Atomic Transfer** | ✅ Done | Wrapped in `transaction.atomic()` with `select_for_update()` locking. |
| **2. Transaction** | **Audit Log**       | ✅ Done | Immutable `Transaction` model recorded for every transfer.            |
| **2. Transaction** | **Real-Time UI**    | ✅ Done | Implemented Short Polling (3s interval) for instant balance updates.  |

---

## 🚀 Key Engineering Features

- **Concurrency Control:** Uses `select_for_update()` to lock database rows during transfers, preventing Race Conditions and Double-Spending attacks.
- **Idempotency:** Implemented `Idempotency-Key` logic to handle network retries safely (Network Partition tolerance).
- **Data Security:** Aadhaar numbers are encrypted _at rest_ using Fernet (AES-256).
- **Real-Time UX:** Frontend uses TanStack Query for immediate balance updates and "Flash" notifications, mimicking high-frequency trading apps.
- **Analytics:** Integrated visual cash-flow charts using `recharts`.

---

## 🛠 Technology Stack

| Area           | Technology                       | Reason for Choice                                                     |
| :------------- | :------------------------------- | :-------------------------------------------------------------------- |
| **Backend**    | Python, Django, DRF              | Robust ORM for complex transaction management (`transaction.atomic`). |
| **Database**   | SQLite (Dev) / PostgreSQL (Prod) | ACID compliance is mandatory for financial ledgers.                   |
| **Frontend**   | React, Vite, Tailwind CSS        | Fast component rendering and modern accessible UI.                    |
| **State Mgmt** | TanStack Query (React Query)     | Efficient server-state management and auto-polling.                   |
| **Security**   | `cryptography` (Fernet)          | Standard library for symmetric encryption.                            |
| **DevOps**     | Docker                           | Containerized environment for consistent deployment.                  |

---

## 📸 Database Schema

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

### 3. Idempotency Log (`wallet_idempotencylog`)

Ensures safety against network retries.

- `key`: UUID (Header from Frontend)
- `user_id`: FK -> User
- `response_body`: JSON (The cached response)

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

### 2. Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install Dependencies
npm install

# Start Development Server
npm run dev
```

### 3. Login Credentials (For Testing)

To test immediately without registering:

- **Superuser Email:** `omtank22@gmail.com`
- **Password:** `password`
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

## 🤖 AI Flavor: Tool Usage Log (MANDATORY)

**Effectiveness Score:** **5/5**

**Justification:**
AI tools significantly accelerated the boilerplate phase, allowing me to focus on high-level architectural decisions (like concurrency locking and security patterns). Specifically, generating realistic seed data and unit tests saved ~4 hours of manual work.

### AI-Assisted Tasks List

| Area                | Task Detail                                                                                                                                          | Tool Used          |
| :------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------- |
| **Security Logic**  | Generated the `VaultSecurity` utility class for AES-256 encryption/decryption using `cryptography`, ensuring proper key handling.                    | Gemini (AI Studio) |
| **Database Models** | Generated the initial Django models for `User` (Custom Auth) and `Transaction`, including the `DecimalField` configurations for financial precision. | Gemini (AI Studio) |
| **Business Logic**  | Assisted in writing the `TransferFundsView` logic, specifically the `select_for_update()` block to prevent Deadlocks by sorting User IDs.            | Gemini (AI Studio) |
| **Frontend UI**     | Generated React components for `Login`, `Register`, and `Dashboard`, including Tailwind CSS classes for the "Flashing Balance" animation.            | Gemini (AI Studio) |
| **Data Generation** | Wrote the `seed_data.py` management command using `Faker` to populate the database with Indian names and realistic transaction history.              | Gemini (AI Studio) |
| **Testing**         | Wrote a `pytest` script to simulate **Race Conditions** (simultaneous requests) to verify that the locking logic prevents double-spending.           | Gemini (AI Studio) |

---

## 📸 Screenshots

### 1. Dashboard (Real-Time Balance & History)

_[Insert Screenshot of Dashboard]_

### 2. Secure Profile (Masked vs Decrypted Aadhaar)

_[Insert Screenshot of Profile Card]_

### 3. Database Admin (Encrypted Data at Rest)

_[Insert Screenshot of Django Admin showing cipher text]_
