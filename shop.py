from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from auth import (
    create_access_token, 
    authenticate_user, 
    get_current_user,
    get_password_hash,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    SECRET_KEY,
    ALGORITHM
)
from models import UserCreate, UserLogin, Token, Product, User
from datetime import timedelta
import uuid

app = FastAPI()


# Разрешить доступ с фронтенд-сервера
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5500"],  # Ваш фронтенд-адрес
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# "База данных"
products_db = [
    {"id": 1, "name": "Яблоки", "price": 1.99, "quantity": 50},
    {"id": 2, "name": "Молоко", "price": 2.49, "quantity": 30}
]


@app.get("/products")
def get_products(search: str = ""):
    if search:
        return [p for p in products_db if search.lower() in p["name"].lower()]
    return products_db


@app.post("/products")
def add_product(product: Product):
    new_id = max(p["id"] for p in products_db) + 1
    new_product = {"id": new_id, **product.dict()}
    products_db.append(new_product)
    return new_product


@app.delete("/products/{product_id}")
def delete_product(product_id: int):
    global products_db
    initial_count = len(products_db)
    products_db = [p for p in products_db if p["id"] != product_id]
    
    if len(products_db) == initial_count:
        raise HTTPException(status_code=404, detail="Товар не найден")
    return {"message": "Товар удален"}