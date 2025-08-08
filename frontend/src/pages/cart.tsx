import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import styles from "@/styles/Cart.module.css";
import Header from "@/components/layout/Header";
import { removeFromCart, clearCart } from "@/store/slices/cartSlice";

export default function CartPage() {
  const cart = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleClearCart = () => {
    if (window.confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng?")) {
      dispatch(clearCart());
    }
  };

  const totalPrice = cart.items?.reduce(
    (sum: number, cartItem: any) =>
      sum + cartItem.item.price * cartItem.quantity,
    0
  );

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h2 className={styles.title}>Giỏ hàng của bạn</h2>
        {(!cart.items || cart.items.length === 0) ? (
          <div className={styles.empty}>Giỏ hàng đang trống.</div>
        ) : (
          <>
            <table className={styles.cartTable}>
              <thead>
                <tr>
                  <th>Món ăn</th>
                  <th>Giá</th>
                  <th>Số lượng</th>
                  <th>Tổng</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cart.items.map((cartItem: any) => (
                  <tr key={cartItem.item.id}>
                    <td>
                      <div className={styles.itemInfo}>
                        <img
                          src={cartItem.item.image || "/default-food.jpg"}
                          alt={cartItem.item.name}
                          className={styles.itemImage}
                        />
                        <span>{cartItem.item.name}</span>
                      </div>
                    </td>
                    <td>{cartItem.item.price.toLocaleString()}₫</td>
                    <td>{cartItem.quantity}</td>
                    <td>
                      {(cartItem.item.price * cartItem.quantity).toLocaleString()}₫
                    </td>
                    <td>
                      <button
                        className={styles.removeBtn}
                        onClick={() => handleRemove(cartItem.item.id)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={styles.summary}>
              <span>Tổng cộng: </span>
              <b>{totalPrice.toLocaleString()}₫</b>
              <button className={styles.clearBtn} onClick={handleClearCart}>
                Xóa toàn bộ
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}