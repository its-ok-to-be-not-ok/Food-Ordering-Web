import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";

const Cart = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);
  const items = cart.items;

  const handleAdd = () => {
    dispatch(
      addToCart({
        item: {
          id: "item01",
          name: "Pizza",
          description: "Delicious pizza",
          price: 10,
        },
        quantity: 1,
      })
    );
  };

  return (
    <div>
      <h1>Giỏ hàng ({items.length} món)</h1>
      <ul>
        {items.map((orderItem, index) => (
          <li key={index}>
            {orderItem.item.name} x {orderItem.quantity}
          </li>
        ))}
      </ul>
      <button onClick={handleAdd}>Thêm Pizza</button>
    </div>
  );
};

export default Cart;
