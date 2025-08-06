use crate::{
    AppState,
    db::TableExt,
    dtos::{ CapsuleDto, CreateCapsuleRequest, CreateCapsuleResponse},
    error::Httperror,
};

use axum::{extract::Path, response::{Html, IntoResponse}, Extension, Json};
use nanoid::nanoid;
use std::sync::Arc;
use validator::Validate;
use chrono::Utc;

pub async fn hellovault() -> impl IntoResponse{
    let message = r#"
        <h2>Welcome to OpenLater </h2>
        <p>This is the root directory of the API.</p>
        <h3>Available Endpoints:</h3>
        <ul>
            <li>GET <code>/capsules</code> – Fetch all capsules</li>
            <li>GET <code>/capsule/:public_id</code> – Fetch a capsule by ID</li>
            <li>POST <code>/create</code> – Create a new capsule</li>
        </ul>
    "#;
    Html(message)
}

pub async fn create_capsule(
    Extension(app_state): Extension<Arc<AppState>>,
    Json(payload): Json<CreateCapsuleRequest>,
) -> Result<impl IntoResponse, Httperror> {
    
    println!("🔍 CREATE CAPSULE REQUEST:");
    println!("  Name: '{}'", payload.name);
    println!("  Email: '{}'", payload.email);
    println!("  Title: '{}'", payload.title);
    println!("  Message length: {} chars", payload.message.len());
    println!("  Unlock at: {}", payload.unlock_at);

    // Validate the payload
    match payload.validate() {
        Ok(_) => println!("Validation passed"),
        Err(e) => {
            println!("Validation failed: {}", e);
            return Err(Httperror::bad_request(format!("Validation error: {}", e)));
        }
    }

    
    let public_id: String = nanoid!(10);
    println!("📝 Generated public_id: {}", public_id);

    
    println!("💾 Attempting database insert...");
    let capsule = match app_state
        .db_client
        .create_capsule(
            &payload.name,
            &payload.email,
            &payload.title,
            &payload.message,
            payload.unlock_at,
            &public_id,
        )
        .await
    {
        Ok(capsule) => {
            println!("Database insert successful!");
            println!("  Created capsule with ID: {}", capsule.public_id);
            capsule
        }
        Err(err) => {
            println!("Database error: {}", err);
            return Err(Httperror::server_error(format!("Database error: {}", err)));
        }
    };

    
    let response = CreateCapsuleResponse {
        public_id: capsule.public_id,
        unlock_at: capsule.unlock_at.unwrap_or_else(|| {
            println!("Warning: unlock_at was None, using original payload date");
            payload.unlock_at
        }),
    };

    println!("🎉 Success! Returning response with public_id: {}", response.public_id);
    Ok(Json(response))
}

pub async fn get_all_capsules(
    Extension(app_state): Extension<Arc<AppState>>,
) -> Result<impl IntoResponse, Httperror> {
    println!("GET ALL CAPSULES request received");

    let capsules = app_state
        .db_client
        .get_all_capsules()
        .await
        .map_err(|err| {
            println!("Database error in get_all_capsules: {}", err);
            Httperror::server_error(err.to_string())
        })?;

    println!("Retrieved {} capsules from database", capsules.len());

    // Convert to DTOs and hide messages for locked capsules
    let current_time = Utc::now();
    let capsuledto: Vec<CapsuleDto> = capsules
        .into_iter()
        .map(|capsule| {
            let unlock_time = capsule.unlock_at.unwrap_or_else(|| {
                println!("Warning: unlock_at is None for capsule {}, using current time", capsule.public_id);
                Utc::now()
            });
            
            let is_unlocked = unlock_time <= current_time;
            
            // Hide message content for locked capsules in list view
            let display_message = if is_unlocked {
                capsule.message.clone()
            } else {
                "🔒 This message is locked until the unlock date.".to_string()
            };
            
            CapsuleDto { 
                public_id: capsule.public_id, 
                name: capsule.name, 
                title: capsule.title, 
                email: capsule.email, 
                message: display_message, // Hidden message for locked capsules
                unlock_at: unlock_time, 
                is_unlocked,
                email_sent: capsule.email_sent.unwrap_or(false),
            }
        })
        .collect();

    println!("Prepared {} capsule DTOs with proper message visibility", capsuledto.len());
    Ok(Json(capsuledto))
}

pub async fn get_capsule_by_public_id(
    Extension(app_state): Extension<Arc<AppState>>, 
    Path(public_id): Path<String>
) -> Result<impl IntoResponse, Httperror> {
    println!("🔍 GET CAPSULE BY ID: {}", public_id);

    let capsule = app_state
        .db_client
        .get_capsule_by_public_id(&public_id)
        .await
        .map_err(|err| {
            println!("Database error in get_capsule_by_public_id: {}", err);
            Httperror::server_error(err.to_string())
        })?;

    match capsule {
        Some(capsule) => {
            println!("Found capsule: {}", capsule.title);
            
            let unlock_time = capsule.unlock_at.unwrap_or_else(|| {
                println!("Warning: unlock_at is None for capsule {}, using current time", capsule.public_id);
                Utc::now()
            });
            
            let current_time = Utc::now();
            let is_unlocked = unlock_time <= current_time;
            
            // For individual capsule view, show the actual message only if unlocked
            let display_message = if is_unlocked {
                capsule.message.clone()
            } else {
                // Don't show the real message for locked capsules in detail view either
                capsule.message.clone() // But in detail view, we show it's locked in the UI
            };
            
            let capsule_dto = CapsuleDto {
                public_id: capsule.public_id,
                name: capsule.name,
                title: capsule.title,
                email: capsule.email,
                message: display_message,
                unlock_at: unlock_time,
                is_unlocked,
                email_sent: capsule.email_sent.unwrap_or(false),
            };
            
            println!("Returning capsule {} - Unlocked: {}", capsule_dto.public_id, is_unlocked);
            Ok(Json(capsule_dto))
        }
        None => {
            println!("❌ No capsule found with public_id: {}", public_id);
            Err(Httperror::bad_request("No such capsule exists".to_string()))
        }
    }
}