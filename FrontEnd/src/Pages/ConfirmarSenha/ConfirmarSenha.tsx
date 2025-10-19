import { useState, type JSX } from "react";
import styles from "./ConfirmarSenha.module.css";
import { useNavigate } from 'react-router-dom';

function ConfirmarSenha(): JSX.Element {
  const navigate = useNavigate();
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");

  const handleAvancar = () => {
    
    
    console.log("Avançar clicado. Senha confirmada.");

    
    navigate("/"); 
  };

  const handleCancelar = () => {
    console.log("Cancelar clicado. Redirecionando para /");
    
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <div className={styles.cardRecuperacao}>
        <h1 className={styles.titulo}>CONFIRMAR SENHA</h1>

        
        <div className={styles.formField}>
          <label htmlFor="novaSenha" className={styles.labelText}>Nova senha</label>
          <input
            id="novaSenha"
            
            type="password" 
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            className={styles.inputField}
          />
        </div>

        
        <div className={styles.formField}>
          <label htmlFor="confirmarNovaSenha" className={styles.labelText}>Confirmar nova senha</label>
          <input
            id="confirmarNovaSenha"
          
            type="password" 
            value={confirmarNovaSenha}
            onChange={(e) => setConfirmarNovaSenha(e.target.value)}
            className={styles.inputField}
          />
        </div>

        
        <div className={styles.buttonGroup}>
          <button 
            onClick={handleCancelar} 
            className={`${styles.button} ${styles.buttonCancelar}`}
          >
            Cancelar
          </button>
          <button 
            onClick={handleAvancar} 
            className={`${styles.button} ${styles.buttonAvancar}`}
          >
            Confirmar
          </button>
        </div>
      </div>
      
      <footer className={styles.footer}>
        Copyright © 2025 Sirene
      </footer>
    </div>
  );
}

export default ConfirmarSenha;