use serde::Deserialize;
use chrono::{DateTime, Utc};
use uuid::Uuid;
use validator::Validate;

#[derive(Debug,Clone)]

pub struct Capsule {
    pub id: Uuid,
    pub public_id : String,
    pub name : String,
    pub email: String,
    pub title: String,
    pub message: String,
    pub unlock_at : Option<DateTime<Utc>>,
    pub created_at : Option<DateTime<Utc>>,
    pub is_unlocked : Option<bool>,
    pub email_sent : Option<bool>

}
#[derive(Debug, Deserialize,Clone)]

pub struct CreateCapsuleRequest{
    #[validate(length(min = 1, message = "Name is required"))]
    pub name :String,
    #[validate(email(message = "Please enter a valid email format"))]
    pub email:String,
    #[validate(length(min = 1, message= "Title is required"))]
    pub title: String,
    pub message:String,
    pub unlock_at:Option<DateTime<Utc>>,
    pub created_at : Option<DateTime<Utc>>,
    
}

