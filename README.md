# Open Later - Future Vault Application

## Project Concept

**Future Vault** is an application that allows users to write messages or memories today, lock them until a future date they choose, and share them with others. The vault automatically unlocks on the specified date.
Think of it like "a letter to your future self" or "a digital time capsule for memories."

---

## System Architecture

```
┌─────────────────┐    HTTP/JSON     ┌──────────────────┐    SQL Queries    ┌─────────────────┐
│                 │    Requests      │                  │                   │                 │
│   Frontend      │ ◄─────────────►  │   Rust Backend   │ ◄──────────────►  │   PostgreSQL    │
│   (React/Vite)  │                  │   (Axum Server)  │                   │   Database      │
│                 │                  │                  │                   │                 │
└─────────────────┘                  └──────────────────┘                   └─────────────────┘
        │                                     │                                      │
        │                                     │                                      │
        ▼                                     ▼                                      ▼
┌─────────────────┐                  ┌──────────────────┐                    ┌─────────────────┐
│ User Interface  │                  │ API Endpoints    │                    │ Vaults Table    │
│ - Create Form   │                  │ - POST /create   │                    │ - id (UUID)     │
│ - View Vaults   │                  │ - GET /capsules  │                    │ - public_id     │
│ - Unlock Status │                  │ - GET /capsule/  │                    │ - name          │
└─────────────────┘                  └──────────────────┘                    │ - email         │
                                                                             │ - title         │
                                                                             │ - message       │
                                                                             │ - unlock_at     │
                                                                             │ - created_at    │
                                                                             │ - is_unlocked   │
                                                                             └─────────────────┘
```

![Client Architecture](./Vault%20Frontend%20New/Temp_vault/src/assets/client.png)

![API Layer](./Vault%20Frontend%20New/Temp_vault/src/assets/api.png)

![Data Layer](./Vault%20Frontend%20New/Temp_vault/src/assets/data.png)

![Logic](./Vault%20Frontend%20New/Temp_vault/src/assets/logic.png)
---

## Project Architecture (High-Level)

### Frontend (React + Vite)

* **Purpose**: User interface where users create and view vaults
* **Why React**: Easy to build interactive UIs with reusable components
* **Why Vite**: Fast development server with optimized builds

### Backend (Rust + Axum)

* **Purpose**: Handles business logic, validation, and database operations
* **Why Rust**: Memory-safe, performant, and reliable for backend services
* **Why Axum**: Modern, async Rust web framework suited for APIs

### Database (PostgreSQL)

* **Purpose**: Stores all vault records
* **Why PostgreSQL**: Reliable, supports timezone-aware timestamps for unlocking

---

## Technology Stack

### Frontend

* **React Router DOM** – Navigation between pages
* **Axios** – HTTP requests to backend
* **Tailwind CSS** – Utility-first styling
* **Lucide React** – Icons for UI
* **Date-fns + React Day Picker** – Date handling and calendar UI

### Backend (Rust)

* **Axum** – Async web framework for routing and request handling
* **SQLx** – Compile-time checked SQL queries
* **Serde** – JSON serialization/deserialization
* **Validator** – Input validation
* **UUID + Nanoid** – Unique ID generation
* **Tower-HTTP CORS** – Cross-origin request handling

### Database (PostgreSQL)

* **Primary Key**: UUID for internal ID
* **Public Access**: Short nanoid for sharing
* **Timestamps**: Timezone-aware dates
* **Boolean Flags**: Track unlock/email status

---

## API Endpoints

| Method | Endpoint              | Description                        |
| ------ | --------------------- | ---------------------------------- |
| GET    | `/`                   | Welcome page                       |
| GET    | `/capsules`           | Get all vaults (messages filtered) |
| GET    | `/capsule/:public_id` | Get specific vault                 |
| POST   | `/create`             | Create new vault                   |

---

## Data Flow

### Create Vault Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   User      │────>│   Axum      │────>│ PostgreSQL  │────>│  Response   │
│   Input     │     │ Validates   │     │   Stores    │     │ Public ID   │
│             │     │ & Generates │     │  Vault      │     │ + Unlock    │
│             │     │ Public ID   │     │             │     │   Date      │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

### Retrieve Vault Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Public    │────>│    Query    │────>│   Check     │───> │   Return    │
│     ID      │     │  Database   │     │  Unlock     │     │  Message    │
│  Request    │     │ by Public   │     │   Date      │     │ (if ready)  │
│             │     │     ID      │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

---

## Key Features

1. **Create Vault**

   * User fills form: name, email, title, message, unlock date
   * Two-step validation (frontend + backend)
   * Generates unique public ID (nanoid)
   * Stores in database with current timestamp
   * Returns shareable link

2. **View All Vaults**

   * Fetch all vaults from database
   * Shows locked/unlocked status
   * Locked vaults hide messages
   * Displays unlock dates and creation info

3. **Individual Vault View**

   * Access via unique public ID
   * Locked: lock icon + hidden message
   * Unlocked: full message content
   * Shareable link support

4. **Time-based Unlocking**

   * Compares current time with `unlock_at` timestamp
   * Backend determines unlock state
   * Frontend displays UI accordingly

5. **Responsive Design**

   * Works across desktop and mobile devices

---

## Security Features

### Current

* CORS protection
* Input validation
* SQL injection prevention (SQLx)
* Public ID obfuscation

### Potential Enhancements

* Message encryption at rest
* Email notifications on unlock
* Rate limiting
* User authentication

---

## Deployment

* **Frontend**: Vercel – automatic deploy from Git, CDN-backed
* **Backend**: Render – Rust server hosting
* **Database**: PostgreSQL on Render

---

## Business Value

* **Personal Growth**: Reflection and goal tracking
* **Memory Preservation**: Store memories for future
* **Event Planning**: Messages for special occasions
* **Education**: Future notes for students or projects

---

*This project demonstrates a complete full-stack implementation with a modern Rust backend, database design, secure API development, and production deployment.*
