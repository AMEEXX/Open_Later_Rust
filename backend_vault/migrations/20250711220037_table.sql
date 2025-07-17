-- Add migration script here
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TABLE IF NOT EXISTS CAPSULES (
            id UUID PRIMARY KEY DEFAUTL   uuid_generate_v4(),
            public_id TEXT UNIQUE NOT NULL,
            name TEXT UNIQUE NOT NULL,
            email TEXT NOT NULL,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            unlock_at TIMESTAMPTZ NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            is_unlocked BOOLEAN DEFAULT FALSE,
            email_sent BOOLEAN DEFAULT FALSE
    );