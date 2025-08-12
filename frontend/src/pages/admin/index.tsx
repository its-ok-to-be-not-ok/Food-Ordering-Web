import { useState } from "react";
import styles from "@/styles/AdminDashboard.module.css";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminAccountsSection from "@/components/admin/AdminAccountsSection";
import RestaurantsSection from "@/components/admin/RestaurantsAndUsersSection";
import RegistersSection from "@/components/admin/RegistersSection";
import ReportsSection from "@/components/admin/ReportsSection";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { logout } from "@/store/slices/authSlice";

const PERMISSION_OPTIONS = [
  { value: "full", label: "Full" },
  { value: "registrations", label: "Manage Registrations" },
  { value: "restaurants", label: "Manage Restaurants" },
];

export default function AdminDashboard() {
  const accessToken = useSelector((state: RootState) => state.auth.access);
  const permissions = useSelector((state: RootState) => state.auth.permissions);
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("accounts");

  const isFull = permissions === "Full";
  const isRestaurants = permissions === "Manage Restaurants";
  const isRegistrations = permissions === "Manage Registrations";

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/login";
  };

  return (
    <div className={styles.container} style={{ display: "flex", gap: 32 }}>
      <div style={{ position: "absolute", top: 24, left: 32, zIndex: 10 }}>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 20px",
            background: "#ef4444",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
            boxShadow: "0 2px 8px #fca5a5",
            transition: "background 0.2s",
          }}
        >
          Đăng xuất
        </button>
      </div>
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className={styles.section} style={{ flex: 1 }}>
        {activeTab === "accounts" && (
          <AdminAccountsSection
            accessToken={accessToken}
            permissions={permissions ?? ""}
            PERMISSION_OPTIONS={PERMISSION_OPTIONS}
            isFull={isFull}
            isRegistrations={isRegistrations}
          />
        )}
        {activeTab === "restaurants" && (
          <RestaurantsSection
            accessToken={accessToken}
            isFull={isFull}
            isRestaurants={isRestaurants}
          />
        )}
        {activeTab === "registers" && (
          <RegistersSection
            accessToken={accessToken}
            isFull={isFull}
            isRegistrations={isRegistrations}
          />
        )}
        {activeTab === "reports" && (
          <ReportsSection
            accessToken={accessToken}
            isFull={isFull}
            isRestaurants={isRestaurants}
          />
          )}
      </div>
    </div>
  );
}