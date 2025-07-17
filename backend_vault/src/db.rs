use async_trait::async_trait;
use chrono::{DateTime, Utc};
use sqlx::{Error, Pool, Postgres, query_as};

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

    async fn get_all_capsule(&self) -> Result<Vec<Capsule>, Error>;

    async fn get_by_pub_id(&self, public_id: &str) -> Result<Option<Vec<Capsule>>, Error>;
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
        let row = query_as!(
            Capsule,
            r#"
    INSERT INTO capsules 
        (public_id, name, email, title, message, unlock_at) 
    VALUES
        ($1, $2, $3, $4, $5, $6)
    RETURNING 
        id, public_id, name, email, title, message,
        unlock_at, created_at, is_unlocked, email_sent
    "#,
            public_id,
            name,
            email,
            title,
            message,
            unlock_at
        )
        .fetch_one(&self.pool)
        .await?;
    Ok(row);
    }

    async fn get_all_capsule(&self) -> Result<Vec<Capsule>, Error> {}

    async fn get_by_pub_id(&self, public_id: &str) -> Result<Option<Vec<Capsule>>, Error> {}
}
