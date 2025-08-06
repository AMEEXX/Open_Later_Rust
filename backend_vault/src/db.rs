use async_trait::async_trait;
use chrono::{DateTime, Utc};
use sqlx::{Error, Pool, Postgres, Row};
use uuid::Uuid;

use crate::dtos::Capsule;

#[derive(Debug, Clone)]
pub struct DBClient {
    pub pool: Pool<Postgres>,
}

impl DBClient {
    pub fn new(pool: Pool<Postgres>) -> Self {
        Self { pool }
    }
}

#[async_trait]
pub trait TableExt {
    async fn create_capsule(
        &self,
        name: &str,
        email: &str,
        title: &str,
        message: &str,
        unlock_at: DateTime<Utc>,
        public_id: &str,
    ) -> Result<Capsule, Error>;

    async fn get_all_capsules(&self) -> Result<Vec<Capsule>, Error>;

    async fn get_capsule_by_public_id(&self, public_id: &str) -> Result<Option<Capsule>, Error>;
}

#[async_trait]
impl TableExt for DBClient {
    async fn create_capsule(
        &self,
        name: &str,
        email: &str,
        title: &str,
        message: &str,
        unlock_at: DateTime<Utc>,
        public_id: &str,
    ) -> Result<Capsule, Error> {
        let row = sqlx::query(
            r#"
            INSERT INTO capsules 
                (public_id, name, email, title, message, unlock_at) 
            VALUES
                ($1, $2, $3, $4, $5, $6)
            RETURNING 
                id, public_id, name, email, title, message,
                unlock_at, created_at, is_unlocked, email_sent
            "#
        )
        .bind(public_id)
        .bind(name)
        .bind(email)
        .bind(title)
        .bind(message)
        .bind(unlock_at)
        .fetch_one(&self.pool)
        .await?;

        let capsule = Capsule {
            id: row.get("id"),
            public_id: row.get("public_id"),
            name: row.get("name"),
            email: row.get("email"),
            title: row.get("title"),
            message: row.get("message"),
            unlock_at: row.get("unlock_at"),
            created_at: row.get("created_at"),
            is_unlocked: row.get("is_unlocked"),
            email_sent: row.get("email_sent"),
        };

        Ok(capsule)
    }

    async fn get_all_capsules(&self) -> Result<Vec<Capsule>, Error> {
        let rows = sqlx::query(
            r#"
            SELECT * FROM capsules
            ORDER BY created_at DESC
            "#
        )
        .fetch_all(&self.pool)
        .await?;

        let capsules = rows
            .into_iter()
            .map(|row| Capsule {
                id: row.get("id"),
                public_id: row.get("public_id"),
                name: row.get("name"),
                email: row.get("email"),
                title: row.get("title"),
                message: row.get("message"),
                unlock_at: row.get("unlock_at"),
                created_at: row.get("created_at"),
                is_unlocked: row.get("is_unlocked"),
                email_sent: row.get("email_sent"),
            })
            .collect();

        Ok(capsules)
    }

    async fn get_capsule_by_public_id(&self, public_id: &str) -> Result<Option<Capsule>, Error> {
        let row = sqlx::query(
            r#"
            SELECT *
            FROM capsules
            WHERE public_id = $1
            "#
        )
        .bind(public_id)
        .fetch_optional(&self.pool)
        .await?;

        let capsule = row.map(|r| Capsule {
            id: r.get("id"),
            public_id: r.get("public_id"),
            name: r.get("name"),
            email: r.get("email"),
            title: r.get("title"),
            message: r.get("message"),
            unlock_at: r.get("unlock_at"),
            created_at: r.get("created_at"),
            is_unlocked: r.get("is_unlocked"),
            email_sent: r.get("email_sent"),
        });

        Ok(capsule)
    }
}