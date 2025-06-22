from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    id: int
    username: str
    email: EmailStr

class Product(BaseModel):
    name: str
    price: float
    quantity: int
    description: str = None

class Token(BaseModel):
    access_token: str
    token_type: str