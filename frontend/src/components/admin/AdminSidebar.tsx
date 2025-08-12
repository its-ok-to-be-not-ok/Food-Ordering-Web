import styles from "@/styles/AdminSidebar.module.css";

const MENU_ITEMS = [
  { key: "accounts", label: "Quản lý Quản Trị Viên" },
  { key: "restaurants", label: "Quản lý Chủ quán & Nhà hàng" },
  { key: "registers", label: "Quản lý đơn mở bán" },
  { key: "reports", label: "Báo cáo sai phạm" },
];

export default function AdminSidebar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>Admin Dashboard</h2>
      <nav>
        <ul className={styles.menu}>
          {MENU_ITEMS.map(item => (
            <li
              key={item.key}
              className={activeTab === item.key ? styles.active : ""}
              onClick={() => setActiveTab(item.key)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}