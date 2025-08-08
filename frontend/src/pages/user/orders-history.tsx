'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    axios.get("http://localhost:8000/api/orders/history/", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((res) => setOrders(res.data))
    .catch((err) => console.error("Lỗi tải lịch sử đơn hàng:", err));
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Lịch sử đơn hàng</h1>
      {orders.length === 0 ? (
        <p>Bạn chưa có đơn hàng nào.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="border p-4 rounded shadow">
              <p><strong>Nhà hàng:</strong> {order.restaurant_name}</p>
              <p><strong>Ngày đặt:</strong> {new Date(order.created_at).toLocaleString()}</p>
              <p><strong>Trạng thái:</strong> {order.status}</p>
              <a href={`/user/order-detail?id=${order.id}`} className="text-blue-600 hover:underline">Xem chi tiết</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderHistoryPage;
