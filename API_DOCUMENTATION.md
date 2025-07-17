# Food Ordering System API Documentation

## 📚 API Endpoints

### 🔐 Authentication

#### Register User
```
POST /api/users/register/
```
Body:
```json
{
    "username": "string",
    "email": "string",
    "password": "string",
    "phone": "string",
    "address": "string",
    "role": "customer|restaurant_owner"
}
```

#### Login
```
POST /api/users/login/
```
Body:
```json
{
    "email": "string",
    "password": "string"
}
```

Response:
```json
{
    "user": {...},
    "access": "jwt_token",
    "refresh": "refresh_token"
}
```

### 👤 User Management

#### Get User Profile
```
GET /api/users/profile/
Authorization: Bearer <token>
```

#### Update User Profile
```
PUT /api/users/profile/
Authorization: Bearer <token>
```

### 🏪 Restaurants

#### List All Restaurants
```
GET /api/restaurants/
```

#### Get Restaurant Details
```
GET /api/restaurants/{id}/
```

#### Create Restaurant (Restaurant Owner only)
```
POST /api/restaurants/
Authorization: Bearer <token>
```

#### Get Restaurant Menus
```
GET /api/restaurants/{restaurant_id}/menus/
```

#### Search Restaurants
```
GET /api/restaurants/search/?q=search_term
```

#### Popular Restaurants
```
GET /api/restaurants/popular/
```

### 🍽️ Menu Items

#### List Menu Items
```
GET /api/restaurants/menus/{menu_id}/items/
```

#### Get Menu Item Details
```
GET /api/restaurants/menu-items/{id}/
```

### 📝 Orders

#### Create Order
```
POST /api/orders/create/
Authorization: Bearer <token>
```
Body:
```json
{
    "restaurant_id": 1,
    "payment_method": "cash|card|momo|zalopay",
    "items": [
        {
            "menu_item_id": 1,
            "quantity": 2,
            "note": "Extra spicy"
        }
    ]
}
```

#### List Orders
```
GET /api/orders/
Authorization: Bearer <token>
```

#### Get Order Details
```
GET /api/orders/{id}/
Authorization: Bearer <token>
```

#### Update Order Status
```
PATCH /api/orders/{id}/status/
Authorization: Bearer <token>
```
Body:
```json
{
    "status": "confirmed|preparing|ready|delivering|completed|cancelled"
}
```

#### Order History
```
GET /api/orders/history/
Authorization: Bearer <token>
```

#### Restaurant Orders (Restaurant Owner)
```
GET /api/orders/restaurant/{restaurant_id}/
Authorization: Bearer <token>
```

### ⭐ Reviews

#### List Reviews
```
GET /api/reviews/
```
Query parameters:
- `restaurant_id`: Filter by restaurant
- `menu_item_id`: Filter by menu item

#### Create Review
```
POST /api/reviews/create/
Authorization: Bearer <token>
```
Body:
```json
{
    "restaurant_id": 1,  // or menu_item_id
    "rating": 5,
    "comment": "Excellent food!"
}
```

#### Restaurant Reviews
```
GET /api/reviews/restaurant/{restaurant_id}/
```

#### Menu Item Reviews
```
GET /api/reviews/menu-item/{menu_item_id}/
```

#### User Reviews
```
GET /api/reviews/user/
Authorization: Bearer <token>
```

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 3. Create Sample Data
```bash
python setup_data.py
```

### 4. Run Server
```bash
python manage.py runserver
```

### 5. Test APIs
The server will be running at `http://localhost:8000`

Test with sample accounts:
- **Admin**: admin@foodapp.com / admin123
- **Restaurant Owner**: owner@restaurant.com / owner123  
- **Customer**: customer@email.com / customer123

## 📱 Sample API Calls

### Login
```bash
curl -X POST http://localhost:8000/api/users/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "customer@email.com", "password": "customer123"}'
```

### Get Restaurants
```bash
curl http://localhost:8000/api/restaurants/
```

### Create Order
```bash
curl -X POST http://localhost:8000/api/orders/create/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "restaurant_id": 1,
    "payment_method": "cash",
    "items": [{"menu_item_id": 1, "quantity": 2}]
  }'
```

## 🔧 Development Notes

- Use JWT tokens for authentication
- All protected endpoints require `Authorization: Bearer <token>` header
- Users can have roles: `customer`, `restaurant_owner`, `admin`
- Restaurant owners can only manage their own restaurants
- Customers can create orders and reviews
- Admin can access all data

## 📊 Database Schema

The system includes the following main models:
- **User**: Authentication and user management
- **Restaurant**: Restaurant information
- **Menu & MenuItem**: Restaurant menus and dishes
- **Order & OrderItem**: Order management
- **Review**: Customer reviews
- **Payment & Delivery**: Payment and delivery tracking
- **Statistics**: Restaurant and menu item statistics
