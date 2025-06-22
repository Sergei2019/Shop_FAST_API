const API_URL = "http://localhost:8000"; // Адрес FastAPI сервера

// Загрузка товаров
async function loadProducts() {
    const search = document.getElementById('search').value;
    const response = await fetch(`${API_URL}/products?search=${search}`);
    const products = await response.json();
    
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <h3>${product.name}</h3>
            <p>Цена: $${product.price}</p>
            <p>Количество: ${product.quantity}</p>
            <p>${product.description || 'Описание отсутствует'}</p>
            <button onclick="deleteProduct(${product.id})">Удалить</button>
        `;
        container.appendChild(productCard);
    });
}

// Добавление товара
async function addProduct(event) {
    event.preventDefault();
    
    const product = {
        name: document.getElementById('name').value,
        price: parseFloat(document.getElementById('price').value),
        quantity: parseInt(document.getElementById('quantity').value),
        description: document.getElementById('description').value
    };
    
    await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    });
    
    alert('Товар добавлен!');
    loadProducts();
    event.target.reset();
}

// Удаление товара
async function deleteProduct(id) {
    if (!confirm('Удалить товар?')) return;
    
    await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE'
    });
    
    loadProducts();
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});