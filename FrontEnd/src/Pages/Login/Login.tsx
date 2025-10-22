import React, { useState, type JSX } from "react";
import { apiFetch } from "../../lib/api";
import styles from "./Login.module.css";
import { useNavigate } from 'react-router-dom';

function Login(): JSX.Element {
  const navigate = useNavigate();

  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ matricula: cpf, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        
        const token = data.data && data.data.token ? data.data.token : null;
        
        if (token) {
            localStorage.setItem('token', token); 
            navigate('/Inicial'); 
            
        } else {
            setMessage("Erro: O servidor não forneceu o token de autenticação.");
            console.error("Resposta do servidor não continha um token válido:", data);
        }

      } else {
        setMessage(data.message || "Credenciais inválidas. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao tentar fazer login:", error);
      setMessage("Não foi possível conectar ao servidor. Verifique sua conexão.");
    }

    setTimeout(() => setMessage(""), 5000);
  };

  const handleForgotPassword = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    navigate("/RecuperarSenha"); 
  };


  return (
    <div className={styles.pageContainer}> 
      <form className={styles.box} onSubmit={handleLogin}>
        <div className={styles.containerLogin}>
          <div className={styles.textWrapper}>FAÇA LOGIN</div>

          {message && <p className={styles.errorMessage}>{message}</p>}

          <div className={styles.formField}>
            <div className={styles.labelTextWrapper}>
              <div className={styles.labelText}>Matricula</div>
            </div>
            <input
              type="text"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              className={styles.inputFieldBox} />
          </div>

          <div className={styles.formField}>
            <div className={styles.labelTextWrapper}>
              <div className={styles.labelText}>Senha</div>
            </div>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className={styles.inputFieldBox} />
          </div>

          <a
            href="/RecuperarSenha" 
            className={styles.textWrapper4}
            onClick={handleForgotPassword}
          >
            Esqueceu a senha?
          </a>

          <div className={styles.keepLoggedIn}>
            <input type="checkbox" id="keepLoggedIn" name="keepLoggedIn" />
            <label htmlFor="keepLoggedIn" className={styles.checkboxLabel}>Manter logado</label>
          </div>

          <div className={styles.CONFIRMAR}>
            <button type="submit" className={styles.loginButton}>
              Entrar
            </button>
          </div>
        </div>
      </form>
      
      <footer>
        <div className={styles.copyright}>Copyright © 2025 Sirene</div>
      </footer>
    </div>
  );
}

export default Login;