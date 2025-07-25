// pages/home.tsx

import { useEffect, useState } from 'react';
import { getPopularRestaurants, getOrderHistory, getUserProfile } from '@/services/service';
import RestaurantCard from '@/components/restaurants/RestaurantCart';
import '@/styles/HomePages.module.css';
import { Order } from '@/types/order';
import { Restaurant } from '@/types/restaurant';
import Link from 'next/link';

interface UserProfile {
  name: string;
}

export default function HomePage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<UserProfile>({ name: '' });

  useEffect(() => {
    async function fetchData() {
      try {
        const [resRes, orderRes, profileRes] = await Promise.all([
          getPopularRestaurants(),
          getOrderHistory(),
          getUserProfile()
        ]);

        setRestaurants(resRes.data);
        setOrders(orderRes.data);
        setProfile(profileRes.data);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <h1 className="homepage-title">Xin chào, {profile.name}</h1>
        <Link href="/user/profile" className="profile-link">Hồ sơ cá nhân</Link>
      </header>

      <section className="search-section">
        <input
          type="text"
          placeholder="Tìm kiếm nhà hàng hoặc món ăn..."
          className="search-input"
        />
      </section>

      <section className="featured-section">
        <h2 className="section-title">Nhà hàng nổi bật</h2>
        {restaurants.length === 0 ? (
          <p>Không có nhà hàng nào hiển thị.</p>
        ) : (
          <div className="restaurant-list">
            {restaurants.map((res) => (
              <RestaurantCard key={res.id} restaurant={res} />
            ))}
          </div>
        )}
      </section>

      <section className="order-history-section">
        <h2 className="section-title">Đơn hàng gần đây</h2>
        {orders.length === 0 ? (
          <p>Bạn chưa có đơn hàng nào.</p>
        ) : (
          <ul className="order-list">
            {orders.slice(0, 3).map((order) => (
              <li key={order.id} className="order-item">
                Ngày: {new Date(order.createdAt).toLocaleDateString('vi-VN')} — Trạng thái: <b>{order.status}</b>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
