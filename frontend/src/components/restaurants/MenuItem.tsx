export default function MenuItem({ item }: { item: any }) {
  return (
    <div className="border p-3 rounded shadow">
      <h2 className="font-semibold">{item.name}</h2>
      <p className="text-sm text-gray-500">Giá: {item.price}₫</p>
      <p className="text-sm">Nhà hàng: {item.restaurantName}</p>
      <p className="text-sm italic">Menu: {item.menuName}</p>
    </div>
  );
}
