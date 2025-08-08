'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';

const OrderDetailPage = () => {
  const [order, setOrder] = useState<any>(null);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (!id) return;
    const token = localStorage.getItem("accessToken");

    axios.get(`http://localhost:8000/api/orders/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((res) => setOrder(res.data))
    .catch((err) => console.error("Lỗi tải chi tiết đơn:", err));
  }, [id]);

  if (!id) return <div>Không tìm thấy đơn hàng</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Chi tiết đơn hàng #{id}</h1>
      {order ? (
        <div className="space-y-2">
          <p><strong>Nhà hàng:</strong> {order.restaurant_name}</p>
          <p><strong>Trạng thái:</strong> {order.status}</p>
          <p><strong>Phương thức thanh toán:</strong> {order.payment_method}</p>
          <p><strong>Ngày đặt:</strong> {new Date(order.created_at).toLocaleString()}</p>
          <h2 className="mt-4 font-semibold">Danh sách món:</h2>
          <ul className="list-disc list-inside">
            {order.items.map((item: any, idx: number) => (
              <li key={idx}>
                {item.name} x {item.quantity} ({item.note})
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Đang tải...</p>
      )}
    </div>
  );
};

export default OrderDetailPage;
