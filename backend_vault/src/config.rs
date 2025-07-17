#[derive(Debug,Clone)]
pub struct Config{
    pub database_url: String,
    pub port : u16,
}
impl Config{
    pub fn init() ->Config{
        let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");
        let port = std::env::var("PORT").expect("Port in not set in the .env").parse::<u16>().expect("The port must be a valid number");
        Config{
            database_url,
            port ,
        }
    }
}