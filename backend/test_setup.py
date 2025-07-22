import os
import django
from decimal import Decimal
from datetime import datetime, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from restaurants.models import Restaurant, Menu, MenuItem
from orders.models import Order, OrderItem, Payment, Delivery
from reviews.models import Review

User = get_user_model()

def create_test_data():
    print("🚀 Bắt đầu tạo dữ liệu test...")

    # 1. Tạo Users
    print("👤 Tạo users...")

    admin = User.objects.create_user(
        username='admin',
        email='admin@foodapp.com',
        password='admin123',
        role='admin',
        is_staff=True,
        is_superuser=True
    )

    owner1 = User.objects.create_user(
        username='pizza_owner',
        email='owner1@restaurant.com', 
        password='owner123',
        role='restaurant_owner',
        phone='0123456789',
        address='123 Nguyễn Trãi, Q1, HCM'
    )

    owner2 = User.objects.create_user(
        username='pho_owner',
        email='owner2@restaurant.com',
        password='owner123', 
        role='restaurant_owner',
        phone='0987654321',
        address='456 Lê Lợi, Q1, HCM'
    )

    customer1 = User.objects.create_user(
        username='customer1',
        email='customer1@test.com',
        password='customer123',
        role='customer',
        phone='0111222333',
        address='789 Hai Bà Trưng, Q3, HCM'
    )

    customer2 = User.objects.create_user(
        username='customer2', 
        email='customer2@test.com',
        password='customer123',
        role='customer',
        phone='0444555666',
        address='321 Cách Mạng Tháng 8, Q10, HCM'
    )

    print("✅ Đã tạo 5 users")

    # 2. Tạo Restaurants
    print("🏪 Tạo restaurants...")

    pizza_restaurant = Restaurant.objects.create(
        owner=owner1,
        name='Pizza Heaven',
        address='123 Nguyễn Trãi, Q1, HCM',
        phone='028-1234-5678',
        email='pizzaheaven@restaurant.com',
        description='Nhà hàng pizza authentic Ý với hương vị tuyệt vời',
        status='active',
        rating=4.5
    )

    pho_restaurant = Restaurant.objects.create(
        owner=owner2,
        name='Phở Hà Nội',
        address='456 Lê Lợi, Q1, HCM', 
        phone='028-8765-4321',
        email='phohanoi@restaurant.com',
        description='Phở truyền thống Hà Nội, nước dùng đậm đà',
        status='active',
        rating=4.7
    )

    print("✅ Đã tạo 2 restaurants")

    # 3. Tạo Menus
    print("📋 Tạo menus...")

    pizza_menu = Menu.objects.create(
        restaurant=pizza_restaurant,
        title='Menu Pizza & Pasta',
        description='Thực đơn pizza và pasta đặc biệt'
    )

    pho_menu = Menu.objects.create(
        restaurant=pho_restaurant,
        title='Menu Phở & Bún',
        description='Thực đơn phở và bún truyền thống'
    )

    print("✅ Đã tạo 2 menus")

    # 4. Tạo Menu Items
    print("🍕 Tạo menu items...")

    # Pizza items
    pizza_items = [
        {
            'name': 'Pizza Margherita',
            'description': 'Pizza truyền thống với cà chua, mozzarella và húng quế',
            'price': Decimal('180000'),
            'category': 'Pizza',
            'discount': Decimal('20000')
        },
        {
            'name': 'Pizza Pepperoni', 
            'description': 'Pizza với xúc xích pepperoni và phô mai mozzarella',
            'price': Decimal('220000'),
            'category': 'Pizza',
            'discount': Decimal('0')
        },
        {
            'name': 'Pasta Carbonara',
            'description': 'Mì ống sốt kem với bacon và phô mai parmesan',
            'price': Decimal('150000'),
            'category': 'Pasta',
            'discount': Decimal('15000')
        },
        {
            'name': 'Coca Cola',
            'description': 'Nước ngọt Coca Cola 330ml',
            'price': Decimal('25000'),
            'category': 'Đồ uống',
            'discount': Decimal('0')
        }
    ]

    for item_data in pizza_items:
        MenuItem.objects.create(
            menu=pizza_menu,
            **item_data
        )

    # Pho items
    pho_items = [
        {
            'name': 'Phở Bò Tái',
            'description': 'Phở bò với thịt tái, nước dùng trong',
            'price': Decimal('70000'),
            'category': 'Phở',
            'discount': Decimal('0')
        },
        {
            'name': 'Phở Bò Chín',
            'description': 'Phở bò với thịt chín, nước dùng đậm đà',
            'price': Decimal('75000'),
            'category': 'Phở', 
            'discount': Decimal('5000')
        },
        {
            'name': 'Bún Bò Huế',
            'description': 'Bún bò Huế cay nồng đậm đà hương vị xứ Huế',
            'price': Decimal('80000'),
            'category': 'Bún',
            'discount': Decimal('0')
        },
        {
            'name': 'Trà Đá',
            'description': 'Trà đá mát lạnh',
            'price': Decimal('10000'),
            'category': 'Đồ uống',
            'discount': Decimal('0')
        }
    ]

    for item_data in pho_items:
        MenuItem.objects.create(
            menu=pho_menu,
            **item_data
        )

    print("✅ Đã tạo 8 menu items")

    # 5. Tạo Orders
    print("📝 Tạo orders...")

    # Order 1: Customer1 đặt pizza
    pizza_margherita = MenuItem.objects.get(name='Pizza Margherita')
    coca_cola = MenuItem.objects.get(name='Coca Cola')

    # Tạo Payment và Delivery trước
    payment1 = Payment.objects.create(
        payment_method='momo',
        amount=Decimal('185000'),
        status='completed',
        transaction_code='MOMO_001_20250721'
    )
    delivery1 = Delivery.objects.create(
        shipper_info='Nguyễn Văn A - 0909123456',
        delivery_status='delivered',
        estimated_time=datetime.now() + timedelta(minutes=30)
    )

    order1 = Order.objects.create(
        user=customer1,
        restaurant=pizza_restaurant,
        total_amount=Decimal('185000'),
        status='completed',
        payment=payment1,
        delivery=delivery1
    )

    OrderItem.objects.create(
        order=order1,
        menu_item=pizza_margherita,
        quantity=1,
        price=Decimal('160000'),  # 180000 - 20000 discount
        note='Ít cay'
    )

    OrderItem.objects.create(
        order=order1,
        menu_item=coca_cola,
        quantity=1,
        price=Decimal('25000')
    )

    # Order 2: Customer2 đặt phở
    pho_bo_tai = MenuItem.objects.get(name='Phở Bò Tái')
    tra_da = MenuItem.objects.get(name='Trà Đá')

    payment2 = Payment.objects.create(
        payment_method='cash',
        amount=Decimal('80000'),
        status='pending',
        transaction_code='CASH_002_20250721'
    )

    order2 = Order.objects.create(
        user=customer2,
        restaurant=pho_restaurant,
        total_amount=Decimal('80000'),
        status='preparing',
        payment=payment2
        # delivery=None (chưa giao)
    )

    OrderItem.objects.create(
        order=order2,
        menu_item=pho_bo_tai,
        quantity=1,
        price=Decimal('70000')
    )

    OrderItem.objects.create(
        order=order2,
        menu_item=tra_da,
        quantity=1,
        price=Decimal('10000')
    )

    print("✅ Đã tạo 2 orders")

    # 6. Tạo Reviews
    print("⭐ Tạo reviews...")

    Review.objects.create(
        user=customer1,
        restaurant=pizza_restaurant,
        rating=5,
        comment='Pizza rất ngon, giao hàng nhanh!'
    )

    Review.objects.create(
        user=customer1,
        menu_item=pizza_margherita,
        rating=5,
        comment='Pizza Margherita tuyệt vời, sẽ order lại!'
    )

    Review.objects.create(
        user=customer2,
        restaurant=pho_restaurant,
        rating=4,
        comment='Phở ngon, nước dùng đậm đà'
    )

    print("✅ Đã tạo 3 reviews")

    print("\n🎉 HOÀN THÀNH TẠO DỮ LIỆU TEST!")
    print("\n📊 THỐNG KÊ:")
    print(f"👤 Users: {User.objects.count()}")
    print(f"🏪 Restaurants: {Restaurant.objects.count()}")
    print(f"📋 Menus: {Menu.objects.count()}")
    print(f"🍕 Menu Items: {MenuItem.objects.count()}")
    print(f"📝 Orders: {Order.objects.count()}")
    print(f"⭐ Reviews: {Review.objects.count()}")

    print("\n🔑 THÔNG TIN ĐĂNG NHẬP:")
    print("Admin: admin@foodapp.com / admin123")
    print("Owner 1: owner1@restaurant.com / owner123")
    print("Owner 2: owner2@restaurant.com / owner123") 
    print("Customer 1: customer1@test.com / customer123")
    print("Customer 2: customer2@test.com / customer123")

if __name__ == '__main__':
    create_test_data()