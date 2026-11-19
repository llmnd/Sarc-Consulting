from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

class ContactRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    organization: str | None = Field(default=None, max_length=160)
    subject: str = Field(min_length=3, max_length=160)
    message: str = Field(min_length=10, max_length=3000)
    website: str = Field(default="", max_length=200)
    turnstile_token: str | None = Field(default=None, max_length=5000)

    @field_validator("name","organization","subject","message")
    @classmethod
    def strip_text(cls, value: str | None) -> str | None:
        if value is not None:
            value = " ".join(value.strip().split())
        return value or None
