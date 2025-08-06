use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use validator::Validate;

#[derive(Debug, Clone, Serialize)]
pub struct Capsule {
    pub id: Uuid,
    pub public_id: String,
    pub name: String,
    pub email: String,
    pub title: String,
    pub message: String,
    pub unlock_at: Option<DateTime<Utc>>,  
    pub created_at: Option<DateTime<Utc>>,
    pub is_unlocked: Option<bool>, 
    pub email_sent: Option<bool>,
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
pub struct CreateCapsuleResponse {
    pub public_id: String,
    pub unlock_at: DateTime<Utc>,
}

#[derive(Debug, Serialize)]
pub struct CapsuleDto {
    pub public_id: String,
    pub name: String,
    pub title: String,
    pub email: String,
    pub message: String,
    pub unlock_at: DateTime<Utc>,
    pub created_at: Option<DateTime<Utc>>,
    pub is_unlocked: bool,
    pub email_sent: bool,
}

impl From<Capsule> for CapsuleDto {
    fn from(c: Capsule) -> Self {
        let unlock_time = c.unlock_at.unwrap_or_else(|| {
            println!("Warning: unlock_at is None, using current time");
            Utc::now()
        });
        
        let current_time = Utc::now();
        let is_unlocked = unlock_time <= current_time;
        
        // CRITICAL: Hide message content for locked capsules
        let safe_message = if is_unlocked {
            c.message // Show actual message only if unlocked
        } else {
            "🔒 This message is locked and will be revealed when the time capsule unlocks.".to_string()
        };
        
        CapsuleDto { 
            public_id: c.public_id, 
            name: c.name, 
            title: c.title, 
            email: c.email, 
            message: safe_message, // Secured message based on unlock status
            unlock_at: unlock_time,
            created_at: c.created_at,
            is_unlocked,
            email_sent: c.email_sent.unwrap_or(false),
        }
    }
}

// Separate DTO for detailed view to allow showing locked message in UI but not content
#[derive(Debug, Serialize)]
pub struct CapsuleDetailDto {
    pub public_id: String,
    pub name: String,
    pub title: String,
    pub email: String,
    pub message: String, // Will contain actual message even if locked (UI decides what to show)
    pub unlock_at: DateTime<Utc>,
    pub created_at: Option<DateTime<Utc>>,
    pub is_unlocked: bool,
    pub email_sent: bool,
}

impl Capsule {
    // Method to create a detail DTO (for individual capsule view)
    pub fn to_detail_dto(&self) -> CapsuleDetailDto {
        let unlock_time = self.unlock_at.unwrap_or_else(|| {
            println!("Warning: unlock_at is None, using current time");
            Utc::now()
        });
        
        let current_time = Utc::now();
        let is_unlocked = unlock_time <= current_time;
        
        CapsuleDetailDto {
            public_id: self.public_id.clone(),
            name: self.name.clone(),
            title: self.title.clone(),
            email: self.email.clone(),
            message: self.message.clone(), // Keep actual message for detail view
            unlock_at: unlock_time,
            created_at: self.created_at,
            is_unlocked,
            email_sent: self.email_sent.unwrap_or(false),
        }
    }
}