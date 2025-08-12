// pages/order.tsx
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import styles from "@/styles/Order.module.css";
import Header from "@/components/layout/Header";
import { clearCart } from "@/store/slices/cartSlice";
import { useEffect, useState } from "react";
import { createOrder} from "@/services/orderService";
import { axiosInstance } from "@/utils/axios";
import { useRouter } from "next/router";

export default function OrderPage() {
    const cart = useSelector((state: RootState) => state.cart);
    const dispatch = useDispatch();
    const router = useRouter();

    const [userInfo, setUserInfo] = useState<any>(null);
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const totalPrice = cart.items?.reduce(
        (sum: number, cartItem: any) =>
            sum + cartItem.item.price * cartItem.quantity,
        0
    );

    // Chặn truy cập nếu giỏ hàng rỗng
    useEffect(() => {
        if (!cart.items || cart.items.length === 0) {
            alert("Giỏ hàng đang trống. Vui lòng thêm sản phẩm trước khi đặt hàng.");
            router.push("/cart");
        }
    }, [cart.items]);

    // Lấy thông tin người dùng
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axiosInstance.get("/users/profile/");
                const data = res.data;
                setUserInfo(data);
                setAddress(data.address || "");
                setPhone(data.phone_number || "");
            } catch (error: any) {
                console.error("Lỗi lấy thông tin user:", error);
                if (error.response?.status === 401) {
                    alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
                    router.push("/login");
                }
            }
        };
        fetchUser();
    }, []);

    const handleConfirmOrder = async () => {
        if (isSubmitting) return;

        // Kiểm tra đầu vào
        if (!address.trim()) {
            alert("Vui lòng nhập địa chỉ giao hàng!");
            return;
        }

        if (!phone.trim()) {
            alert("Vui lòng nhập số điện thoại!");
            return;
        }

        const orderData = {
            address: address.trim(),
            phone_number: phone.trim(),
            order_items: cart.items.map((c: any) => ({
                product: c.item.id,
                quantity: c.quantity,
            })),
        };

        try {
            setIsSubmitting(true);
            await createOrder(orderData);
            alert("Đặt hàng thành công!");
            dispatch(clearCart());
            router.push("/");
        } catch (error: any) {
            console.error("Lỗi đặt hàng:", error);
            if (error.response?.status === 401) {
                alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
                router.push("/login");
            } else if (error.response?.status === 400) {
                alert("Dữ liệu đặt hàng không hợp lệ!");
            } else {
                alert("Không thể đặt hàng. Vui lòng thử lại sau!");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Header />
            <div className={styles.container}>
                <h2 className={styles.heading}>Xác nhận đơn hàng</h2>

                {userInfo && (
                    <>
                        <p className={styles.info}><b>Khách hàng:</b> {userInfo.username}</p>
                        <p className={styles.info}><b>Email:</b> {userInfo.email}</p>
                    </>
                )}

                <h4 className={styles.subheading}>Danh sách món:</h4>
                <table className={styles.billTable}>
                    <thead>
                        <tr>
                            <th>Món</th>
                            <th>SL</th>
                            <th>Giá</th>
                            <th>Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.items.map((cartItem: any) => (
                            <tr key={cartItem.item.id}>
                                <td>{cartItem.item.name}</td>
                                <td>{cartItem.quantity}</td>
                                <td>{cartItem.item.price.toLocaleString()}₫</td>
                                <td>{(cartItem.item.price * cartItem.quantity).toLocaleString()}₫</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <label className={styles.label}>Địa chỉ giao hàng:</label>
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={styles.input}
                />

                <label className={styles.label}>Số điện thoại:</label>
                <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={styles.input}
                />

                <p className={styles.total}><b>Tổng tiền:</b> {totalPrice.toLocaleString()}₫</p>

                <div className={styles.orderButtons}>
                    <button
                        onClick={handleConfirmOrder}
                        disabled={isSubmitting}
                        className={`${styles.button} ${styles.confirmButton}`}
                    >
                        {isSubmitting ? "Đang xử lý..." : "Xác nhận"}
                    </button>
                    <button
                        onClick={() => router.push("/cart")}
                        disabled={isSubmitting}
                        className={`${styles.button} ${styles.cancelButton}`}
                    >
                        Hủy
                    </button>
                </div>
            </div>
        </>
    );
}
