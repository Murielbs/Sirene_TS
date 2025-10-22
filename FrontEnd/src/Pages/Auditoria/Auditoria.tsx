import React, { useState, type JSX } from "react";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import styles from "./Auditoria.module.css";
import { useNavigate } from "react-router-dom";
import PaginaIncialSvg from "../../img/PaginaIncial.svg";
import ListaOcorrenciaSvg from "../../img/ListaOcorrencia.svg";
import DashboardSvg from "../../img/Dashboard.svg";
import GestaoUsuarioSvg from "../../img/GestaoUsuario.svg";
import AuditoriaLogSvg from "../../img/AuditoriaLog.svg";
import ConfiguracaoSvg from "../../img/Configuracao.svg";
import SairSvg from "../../img/sair.svg";
import LogoSvg from "../../img/Logo.svg";

interface LogEntry {
  id: string;
  dataHora: string;
  usuario: string;
  descricao: string;
  acao: "Login" | "Alteracao" | "Exclusao" | "Criacao" | "Sistema";
  status: "Sucesso" | "Falha";
}

const mockLogs: LogEntry[] = [
  { id: "1", dataHora: "12/10/25 09:00", usuario: "jane@microsoft.com", descricao: "Login no sistema", acao: "Login", status: "Sucesso" },
  { id: "2", dataHora: "12/10/25 09:45", usuario: "floyd@yahoo.com", descricao: "Atualizou perfil do usuário", acao: "Alteracao", status: "Sucesso" },
  { id: "3", dataHora: "12/10/25 10:40", usuario: "ronald@adobe.com", descricao: "Excluiu a ocorrência #202567", acao: "Exclusao", status: "Sucesso" },
  { id: "4", dataHora: "12/10/25 10:50", usuario: "marvin@tesla.com", descricao: "Criou uma nova ocorrência", acao: "Criacao", status: "Sucesso" },
  { id: "5", dataHora: "12/10/25 11:00", usuario: "jerome@google.com", descricao: "Login no sistema", acao: "Login", status: "Sucesso" },
  { id: "6", dataHora: "12/10/25 11:15", usuario: "kathryn@microsoft.com", descricao: "Adicionou um novo usuário", acao: "Criacao", status: "Sucesso" },
  { id: "7", dataHora: "12/10/25 11:39", usuario: "jacob@yahoo.com", descricao: "Excluiu um usuário", acao: "Exclusao", status: "Sucesso" },
  { id: "8", dataHora: "12/10/25 11:40", usuario: "kristin@facebook.com", descricao: "Exportou o relatório", acao: "Sistema", status: "Falha" },
  { id: "9", dataHora: "12/10/25 11:50", usuario: "kristin@facebook.com", descricao: "Login no sistema", acao: "Login", status: "Falha" },
];


function AuditoriaLogs(): JSX.Element {
  const navigate = useNavigate();
  const [allLogs] = useState<LogEntry[]>(mockLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"recente" | "usuario">("recente");
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 9;
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredLogs = allLogs.filter(
    (log) =>
      log.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedLogs = [...filteredLogs].sort((a, b) => {
    if (sortBy === "recente") {
      return new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime();
    }
    return a.usuario.localeCompare(b.usuario);
  });

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = sortedLogs.slice(indexOfFirstLog, indexOfLastLog);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getStatusClass = (status: LogEntry["status"]) => {
    switch (status) {
      case "Sucesso":
        return styles.statusSuccess;
      case "Falha":
        return styles.statusFailure;
      default:
        return "";
    }
  };

  const getActionClass = (acao: LogEntry["acao"]) => {
    switch (acao) {
      case "Login":
        return styles.actionLogin;
      case "Alteracao":
        return styles.actionUpdate;
      case "Exclusao":
        return styles.actionDelete;
      case "Criacao":
        return styles.actionCreate;
      case "Sistema":
        return styles.actionSystem;
      default:
        return "";
    }
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
  };

  const renderPageNumbers = () => {
    return [1, 2, 3, 4, "...", 40].map((num, index) => {
      if (num === "...") {
        return (
          <span key={index} className={styles.pageEllipsis}>
            ...
          </span>
        );
      }
      const pageNum = num as number;
      return (
        <button
          key={index}
          onClick={() => paginate(pageNum)}
          className={`${styles.pageNumber} ${
            pageNum === currentPage ? styles.pageActive : ""
          }`}
        >
          {num}
        </button>
      );
    });
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
            className={`${styles.navItem}`}
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
            className={`${styles.navItem}`}
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
        <div className={styles.controlsBar}>
          <div className={styles.searchFilterGroup}>
            <div className={styles.searchBox}>
              <Search size={18} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search"
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              className={styles.filterButton}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <SlidersHorizontal size={18} />
              Filtro
            </button>
          </div>

          <div className={styles.controlsRightGroup}>
            <div className={styles.sortDropdown}>
              <span>Ordenar por:</span>
              <select
                className={styles.dropdownSelect}
                value={sortBy}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSortBy(e.target.value as "recente" | "usuario")
                }
              >
                <option value="recente">Recente</option>
                <option value="usuario">Usuário</option>
              </select>
              <ChevronDown size={18} className={styles.dropdownArrow} />
            </div>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.userTable}>
            <thead>
              <tr>
                <th className={styles.headerLarge}>DATA/HORA</th>
                <th className={styles.headerSmall}>USUÁRIO</th>
                <th className={styles.headerMedium}>DESCRIÇÃO</th>
                <th className={styles.headerMedium}>AÇÕES</th>
                <th className={styles.headerSmall}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {currentLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className={styles.emptyState}>
                    Nenhum log encontrado.
                  </td>
                </tr>
              ) : (
                currentLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.dataHora}</td>
                    <td>{log.usuario}</td>
                    <td>{log.descricao}</td>
                    <td className={styles.actionsCell}>
                      <span
                        className={`${styles.actionButton} ${getActionClass(log.acao)}`}
                      >
                        {log.acao}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`${styles.statusPill} ${getStatusClass(
                          log.status
                        )}`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.pagination}>
          <div className={styles.pageNumbers}>{renderPageNumbers()}</div>
        </div>
      </div>
    </div>
  );
}

export default AuditoriaLogs;