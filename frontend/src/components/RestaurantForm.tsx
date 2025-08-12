import { useEffect, useMemo, useState } from "react";
import stylesCreate from "@/styles/CreateAndUpdateRestaurant.module.css";
import stylesUpdate from "@/styles/RegisterRestaurants.module.css";
import { RestaurantCreate } from "@/types/restaurant";
import { CATEGORY_OPTIONS, CITY_OPTIONS } from "@/constants/restaurant";

export type RestaurantFormProps = {
  initialValues?: Partial<RestaurantCreate>;
  initialPreviewImages?: string[];
  onSubmit: (values: RestaurantCreate) => Promise<void> | void;
  submitLabel: string;
  submitting?: boolean;
  variant?: "create" | "update"; // to reuse existing style wrappers
};

export default function RestaurantForm({
  initialValues,
  initialPreviewImages,
  onSubmit,
  submitLabel,
  submitting = false,
  variant = "create",
}: RestaurantFormProps) {
  const styles: any = variant === "create" ? stylesCreate : stylesUpdate;

  const defaultValues: RestaurantCreate = useMemo(
    () => ({
      name: "",
      address: "",
      phone: "",
      email: "",
      description: "",
      categories: [],
      images: [],
      city: CITY_OPTIONS[0],
      ...initialValues,
    }),
    [initialValues]
  );

  const [form, setForm] = useState<RestaurantCreate>(defaultValues);
  const [previewImages, setPreviewImages] = useState<string[]>(initialPreviewImages ?? []);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    setForm((prev) => ({ ...prev, ...defaultValues }));
  }, [defaultValues]);

  useEffect(() => {
    setPreviewImages(initialPreviewImages ?? []);
  }, [initialPreviewImages]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setForm({ ...form, categories: selected });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, city: e.target.value });
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
    setMessage("");
    try {
      await onSubmit(form);
      setMessage("Thao tác thành công!");
    } catch (err) {
      setMessage("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form ?? undefined} style={!styles.form ? { maxWidth: 500 } : undefined}>
      <div className={styles.formGroup ?? undefined} style={!styles.formGroup ? { marginBottom: 16 } : undefined}>
        <label>Tên nhà hàng *</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className={styles.input}
          style={!styles.form ? { width: "100%" } : undefined}
        />
      </div>

      <div className={styles.formGroup ?? undefined} style={!styles.formGroup ? { marginBottom: 16 } : undefined}>
        <label>Địa chỉ *</label>
        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          required
          className={styles.input}
          style={!styles.form ? { width: "100%" } : undefined}
        />
      </div>

      <div className={styles.formGroup ?? undefined} style={!styles.formGroup ? { marginBottom: 16 } : undefined}>
        <label>Thành phố *</label>
        <select
          name="city"
          value={form.city}
          onChange={handleCityChange}
          required
          className={styles.input}
          style={!styles.form ? { width: "100%" } : undefined}
        >
          {CITY_OPTIONS.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup ?? undefined} style={!styles.formGroup ? { marginBottom: 16 } : undefined}>
        <label>Số điện thoại *</label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
          className={styles.input}
          style={!styles.form ? { width: "100%" } : undefined}
        />
      </div>

      <div className={styles.formGroup ?? undefined} style={!styles.formGroup ? { marginBottom: 16 } : undefined}>
        <label>Email *</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          className={styles.input}
          style={!styles.form ? { width: "100%" } : undefined}
        />
      </div>

      <div className={styles.formGroup ?? undefined} style={!styles.formGroup ? { marginBottom: 16 } : undefined}>
        <label>Mô tả</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          className={styles.input}
          style={!styles.form ? { width: "100%" } : undefined}
        />
      </div>

      <div className={styles.formGroup ?? undefined} style={!styles.formGroup ? { marginBottom: 16 } : undefined}>
        <label>Danh mục (giữ Ctrl để chọn nhiều)</label>
        <select
          name="categories"
          multiple
          value={form.categories}
          onChange={handleCategoryChange}
          className={styles.input}
          style={!styles.form ? { width: "100%", height: 90 } : { height: 90 }}
        >
          {CATEGORY_OPTIONS.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup ?? undefined} style={!styles.formGroup ? { marginBottom: 16 } : undefined}>
        <label>Ảnh nhà hàng</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className={styles.input}
        />
        <div className={styles.previewImages ?? undefined} style={!styles.previewImages ? { display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" } : undefined}>
          {previewImages.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`preview-${idx}`}
              className={styles.previewImg ?? undefined}
              style={!styles.previewImg ? { width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid #eee" } : undefined}
            />
          ))}
        </div>
      </div>

      <button type="submit" className={styles.registerBtn} disabled={submitting} style={!styles.registerBtn ? { marginTop: 16 } : undefined}>
        {submitting ? "Đang xử lý..." : submitLabel}
      </button>

      {message && (
        <div
          className={message.includes("thành công") ? styles.successMsg : styles.errorMsg}
          style={!styles.successMsg ? { marginTop: 16, color: message.includes("thành công") ? "#15803d" : "#b91c1c" } : undefined}
        >
          {message}
        </div>
      )}
    </form>
  );
} 