use std::{net::SocketAddr, sync::Arc};
use axum::Extension;
use crate::{db::DBClient, routes::routes};
use config::Config;
use dotenv::dotenv;
use sqlx::postgres::PgPoolOptions;
use tracing_subscriber::filter::LevelFilter;

mod config;
mod db;
mod dtos;
mod error;
mod routes;

#[derive(Debug, Clone)]
pub struct AppState {
    pub env: Config,
    pub db_client: Arc<DBClient>,
}

#[tokio::main]
async fn main() {
    
    tracing_subscriber::fmt()
        .with_max_level(LevelFilter::DEBUG)
        .init();
    
    println!("Starting backend server...");
    
    dotenv().ok();
    let config = Config::init();
    
    println!("Config loaded - Database URL: {}", 
             config.database_url.chars().take(20).collect::<String>() + "...");
    
    let pool = match PgPoolOptions::new()
        .max_connections(10)
        .connect(&config.database_url)
        .await
    {
        Ok(pool) => {
            println!(" Connection to the database is successful");
            pool
        }
        Err(err) => {
            println!("Failed to connect to the database: {:?}", err);
            std::process::exit(1);
        }
    };

    use tower_http::cors::CorsLayer;
    use axum::http::{Method, HeaderValue};

    let cors = CorsLayer::new()
        .allow_origin([
            HeaderValue::from_static("https://open-later-rust.vercel.app"),
            HeaderValue::from_static("http://127.0.0.1:5173"),
            HeaderValue::from_static("http://localhost:5173"),
        ])
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::OPTIONS])
        .allow_headers([
            http::header::AUTHORIZATION,
            http::header::ACCEPT,
            http::header::CONTENT_TYPE,
        ])
        .allow_credentials(true);

    let db_client = Arc::new(DBClient::new(pool));

    let app_state = AppState {
        env: config.clone(),
        db_client,
    };
    let app = routes().layer(Extension(Arc::new(app_state))).layer(cors);

    println!("Server is running at the port: {}", config.port);

    let addr = SocketAddr::from(([0, 0, 0, 0], config.port));
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}