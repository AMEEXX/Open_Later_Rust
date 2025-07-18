use axum::{routing::{get, post}, Router};

use crate::routes::handler::{create_capsule, get_all_capsules, get_capsule_by_public_id, hellovault};
pub mod handler;



pub fn routes() ->Router {
    Router::new()
    .route("/", get(hellovault))
    .route("/capsules", get(get_all_capsules))
    .route("/create",post( create_capsule))
    .route("/capsule/:public_id",get(get_capsule_by_public_id))
    

}