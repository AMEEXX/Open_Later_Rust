use crate::{
    db::TableExt, dtos::{Capsule, CreateCapsuleRequest, CreateCapsulseResponse}, error::Httperror, AppState
};
use axum::{http::response, response::IntoResponse, Extension, Json};
use nanoid::nanoid;
use std::sync::Arc;
use validator::Validate;

pub async fn create_capsule(
    Extension(app_state): Extension<Arc<AppState>>,
    Json(payload): Json<CreateCapsuleRequest>,
) -> Result<impl IntoResponse, Httperror> {
    payload
        .validate()
        .map_err(|err| Httperror::bad_request(err.to_string()))?;

    let public_is = nanoid!(10);

    let capsule = app_state
        .db_client
        .create_capsule(
            &payload.name,
            &payload.email,
            &payload.title,
            &payload.message,
            payload.unlock_at,
            &public_is,
        )
        .await
        .map_err(|err| Httperror::server_error(err.to_string()));
        
        let response = CreateCapsulseResponse{
            public_id : capsule.public_id,
            unlock_at : capsule.unlock_at.unwrap()
        }
          
    Ok(Json("Success"))
}
