from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "SARC Consulting API"
    allowed_origins: str = "http://localhost:3000"
    database_url: str = ""
    admin_session_secret: str = ""
    cookie_secure: bool = False
    contact_email: str = ""
    resend_api_key: str = ""
    resend_from_email: str = "SARC Consulting <onboarding@resend.dev>"
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_from_email: str = ""
    upstash_rest_url: str = ""
    upstash_rest_token: str = ""
    turnstile_secret: str = ""
    model_config = SettingsConfigDict(env_file=(".env", ".env.local"), extra="ignore")

settings = Settings()
