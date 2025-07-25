import Header from "../components/layout/Header"; 
import styles from "@/styles/HomePages.module.css"; 

export default function HomePage() {
  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.banner}>
            <h2>
            <span>Thức ăn</span>
            <br></br>
            <span>Thượng hạng</span>
        </h2>
        
        <p>Chuyên cung cấp món ăn đảm bảo dinh dương và phù hợp đến người dùng</p>
        </div>
      </div>
    </>
  );
}
