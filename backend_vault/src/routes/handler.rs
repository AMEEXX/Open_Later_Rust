use crate::{
    AppState,
    db::TableExt,
    dtos::{ CapsuleDto, CreateCapsuleRequest, CreateCapsulseResponse},
    error::Httperror,
};

use axum::{extract::Path, response::{Html, IntoResponse}, Extension, Json};
use nanoid::nanoid;



use std::sync::Arc;
use validator::Validate;


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
        .map_err(|err| Httperror::server_error(err.to_string()))?;

    let response = CreateCapsulseResponse {
        public_id: capsule.public_id,
        unlock_at: capsule.unlock_at.unwrap(),
    };

    Ok(Json(response))
}

pub async fn get_all_capsules(
    Extension(app_state): Extension<Arc<AppState>>,
) -> Result<impl IntoResponse, Httperror> {
    let capsules = app_state
        .db_client
        .get_all_capsules()
        .await
        .map_err(|err| Httperror::server_error(err.to_string()))?;

    let capsuledto: Vec<CapsuleDto> = capsules.into_iter().map(Into::into).collect();

    Ok(Json(capsuledto))
}

pub async fn get_capsule_by_public_id(Extension(app_state): Extension<Arc<AppState>>, Path(public_id):Path<String>) ->Result<impl IntoResponse, Httperror>{

    let capsule = app_state.db_client.get_capsule_by_public_id(&public_id).await.map_err(|err| Httperror::server_error(err.to_string()))?;
    match capsule{
        Some(capsule) => {let capsule_dto = CapsuleDto ::from(capsule);
         Ok(Json(capsule_dto))}
        None => Err(Httperror ::bad_request("No such capsule exist".to_string())),

    }

   


}
