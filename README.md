# OpenLater - Future Vault Application

##  Project Concept
**OpenLater** is a future vault application that allows users to create messages for their future selves. Users write personal notes, set a future unlock date, and the message remains sealed until that date arrives.

##  System Architecture

```
┌─────────────────┐    HTTP/JSON     ┌──────────────────┐    SQL Queries    ┌─────────────────┐
│                 │    Requests      │                  │                   │                 │
│   Frontend      │ ◄─────────────►  │   Rust Backend   │ ◄──────────────►  │   PostgreSQL    │
│   (React/Vue)   │                  │   (Axum Server)  │                   │   Database      │
│                 │                  │                  │                   │                 │
└─────────────────┘                  └──────────────────┘                   └─────────────────┘
        │                                     │                                      │
        │                                     │                                      │
        ▼                                     ▼                                      ▼
┌─────────────────┐                  ┌──────────────────┐                    ┌─────────────────┐
│ User Interface  │                  │ API Endpoints    │                    │ Capsules Table  │
│ - Create Form   │                  │ - POST /create   │                    │ - id (UUID)     │
│ - View Capsules │                  │ - GET /capsules  │                    │ - public_id     │
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


 
##  User Flow

```
┌─────────────┐
│   User      │
│  Visits     │
│  Website    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Fills     │
│ Capsule     │
│   Form      │
└──────┬──────┘
       │
       ▼
┌─────────────┐    ┌──────────────────┐
│  Backend    │    │   Database       │
│  Validates  │──> │   Stores         │
│    Data     │    │   Capsule        │
└──────┬──────┘    └──────────────────┘
       │
       ▼
┌─────────────┐
│  Returns    │
│ Public ID   │
│ & Unlock    │
│   Date      │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   User      │
│   Gets      │
│ Shareable   │
│    Link     │
└─────────────┘
```

##  Technology Stack

### Backend (Rust)
- **Framework**: Axum (async web framework)
- **Database ORM**: SQLx (compile-time checked SQL)
- **Validation**: Validator crate
- **ID Generation**: Nanoid (for public IDs)
- **CORS**: Tower-HTTP middleware

### Database (PostgreSQL)
- **Primary Key**: UUID for internal ID
- **Public Access**: Short nanoid for sharing
- **Timestamps**: Timezone-aware dates
- **Boolean Flags**: Track unlock/email status

### Deployment
- **Backend**: Render (cloud platform)
- **Database**: PostgreSQL on Render
- **Frontend**: React , Vite

##  Data Flow

```
CREATE CAPSULE FLOW:
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   User      │────>│   Axum      │────>│ PostgreSQL  │────>│  Response   │
│   Input     │     │ Validates   │     │   Stores    │     │ Public ID   │
│             │     │ & Generates │     │  Capsule    │     │ + Unlock    │
│             │     │ Public ID   │     │             │     │   Date      │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘

RETRIEVE CAPSULE FLOW:
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Public    │────>│    Query    │────>│   Check     │───> │   Return    │
│     ID      │     │  Database   │     │  Unlock     │     │  Message    │
│  Request    │     │ by Public   │     │   Date      │     │ (if ready)  │
│             │     │     ID      │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

##  Security Features (Current & Potential)

### Current Implementation:
-  CORS protection
-  Input validation  
- SQL injection protection (SQLx)
- Public ID obfuscation (not sequential)

### Future Enhancements:
- Message encryption at rest
- Email notifications on unlock
- Rate limiting
- User authentication

##  Key Features

1. **Time-Locked Messages**: Content only accessible after unlock date
2. **Public Sharing**: Shareable links via public ID
3 **Timeline View**: See all capsules with unlock status
4. **Responsive Design**: Works on mobile and desktop

## Potential Improvements

- **Email Notifications**: Send reminder when capsule unlocks
- **Rich Media**: Support images, videos in capsules  
- **Social Features**: Share with friends/family
- **Analytics**: Track creation/unlock patterns
- **Mobile App**: Native iOS/Android versions
- **Bulk Operations**: Create multiple capsules at once

## Business Value

- **Personal Growth**: Reflection and goal tracking
- **Memory Preservation**: Future messages for families
- **Event Planning**: Messages for special occasions
- **Educational**: Student projects and future career notes

---

*This project demonstrates full-stack development with modern Rust backend, database design, API development, and deployment practices.*