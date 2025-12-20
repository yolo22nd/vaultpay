# VaultPay - Secure P2P Lending & Transaction System

> **Candidate Name:** Om Tank

> **Role Applied:** Full Stack Python Developer

> **Assignment Choice:** 2, though a **Hybrid Implementation** (Combined Assignment 1 & 2)

---

### 🔗 Quick Links

- 🎥 **Video Demo:** [https://youtu.be/rXeufO0FepI](https://youtu.be/rXeufO0FepI)
- 🌐 **Live Website:** [https://vaultpay-pi.vercel.app/](https://vaultpay-pi.vercel.app/)
  (Free tier render plan -> may experience some initial delays)
- 🐳 **Docker:** Enabled (See `docker-compose.yml`)

---

## 📖 Project Overview

VaultPay is a robust Fintech application designed to demonstrate **High-Concurrency Financial Transactions** and **Identity Security**.

Instead of choosing just one assignment, I have implemented a **Hybrid System** that addresses the core engineering challenges of both tasks:

1.  **From Assignment 1:** Secure **JWT authentication** and Identity Management with **AES-256 Encryption** for sensitive government IDs (Aadhaar).
2.  **From Assignment 2:** Real-time Peer-to-Peer payments using **Atomic ACID Transactions**, **Row-Level Locking**, and **Idempotency** to ensure financial integrity.

### ✅ Task Fulfillment Checklist

Both assignments were fully implemented within the scope of this single application.

| Assignment         | Component           | Implementation Details                                                |
| :----------------- | :------------------ | :-------------------------------------------------------------------- |
| **1. Identity**    | **JWT Auth**        | Implemented via `simplejwt` (Access/Refresh tokens).                  |
| **1. Identity**    | **Encryption**      | Aadhaar stored as AES-256 ciphertext in DB (`core.security`).         |
| **1. Identity**    | **Profile API**     | Decryption happens only on-demand via authenticated GET request.      |
| **2. Transaction** | **Atomic Transfer** | Wrapped in `transaction.atomic()` with `select_for_update()` locking. |
| **2. Transaction** | **Audit Log**       | Immutable `Transaction` model recorded for every transfer.            |
| **2. Transaction** | **Real-Time UI**    | Implemented Short Polling (3s interval) for instant balance updates.  |

---

## ⚙️ Setup & Run Instructions

You can run VaultPay using **Docker (Recommended)** or manually.

### 🐳 Option 1: Docker (Fastest)

Run the entire stack (Database, Backend, Frontend) with one command.

```bash
# 1. Build and Start Services
docker-compose up --build

# The container seeds postgres-db with random data
```

- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:8000`

---

### 🛠 Option 2: Manual Setup

If you prefer running locally without Docker.

#### 1. Backend Setup

```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate  |  Mac/Linux: source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data  # Populates DB
python manage.py runserver
```

#### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

### 🔑 Login Credentials (Pre-filled)

The login page is pre-filled with these Superuser credentials for your convenience:

- **Email:** `omtank22@gmail.com`
- **Password:** `password`

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

## 🤖 AI Flavor: Tool Usage Log

**Effectiveness Score:** **5/5**

**Justification:**
AI tools were utilized as a "Senior Pair Programmer" throughout the lifecycle. Beyond just generating boilerplate, the AI was instrumental in making high-level architectural decisions (like the Hybrid Assignment approach), implementing complex concurrency patterns (row-locking), and debugging specific integration issues between Django and React. This reduced the estimated development time from ~3 days to ~8 hours.

### AI-Assisted Tasks List

| Area                        | Task Detail                                                                                                                                                                | Tool Used          |
| :-------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------- |
| **Backend Setup**           | Generated the complete Django project structure, including the split into `core`, `users`, and `wallet` apps, and configured `settings.py` for JWT Auth and CORS.          | Gemini (AI Studio) |
| **Database Modeling**       | Designed and generated the `User` model (custom Auth), `Transaction` ledger, and `IdempotencyLog` models, specifically enforcing `DecimalField` for financial precision.   | Gemini (AI Studio) |
| **Security Logic**          | Wrote the `VaultSecurity` utility class to handle **AES-256 encryption/decryption** for the Aadhaar field using the `cryptography` library.                                | Gemini (AI Studio) |
| **Complex Business Logic**  | Implemented the `TransferFundsView` with **Atomic Transactions** (`transaction.atomic`) and **Row-Level Locking** (`select_for_update`) to prevent Race Conditions.        | Gemini (AI Studio) |
| **Reliability Engineering** | Designed the **Idempotency** logic to handle network retries, including generating the middleware logic to cache and return previous responses for duplicate request keys. | Gemini (AI Studio) |
| **Frontend Architecture**   | Set up the React + Vite environment and generated the **Axios Interceptor** to automatically attach JWT tokens to requests and handle 401 redirects.                       | Gemini (AI Studio) |
| **UI Development**          | Generated React components for `Login`, `Register`, and `Dashboard`, including the logic for **Optimistic UI updates** and **Tailwind CSS** styling.                       | Gemini (AI Studio) |
| **UX Animations**           | Created the `FlashingBalance` component logic to visually indicate real-time financial changes (Red/Green flash) using React `useEffect` hooks.                            | Gemini (AI Studio) |
| **Debugging**               | Diagnosed and fixed the "UUID not JSON serializable" error in the transaction view and identified the missing **Pagination** configuration in DRF settings.                | Gemini (AI Studio) |
| **Data Generation**         | Wrote the `seed_data.py` management command using `Faker` to populate the database with 20 realistic Indian users and 100 linked transactions for load testing.            | Gemini (AI Studio) |
| **Testing**                 | Wrote a `pytest` script (`test_ai_generated.py`) to simulate concurrent API requests, verifying that the database locking mechanism successfully prevents double-spending. | Gemini (AI Studio) |

---

## 📸 Screenshots

### 1. Dashboard (Real-Time Balance & History)

![Dashboard image here](images/image.png)

### 2. Secure Profile (Masked vs Decrypted Aadhaar)

![alt text](images/image-1.png) ![alt text](images/image-2.png)

### 3. Database Admin (Encrypted Data at Rest)

![alt text](images/image-3.png)
