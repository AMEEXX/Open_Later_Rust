#[derive(Debug,Clone)]
pub struct Config{
    pub database_url: String,
    pub port : u16,
}

impl Config{
    pub fn init() -> Config{
        let database_url = std::env::var("DATABASE_URL")
            .expect("DATABASE_URL must be set");
        
        let port = std::env::var("PORT")
            .unwrap_or_else(|_| "4000".to_string())
            .parse::<u16>()
            .expect("PORT must be a valid number");
        
        println!("Starting server on port: {}", port);
        
        Config{
            database_url,
            port,
        }
    }
}