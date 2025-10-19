import React from "react";
import styles from "./Sidebar.module.css";
import PaginaIncialSvg from "../../img/PaginaIncial.svg";

const Sidebar: React.FC = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoSection}>
        <img src={PaginaIncialSvg} alt="Logo" />
      </div>
      <nav className={styles.navMenu}>
        <div className={styles.navItem}>Página inicial</div>
        <div className={styles.navItem}>Lista de ocorrências</div>
        <div className={styles.navItem}>Dashboard</div>
        <div className={styles.navItem}>Gestão de usuários</div>
      </nav>
    </aside>
  );
};

export default Sidebar;