import React, { type JSX, useState } from "react";
import LogoSvg from "../../img/Logo.svg";
import PaginaIncialSvg from "../../img/PaginaIncial.svg";
import ListaOcorrenciaSvg from "../../img/ListaOcorrencia.svg";
import DashboardSvg from "../../img/Dashboard.svg";
import GestaoUsuarioSvg from "../../img/GestaoUsuario.svg";
import AuditoriaLogSvg from "../../img/AuditoriaLog.svg";
import ConfiguracaoSvg from "../../img/Configuracao.svg";
import SairSvg from "../../img/sair.svg";
import styles from "./AuditoriaLogs.module.css";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

function AuditoriaLogs(): JSX.Element {
  const navigate = useNavigate();
  const [filterBy, setFilterBy] = useState<"Todos" | "Sucesso" | "Falha">(
    "Todos"
  );
  const [sortBy, setSortBy] = useState<"recente" | "nome">("recente");

  // Sample data - replace with actual data from your API
  const auditorias = [
    {
      id: 1,
      dataHora: "2024-01-15 10:30:00",
      usuario: "MarinaSena@email.com",
      descricao: "Login realizado",
      acao: "Login",
      status: "Sucesso",
    },
    {
      id: 2,
      dataHora: "2024-01-15 09:15:00",
      usuario: "Joao@email.com",
      descricao: "Tentativa de login inválida",
      acao: "Login",
      status: "Falha",
    },
  ];

  const currentAuditorias = auditorias;

  const handleMenuItemClick = (path: string) => {
    navigate(path);
  };

  const getStatusClass = (status: string) => {
    return status === "Sucesso" ? styles.statusSuccess : styles.statusError;
  };

  const getAcaoClass = (Acao: string) => {
    return Acao === "Login" ? styles.acaoSuccess : styles.acaoError;
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
            className={styles.navItem}
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
            className={`${styles.navItem} ${styles.navActive}`}
            onClick={() => handleMenuItemClick("/Auditoria")}
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
            onClick={() => handleMenuItemClick("/configuracao")}
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
        <div className={styles.contentCard}>
          <h1 className={styles.pageTitle}>Auditoria e Logs</h1>
          {/* Conteúdo da auditoria será implementado aqui */}

          <div className={styles.controlsBar}>
            <div className={styles.searchBox}>
              <Search size={20} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search"
                className={styles.searchInput}
              />
            </div>

            <div className={styles.dropdown}>
              <span>Filtrar: </span>
              <select
                className={styles.dropdownButton}
                value={filterBy}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFilterBy(e.target.value as "Todos" | "Sucesso" | "Falha")
                }
              >
                <option value="Todos">Todos</option>
                <option value="Sucesso">Sucesso</option>
                <option value="Falha">Falha</option>
              </select>
            </div>
            <div className={styles.dropdown}>
              <span>Ordenar por: </span>
              <select
                className={styles.dropdownButton}
                value={sortBy}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSortBy(e.target.value as "recente" | "nome")
                }
              >
                <option value="recente">Recente</option>
                <option value="nome">Nome (A-Z)</option>
              </select>
            </div>
          </div>
          {/* Conteúdo da tabela de auditoria */}
          <div className={styles.tableContainer}>
            <table className={styles.userTable}>
              <thead>
                <tr>
                  <th className={styles.headerLarge}>DATA/HORA</th>
                  <th className={styles.headerSmall}>USUÁRIO</th>
                  <th className={styles.headerMedium}>DESCRIÇÃO</th>
                  <th className={styles.headerActions}>AÇÕES</th>
                  <th className={styles.headerSmall}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {currentAuditorias.length === 0 ? (
                  <tr>
                    <td colSpan={5} className={styles.emptyState}>
                      Nenhum registro de auditoria encontrado.
                    </td>
                  </tr>
                ) : (
                  currentAuditorias.map((auditoria) => (
                    <tr key={auditoria.id}>
                      <td>{auditoria.dataHora}</td>
                      <td>{auditoria.usuario}</td>
                      <td>{auditoria.descricao}</td>
                      <td className={styles.actionsCell}>
                        <span
                          className={`${styles.statusPill} ${getAcaoClass(
                            auditoria.acao
                          )}`}
                        >
                          {auditoria.acao}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`${styles.statusPill} ${getStatusClass(
                            auditoria.status
                          )}`}
                        >
                          {auditoria.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuditoriaLogs;
