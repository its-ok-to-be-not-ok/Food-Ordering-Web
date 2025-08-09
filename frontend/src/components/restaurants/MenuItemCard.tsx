import { useState } from "react";
import styles from '@/components/restaurants/MenuItemCard.module.css';
export default function MenuItem({ item }: { item: any }) {
    const [quantity, setQuantity] = useState(1);

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        if (val >= 1) setQuantity(val);
    };

    const handleOrder = () => {
        if (item.status !== "available") {
            alert("Món này hiện không còn hàng!");
            return;
        }
        alert(`Đã thêm ${quantity} "${item.name}" vào giỏ hàng!`);
        // TODO: dispatch hoặc gọi API thêm vào giỏ hàng
    };

    return (
        <div className={styles.menuItemCard}>
            <img
                src={item.image || "/default-food.jpg"}
                alt={item.name}
                className={styles.menuItemImage}
            />
            <div>
                <h2 className={styles.menuItemName}>{item.name}</h2>
                <p className={styles.menuItemDesc}>{item.description}</p>
                <p className={styles.menuItemPrice}>
                    Giá: <span>{item.price?.toLocaleString()}₫</span>
                    {item.discount && item.discount > 0 && (
                        <span className={styles.menuItemDiscount}>-{item.discount.toLocaleString()}₫</span>
                    )}
                </p>
                <p className={styles.menuItemStatus}>
                    Trạng thái:{" "}
                    {item.status === "available"
                        ? "Còn hàng"
                        : item.status === "out_of_stock"
                            ? "Hết hàng"
                            : "Ngừng bán"}
                </p>
                <p className={styles.menuItemStatus} style={{ fontStyle: "italic" }}>
                    Nhà hàng: {item.restaurantName} | Menu: {item.menuName}
                </p>

                <div className={styles.orderRow}>
                    <input
                        type="number"
                        min={1}
                        value={quantity}
                        onChange={handleQuantityChange}
                        disabled={item.status !== "available"}
                        className={styles.quantityInput}
                    />
                    <button
                        onClick={handleOrder}
                        disabled={item.status !== "available"}
                        className={styles.orderBtn}
                    >
                        Đặt món
                    </button>
                </div>
            </div>
        </div>

    );
}
