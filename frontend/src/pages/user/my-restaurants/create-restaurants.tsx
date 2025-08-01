import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import styles from "@/styles/RegisterRestaurants.module.css";
import { RestaurantCreate } from "@/types/restaurant";
import { createRestaurant } from "@/services/service";

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

export default function CreateRestaurantPage() {
  const accessToken = useSelector((state: RootState) => state.auth.access);
  const [form, setForm] = useState<RestaurantCreate>({
    name: "",
    address: "",
    phone: "",
    email: "",
    description: "",
    categories: [],
    images: [],
  });
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setForm({ ...form, categories: selected });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setForm({ ...form, images: files });
      setPreviewImages(files.map((file) => URL.createObjectURL(file)));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      if (!accessToken) {
        setMessage("Bạn cần đăng nhập để tạo nhà hàng.");
        setSubmitting(false);
        return;
      }
      await createRestaurant(accessToken, form);
      setMessage("Tạo nhà hàng thành công!");
    } catch {
      setMessage("Có lỗi xảy ra, vui lòng thử lại.");
    }
    setSubmitting(false);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Tạo nhà hàng và đăng ký</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
        <div style={{ marginBottom: 16 }}>
          <label>Tên nhà hàng *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className={styles.input}
            style={{ width: "100%" }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Địa chỉ *</label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            required
            className={styles.input}
            style={{ width: "100%" }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Số điện thoại *</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            className={styles.input}
            style={{ width: "100%" }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Email *</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className={styles.input}
            style={{ width: "100%" }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Mô tả</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className={styles.input}
            style={{ width: "100%" }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Danh mục (giữ Ctrl để chọn nhiều)</label>
          <select
            name="categories"
            multiple
            value={form.categories}
            onChange={handleCategoryChange}
            className={styles.input}
            style={{ width: "100%", height: 90 }}
          >
            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Ảnh nhà hàng</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className={styles.input}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
            {previewImages.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`preview-${idx}`}
                style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid #eee" }}
              />
            ))}
          </div>
        </div>
        <button
          type="submit"
          className={styles.registerBtn}
          disabled={submitting}
          style={{ marginTop: 16 }}
        >
          {submitting ? "Đang gửi..." : "Tạo nhà hàng và đăng ký"}
        </button>
        {message && (
          <div style={{ marginTop: 16, color: message.includes("thành công") ? "#15803d" : "#b91c1c" }}>
            {message}
          </div>
        )}
      </form>
    </div>
    );
}