import { useState, type JSX } from "react";
import styles from "./RecuperarSenha.module.css";
import { useNavigate } from 'react-router-dom';

function RecuperarSenha(): JSX.Element {
  const navigate = useNavigate();
  
  const [matricula, setMatricula] = useState("");
  const [cpf, setCpf] = useState("");

  const handleAvancar = () => {
    console.log("Avançar clicado");
    console.log("Matrícula:", matricula);
    console.log("CPF:", cpf);
    
    navigate("/confirmarsenha"); 
  };

  const handleCancelar = () => {
    console.log("Cancelar clicado. Redirecionando para /");
    navigate("/"); 
  };

  return (
    <div className={styles.container}>
      <div className={styles.cardRecuperacao}>
        <h1 className={styles.titulo}>RECUPERAR SENHA</h1>

        
        <div className={styles.formField}>
          <label htmlFor="matricula" className={styles.labelText}>Matrícula</label>
          <input
            id="matricula"
            type="text"
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
            className={styles.inputField}
          />
        </div>

        <div className={styles.formField}>
          <label htmlFor="cpf" className={styles.labelText}>CPF</label>
          <input
            id="cpf"
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
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
            Avançar
          </button>
        </div>
      </div>
      
      <footer className={styles.footer}>
        Copyright © 2025 Sirene
      </footer>
    </div>
  );
}

export default RecuperarSenha;
