from pydantic import BaseModel


class User(BaseModel):
    id: int
    name: str
    last_name: str
    age: int
    gender: str


class Product(BaseModel):
    name: str
    price: float
    quantity: int
    description: str = None