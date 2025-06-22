const API_URL = "http://localhost:8000";
let currentUser = null;
let token = localStorage.getItem('token');
// В script.js
console.log("Файл script.js загружен!"); // Должен появиться в консоли

// Проверка аутентификации
async function checkAuth() {
    if (!token) return false;
    
    try {
        const response = await fetch(`${API_URL}/users/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            currentUser = await response.json();
            updateUI();
            return true;
        } else {
            localStorage.removeItem('token');
            token = null;
            return false;
        }
    } catch (error) {
        console.error("Ошибка проверки аутентификации:", error);
        return false;
    }
}

// Обновление UI в зависимости от статуса аутентификации
function updateUI() {
    const usernameSpan = document.getElementById('username');
    const logoutBtn = document.getElementById('logout-btn');
    const loginBtn = document.getElementById('login-btn');
    const addForm = document.getElementById('add-product-form');
    
    if (currentUser) {
        usernameSpan.textContent = currentUser.username;
        logoutBtn.style.display = 'block';
        loginBtn.style.display = 'none';
        addForm.style.display = 'block';
    } else {
        usernameSpan.textContent = 'Гость';
        logoutBtn.style.display = 'none';
        loginBtn.style.display = 'block';
        addForm.style.display = 'none';
    }
}

// Регистрация
async function register(event) {
    event.preventDefault();
    
    const user = {
        username: document.getElementById('register-username').value,
        email: document.getElementById('register-email').value,
        password: document.getElementById('register-password').value
    };
    
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });
        
        if (response.ok) {
            alert('Регистрация успешна! Теперь вы можете войти.');
            switchToLogin();
        } else {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Ошибка регистрации');
        }
    } catch (error) {
        console.error("Ошибка регистрации:", error);
        alert("Ошибка регистрации: " + error.message);
    }
}

// Вход
async function login(event) {
    event.preventDefault();
    
    const credentials = {
        email: document.getElementById('login-email').value,
        password: document.getElementById('login-password').value
    };
    
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        
        if (response.ok) {
            const data = await response.json();
            token = data.access_token;
            localStorage.setItem('token', token);
            await checkAuth();
            window.location.href = 'index.html';
        } else {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Ошибка входа');
        }
    } catch (error) {
        console.error("Ошибка входа:", error);
        alert("Ошибка входа: " + error.message);
    }
}

// Выход
function logout() {
    localStorage.removeItem('token');
    token = null;
    currentUser = null;
    updateUI();
}

// Переключение между вкладками входа/регистрации
function switchToLogin() {
    document.getElementById('login-tab').classList.add('active');
    document.getElementById('register-tab').classList.remove('active');
    document.getElementById('login-form').classList.add('active');
    document.getElementById('register-form').classList.remove('active');
}

function switchToRegister() {
    document.getElementById('register-tab').classList.add('active');
    document.getElementById('login-tab').classList.remove('active');
    document.getElementById('register-form').classList.add('active');
    document.getElementById('login-form').classList.remove('active');
}

// Обновленные функции для работы с продуктами
async function loadProducts() {
    if (!currentUser) return;
    
    try {
        const search = document.getElementById('search').value;
        const response = await fetch(`${API_URL}/products?search=${encodeURIComponent(search)}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        // Остальной код без изменений
    } catch (error) {
        console.error("Ошибка при загрузке товаров:", error);
        alert("Ошибка при загрузке товаров: " + error.message);
    }
}

async function addProduct(event) {
    event.preventDefault();
    
    if (!currentUser) {
        alert('Для добавления товара необходимо войти в систему');
        return;
    }
    
    // Остальной код без изменений, но с добавлением токена в запрос
    const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(product)
    });
    
    // Остальной код без изменений
}

async function deleteProduct(id) {
    if (!currentUser) return;
    
    // Остальной код без изменений, но с добавлением токена в запрос
    const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    
    
}

// Инициализация
document.addEventListener('DOMContentLoaded', async () => {
    // Для страницы аутентификации
    if (document.getElementById('login-form')) {
        document.getElementById('login-form').addEventListener('submit', login);
        document.getElementById('register-form').addEventListener('submit', register);
        document.getElementById('login-tab').addEventListener('click', switchToLogin);
        document.getElementById('register-tab').addEventListener('click', switchToRegister);
    }
    
    // Для главной страницы
    if (document.getElementById('logout-btn')) {
        await checkAuth();
        document.getElementById('logout-btn').addEventListener('click', logout);
        document.getElementById('login-btn').addEventListener('click', () => {
            window.location.href = 'auth.html';
        });
        
        if (currentUser) {
            loadProducts();
        }
    }
});