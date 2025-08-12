import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import styles from "@/styles/Menu.module.css";
import {
  getRestaurantMenus,
  createMenu,
  updateMenu,
  deleteMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "@/services/restaurantService";
import { Menu } from "@/types/menu";

// Thêm category, status, discount vào form state
type MenuFormState = { id?: number; title: string; description?: string };
type MenuItemFormState = {
  id?: number;
  name: string;
  price: number;
  description?: string;
  category: string;
  status?: string;
  discount?: number;
};

const CATEGORY_OPTIONS = [
  { value: "com", label: "Cơm" },
  { value: "lau", label: "Lẩu" },
  { value: "bun", label: "Bún" },
  { value: "pho", label: "Phở" },
  { value: "mi", label: "Mì" },
  { value: "chien_ran", label: "Chiên rán" },
  { value: "nuong", label: "Nướng" },
  { value: "hai_san", label: "Hải sản" },
  { value: "an_vat", label: "Ăn vặt" },
  { value: "do_uong", label: "Đồ uống" },
  { value: "chay", label: "Chay" },
  { value: "han_quoc", label: "Hàn Quốc" },
  { value: "nhat_ban", label: "Nhật Bản" },
  { value: "tay", label: "Món Tây" },
  { value: "khac", label: "Khác" },
];

const STATUS_OPTIONS = [
  { value: "available", label: "Còn hàng" },
  { value: "out_of_stock", label: "Hết hàng" },
  { value: "discontinued", label: "Ngừng bán" },
];

export default function RestaurantMenuPage() {
  const router = useRouter();
  const { id } = router.query;
  const accessToken = useSelector((state: RootState) => state.auth.access) || "";
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [menuForm, setMenuForm] = useState<MenuFormState>({ title: "" });
  const [editingMenuId, setEditingMenuId] = useState<number | null>(null);

  const [showMenuItemModal, setShowMenuItemModal] = useState(false);
  const [menuItemForm, setMenuItemForm] = useState<MenuItemFormState>({
    name: "",
    price: 0,
    description: "",
    category: "",
    status: "available",
    discount: 0,
  });
  const [editingMenuItemId, setEditingMenuItemId] = useState<number | null>(null);
  const [currentMenuId, setCurrentMenuId] = useState<number | null>(null);

  const [confirmDelete, setConfirmDelete] = useState<{ type: "menu" | "item"; id: number } | null>(null);

  useEffect(() => {
    if (!id || typeof id !== "string") return;
    setLoading(true);
    getRestaurantMenus(id, accessToken)
      .then((res) => setMenus(res.data))
      .catch(() => setMenus([]))
      .finally(() => setLoading(false));
  }, [id, accessToken]);

  // Menu handlers
  const openMenuModal = (menu?: Menu) => {
    setEditingMenuId(menu?.id ?? null);
    setMenuForm({ title: menu?.title || "", description: menu?.description || "" });
    setShowMenuModal(true);
  };
  const closeMenuModal = () => {
    setShowMenuModal(false);
    setMenuForm({ title: "", description: "" });
    setEditingMenuId(null);
  };
  const submitMenu = async () => {
    try {
      if (editingMenuId) {
        await updateMenu(editingMenuId.toString(), menuForm, accessToken);
      } else {
        await createMenu(id as string, menuForm, accessToken);
      }
      getRestaurantMenus(id as string, accessToken).then((res) => setMenus(res.data));
      closeMenuModal();
    } catch {
      alert("Lưu menu thất bại!");
    }
  };

  // MenuItem handlers
  const openMenuItemModal = (menuId: number, item?: any) => {
    setCurrentMenuId(menuId);
    setEditingMenuItemId(item?.id ?? null);
    setMenuItemForm({
      name: item?.name || "",
      price: item?.price || 0,
      description: item?.description || "",
      category: item?.category || "",
      status: item?.status || "available",
      discount: item?.discount || 0,
    });
    setShowMenuItemModal(true);
  };
  const closeMenuItemModal = () => {
    setShowMenuItemModal(false);
    setMenuItemForm({
      name: "",
      price: 0,
      description: "",
      category: "",
      status: "available",
      discount: 0,
    });
    setEditingMenuItemId(null);
    setCurrentMenuId(null);
  };
  const submitMenuItem = async () => {
    try {
      if (!currentMenuId) return;
      if (editingMenuItemId) {
        await updateMenuItem(editingMenuItemId.toString(), menuItemForm, accessToken);
      } else {
        await createMenuItem(currentMenuId.toString(), menuItemForm, accessToken);
      }
      getRestaurantMenus(id as string, accessToken).then((res) => setMenus(res.data));
      closeMenuItemModal();
    } catch {
      alert("Lưu món ăn thất bại!");
    }
  };

  // Delete handlers
  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      if (confirmDelete.type === "menu") {
        await deleteMenu(confirmDelete.id.toString(), accessToken);
      } else {
        await deleteMenuItem(confirmDelete.id.toString(), accessToken);
      }
      getRestaurantMenus(id as string, accessToken).then((res) => setMenus(res.data));
    } catch {
      alert("Xoá thất bại!");
    }
    setConfirmDelete(null);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Thực đơn nhà hàng</h1>
      <button className={styles.registerBtn} style={{ marginBottom: 24 }} onClick={() => openMenuModal()}>
        + Tạo menu mới
      </button>
      {loading ? (
        <p>Đang tải thực đơn...</p>
      ) : menus.length === 0 ? (
        <div className={styles.emptyBox}>
          <p>Chưa có thực đơn nào cho nhà hàng này.</p>
        </div>
      ) : (
        <div>
          {menus.map((menu) => (
            <div key={menu.id} className={styles.menuCard}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <h2 className={styles.menuTitle}>{menu.title}</h2>
                  <div className={styles.menuDesc}>{menu.description}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className={styles.detailBtn} onClick={() => openMenuModal(menu)}>
                    Sửa
                  </button>
                  <button className={styles.withdrawBtn} onClick={() => setConfirmDelete({ type: "menu", id: menu.id })}>
                    Xoá
                  </button>
                </div>
              </div>
              <button
                className={styles.registerBtn}
                style={{ margin: "12px 0" }}
                onClick={() => openMenuItemModal(menu.id)}
              >
                + Thêm món ăn
              </button>
              {menu.items.length === 0 ? (
                <div style={{ color: "#888" }}>Chưa có món ăn nào trong menu này.</div>
              ) : (
                <div className={styles.menuItems}>
                  {menu.items.map((item) => (
                    <div key={item.id} className={styles.menuItemCard}>
                      {item.image && (
                        <img src={item.image} alt={item.name} className={styles.menuItemImage} />
                      )}
                      <div className={styles.menuItemName}>{item.name}</div>
                      <div className={styles.menuItemDesc}>{item.description}</div>
                      <div className={styles.menuItemPrice}>
                        {item.price.toLocaleString()} đ
                        {item.discount ? (
                          <span className={styles.menuItemDiscount}>
                            -{item.discount}%
                          </span>
                        ) : null}
                      </div>
                      <div className={styles.menuItemStatus}>
                        {item.status === "available" ? "Còn bán" : "Hết hàng"}
                      </div>
                      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                        <button className={styles.detailBtn} onClick={() => openMenuItemModal(menu.id, item)}>
                          Sửa
                        </button>
                        <button className={styles.withdrawBtn} onClick={() => setConfirmDelete({ type: "item", id: item.id })}>
                          Xoá
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal menu */}
      {showMenuModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>{editingMenuId ? "Sửa menu" : "Tạo menu mới"}</h2>
            <div className={styles.modalFields}>
              <input
                className={styles.input}
                placeholder="Tên menu"
                value={menuForm.title}
                onChange={e => setMenuForm(f => ({ ...f, title: e.target.value }))}
              />
              <textarea
                className={styles.input}
                placeholder="Mô tả"
                value={menuForm.description}
                onChange={e => setMenuForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className={styles.modalActions}>
              <button className={styles.withdrawBtn} onClick={closeMenuModal}>Huỷ</button>
              <button className={styles.registerBtn} onClick={submitMenu}>
                {editingMenuId ? "Lưu" : "Tạo"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal menu item */}
      {showMenuItemModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>{editingMenuItemId ? "Sửa món ăn" : "Thêm món ăn"}</h2>
            <div className={styles.modalFields}>
              <input
                className={styles.input}
                placeholder="Tên món ăn"
                value={menuItemForm.name}
                onChange={e => setMenuItemForm(f => ({ ...f, name: e.target.value }))}
              />
              <input
                className={styles.input}
                placeholder="Giá"
                type="number"
                value={menuItemForm.price}
                onChange={e => setMenuItemForm(f => ({ ...f, price: Number(e.target.value) }))}
              />
              <select
                className={styles.input}
                value={menuItemForm.category}
                onChange={e => setMenuItemForm(f => ({ ...f, category: e.target.value }))}
                required
              >
                <option value="">Chọn loại món</option>
                {CATEGORY_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <select
                className={styles.input}
                value={menuItemForm.status}
                onChange={e => setMenuItemForm(f => ({ ...f, status: e.target.value }))}
              >
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <input
                className={styles.input}
                placeholder="Giảm giá (%)"
                type="number"
                value={menuItemForm.discount}
                min={0}
                max={100}
                onChange={e => setMenuItemForm(f => ({ ...f, discount: Number(e.target.value) }))}
              />
              <textarea
                className={styles.input}
                placeholder="Mô tả"
                value={menuItemForm.description}
                onChange={e => setMenuItemForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className={styles.modalActions}>
              <button className={styles.withdrawBtn} onClick={closeMenuItemModal}>Huỷ</button>
              <button className={styles.registerBtn} onClick={submitMenuItem}>
                {editingMenuItemId ? "Lưu" : "Tạo"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal xác nhận xoá */}
      {confirmDelete && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <p>Bạn có chắc muốn xoá {confirmDelete.type === "menu" ? "menu" : "món ăn"} này?</p>
            <div className={styles.modalActions}>
              <button className={styles.input} onClick={() => setConfirmDelete(null)}>Huỷ</button>
              <button className={styles.withdrawBtn} onClick={handleDelete}>Xoá</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}