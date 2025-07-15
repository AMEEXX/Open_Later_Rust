use core::fmt;

use axum::Error;
use serde::{Deserialize, Serialize};



#[derive(Debug, Serialize, Deserialize)]
pub struct ErrorResponse {

    pub status : String,
    pub message: String,

}
impl fmt::Display for ErrorResponse{
    fn fmt(&self)
}