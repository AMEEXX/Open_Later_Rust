use std::fmt;

use axum::{http::StatusCode, response::{IntoResponse, Response}, Json};
use serde::{Deserialize, Serialize};


#[derive(Debug, Serialize, Deserialize)]
pub struct ErrorResponse {

    pub status : String,
    pub message: String,

}
impl fmt::Display for ErrorResponse{
    fn fmt(&self, f: &mut fmt::Formatter<'_> )->fmt::Result{
        write!(f, "{}", serde_json::to_string(&self).unwrap())
    }
}
#[derive(Debug)]
pub struct Httperror{
    pub message : String,
    pub status : StatusCode,


}
impl Httperror{
    pub fn new(message : impl Into<String>, status : StatusCode) ->Self{
        Httperror{
            message: message.into(),
            status,
        }
    }

    pub fn serer_error(message : impl Into<String>, _status : StatusCode) -> Self{
        Httperror { message: message.into(), status: StatusCode::INTERNAL_SERVER_ERROR }
    }
    
    pub fn bad_request(message : impl Into<String>, _status : StatusCode) -> Self{
        Httperror { message: message.into(), status: StatusCode::BAD_REQUEST }
    }
    pub fn unique_constraint_violation(message : impl Into<String>, _status : StatusCode) -> Self{
        Httperror { message: message.into(), status: StatusCode::CONFLICT }
    }
    
    pub fn unauthorized(message : impl Into<String>, _status : StatusCode) -> Self{
        Httperror { message: message.into(), status: StatusCode::UNAUTHORIZED }
    }
    pub fn into_http_response(self) -> Response{
        let json_response = Json(ErrorResponse{
            status : "fail".to_string(),
            message: self.message.clone(),
        });
        (self.status, json_response).into_response()
    }
}

impl fmt::Display for Httperror{
    fn fmt (&self , f: &mut fmt::Formatter<'_>) -> fmt::Result{
        write!(f, "HttpError : message :{}, status: {}",
        self.message, self.status)
    }
}
impl std::error::Error for Httperror{}

impl IntoResponse for Httperror{
    fn into_response(self) -> Response {
        self.into_http_response()
    }
}
