use sqlx::{Pool, Postgres};
use sqlx::query_as;
use crate::dtos::Capsule;
#[derive(Debug, Clone)]
pub struct DBClient {
    pub pool: Pool<Postgres>,
}

impl DBClient {
    pub fn new(pool: Pool<Postgres>) -> Self {
        DBClient { pool }
    }

    pub async fn get_capsules(&self) -> Result<Vec<Capsule>, sqlx::Error> {
        let capsules = query_as!(
            Capsule,
            "SELECT * FROM capsules"
        )
        .fetch_all(&self.pool)
        .await?;

        Ok(capsules)
    }
}
