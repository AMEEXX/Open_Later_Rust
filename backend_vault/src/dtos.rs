use chrono::{ DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use validator::Validate;

#[derive(Debug, Clone)]

pub struct Capsule {
    pub id: Uuid,
    pub public_id: String,
    pub name: String,
    pub email: String,
    pub title: String,
    pub message: String,
    pub unlock_at: DateTime<Utc>,
    pub created_at:DateTime<Utc>,
    pub is_unlocked: bool,
    pub email_sent: bool,
}
#[derive(Debug, Deserialize, Validate)]

pub struct CreateCapsuleRequest {
    #[validate(length(min = 1, message = "Name is required"))]
    pub name: String,
    #[validate(email(message = "Please enter a valid email format"))]
    pub email: String,
    #[validate(length(min = 1, message = "Title is required"))]
    pub title: String,
    #[validate(length(min = 1, message = "Please enter a message"))]
    pub message: String,
    pub unlock_at: DateTime<Utc>,
}

#[derive(Debug, Serialize)]
pub struct CreateCapsulseResponse {
    pub pulic_id : String,
    pub unlock_at : DateTime<Utc>,
}
#[derive(Debug, Serialize)]
pub struct CapsuleDto {
    
    pub public_id : String,
    pub name : String,
    pub title: String,
    pub email: String,
    pub message: String,
    pub unlock_at : DateTime<Utc>,
     pub is_unlocked: bool,
    pub email_sent: bool,
}

impl From<Capsule> for CapsuleDto{
    fn from(c:Capsule) -> Self{
        CapsuleDto { 
            public_id: c.public_id, 
            name: c.name, 
            title: c.title, 
            email: c.email, 
            message: c.message, 
            unlock_at: c.unlock_at, 
            is_unlocked: c.is_unlocked, 
            email_sent: c.email_sent }

    }

}



