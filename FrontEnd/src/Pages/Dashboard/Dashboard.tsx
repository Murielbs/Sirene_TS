import React, { useState, useEffect, type JSX } from "react";
import { apiFetch } from "../../lib/api";
import { Search, SlidersHorizontal } from "lucide-react";
import styles from "./Dashboard.module.css";
import { useNavigate } from "react-router-dom";
import PaginaIncialSvg from "../../img/PaginaIncial.svg";
import ListaOcorrenciaSvg from "../../img/ListaOcorrencia.svg";
import DashboardSvg from "../../img/Dashboard.svg";
import GestaoUsuarioSvg from "../../img/GestaoUsuario.svg";
import AuditoriaLogSvg from "../../img/AuditoriaLog.svg";
import ConfiguracaoSvg from "../../img/Configuracao.svg";
import SairSvg from "../../img/sair.svg";
import LogoSvg from "../../img/Logo.svg";

interface Ocorrencia {
  id: string;
  // No backend o campo é 'tipoOcorrencia' (schema.prisma). Mantemos 'tipo' como fallback para retrocompatibilidade.
  tipo?: string;
  tipoOcorrencia?: string;
  criadoPor?: string;
  regiao?: string;
  dataHora?: string;
  status?: string;
  dataTimestamp?: number;
  prioridade?: string;
  endereco?: string;
  numero?: string;
  pontoReferencia?: string;
}

function DashboardAdmin(): JSX.Element {
  const navigate = useNavigate();

  const [setOcorrencias] = useState<Ocorrencia[]>([]);
  const [setLoading] = useState<boolean>(true);
  const [setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOcorrencias = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await apiFetch("/api/ocorrencia", { headers });
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(
            `Erro ${res.status}: ${errorText}` || "Erro ao buscar ocorrências"
          );
        }
        const data = await res.json();

        const list: Ocorrencia[] = Array.isArray(data)
          ? data
          : data.data || data.ocorrencias || [];
        setOcorrencias(list);
      } catch (err: any) {
        console.error("Erro ao buscar ocorrências:", err);
        setError(err.message || "Ocorreu um erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchOcorrencias();
  }, []);

  const handleMenuItemClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className={styles.appContainer}>
      <div className={styles.sidebar}>
        <div className={styles.logoSection}>
          <span className={styles.logoText}>
            <img src={LogoSvg} alt="Sirene" className={styles.logoImage} />
          </span>
        </div>

        <nav className={styles.navMenu}>
          <div
            className={styles.navItem}
            onClick={() => handleMenuItemClick("/Inicial")}
          >
            <img
              src={PaginaIncialSvg}
              alt="Página inicial"
              className={styles.navIconImg}
            />
            <span className={styles.navText}>Pagina inicial</span>
          </div>

          <div
            className={styles.navItem}
            onClick={() => handleMenuItemClick("/Ocorrencias")}
          >
            <img
              src={ListaOcorrenciaSvg}
              alt="Lista de ocorrências"
              className={styles.navIconImg}
            />
            <span className={styles.navText}>Lista de ocorrências</span>
          </div>

          <div
            className={`${styles.navItem} ${styles.navActive}`}
            onClick={() => handleMenuItemClick("/dashboard")}
          >
            <img
              src={DashboardSvg}
              alt="Dashboard"
              className={styles.navIconImg}
            />
            <span className={styles.navText}>Dashboard</span>
          </div>

          <div
            className={styles.navItem}
            onClick={() => handleMenuItemClick("/GestaoUsuario")}
          >
            <img
              src={GestaoUsuarioSvg}
              alt="Gestão de usuários"
              className={styles.navIconImg}
            />
            <span className={styles.navText}>Gestão de usuários</span>
          </div>

          <div
            className={styles.navItem}
            onClick={() => handleMenuItemClick("/auditoria")}
          >
            <img
              src={AuditoriaLogSvg}
              alt="Auditoria e logs"
              className={styles.navIconImg}
            />
            <span className={styles.navText}>Auditoria e logs</span>
          </div>

          <div
            className={styles.navItem}
            onClick={() => handleMenuItemClick("/Configuracoes")}
          >
            <img
              src={ConfiguracaoSvg}
              alt="Configuração"
              className={styles.navIconImg}
            />
            <span className={styles.navText}>Configuração</span>
          </div>
        </nav>

        <div
          className={styles.navItem}
          onClick={() => handleMenuItemClick("/")}
        >
          <img src={SairSvg} alt="Sair" className={styles.navIconImg} />
          <span className={styles.navText}>Sair</span>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div style={{ width: "100%", height: "100vh" }}>
          <iframe
            src="https://dashboard-1-fafv.onrender.com"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
            }}
            title="Dashboard Sirene"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default DashboardAdmin;
