import React, { useState, type JSX } from "react";
import {
  Plus,
  FileText,
  ChevronDown,
  User,
  AlertCircle,
  X,
} from "lucide-react";
import LogoSvg from "../../img/Logo.svg";
import PaginaIncialSvg from "../../img/PaginaIncial.svg";
import ListaOcorrenciaSvg from "../../img/ListaOcorrencia.svg";
import DashboardSvg from "../../img/Dashboard.svg";
import GestaoUsuarioSvg from "../../img/GestaoUsuario.svg";
import AuditoriaLogSvg from "../../img/AuditoriaLog.svg";
import ConfiguracaoSvg from "../../img/Configuracao.svg";
import SairSvg from "../../img/sair.svg";
import styles from "./Inicial.module.css";
import { useNavigate } from "react-router-dom";

interface Ocorrencia {
  id: number;
  tipo: string;
  agente?: string;
  regiao: string;
  dataHora: string;
  status: "Em aberto" | "Fechado" | "Andamento";
}

interface Activity {
  id: number;
  icon: JSX.Element;
  text: string;
  time: string;
}

const mockOcorrenciasRecentes: Ocorrencia[] = [
  {
    id: 202593,
    tipo: "Acidente",
    agente: "João Silva",
    regiao: "Recife(COM)",
    dataHora: "10/10/2025 00:30",
    status: "Em aberto",
  },
  {
    id: 202592,
    tipo: "Resgate",
    agente: "José Carlos",
    regiao: "Recife(COM)",
    dataHora: "10/10/2025 08:47",
    status: "Em aberto",
  },
  {
    id: 202591,
    tipo: "Afogamento",
    agente: "Ana Caetano",
    regiao: "Paulista(COM)",
    dataHora: "10/10/2025 08:30",
    status: "Em aberto",
  },
  {
    id: 202590,
    tipo: "Incêndio",
    agente: "Marlina Sena",
    regiao: "Exu(COinter/2)",
    dataHora: "10/10/2025 10:00",
    status: "Andamento",
  },
];

const mockActivities: Activity[] = [
  {
    id: 3,
    icon: <User size={16} />,
    text: "Equipe Bravo designada para a ocorrência #202590.",
    time: "Há 2 minutos",
  },
  {
    id: 2,
    icon: <User size={16} />,
    text: "Novo usuário Andre Santana foi adicionado como Analista.",
    time: "Há 7 minutos",
  },
  {
    id: 1,
    icon: <AlertCircle size={16} />,
    text: "Nova ocorrência de Acidente foi registrada.",
    time: "Há 7 minutos",
  },
];

function Inicial(): JSX.Element {
  const navigate = useNavigate();
  const [currentDate] = useState(new Date(2025, 9, 13));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalActionType, setModalActionType] = useState("");

  const getStatusClass = (status: Ocorrencia["status"]) => {
    switch (status) {
      case "Em aberto":
        return styles.statusOpen;
      case "Fechado":
        return styles.statusClosed;
      case "Andamento":
        return styles.statusInProgress;
      default:
        return "";
    }
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
  };

  const handleCardClick = (actionType: string) => {
    setModalActionType(actionType);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalActionType("");
  };

  const renderCalendar = () => {
    const startDay = 28;
    const totalDays = 35;
    const daysInMonth = 31;
    const dayElements = [];

    for (let i = 0; i < totalDays; i++) {
      const day = startDay + i;
      let displayDay = day;
      let isCurrentMonth = true;
      let isSelected = false;

      if (day > daysInMonth) {
        displayDay = day - daysInMonth;
        isCurrentMonth = false;
      } else if (day < 1) {
        displayDay = day;
        isCurrentMonth = false;
      }

      if (isCurrentMonth && displayDay === 13) {
        isSelected = true;
      }

      dayElements.push(
        <div
          key={i}
          className={`${styles.calendarDay} 
                         ${
                           isCurrentMonth
                             ? styles.currentMonthDay
                             : styles.otherMonthDay
                         }
                         ${isSelected ? styles.selectedDay : ""}`}
        >
          {displayDay}
        </div>
      );
    }

    return dayElements;
  };

  return (
    <>
      <div
        className={`${styles.appContainer} ${
          isModalOpen ? styles.blurBackground : ""
        }`}
      >
        <div className={styles.sidebar}>
          <div className={styles.logoSection}>
            <span className={styles.logoText}>
              <img src={LogoSvg} alt="Sirene" className={styles.logoImage} />
            </span>
          </div>

          <nav className={styles.navMenu}>
            <div
              className={`${styles.navItem} ${styles.navActive}`}
              onClick={() => handleMenuItemClick("/Pagina inicial")}
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
              onClick={() => handleMenuItemClick("/Dashboard")}
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
          <div className={styles.dashboardGrid}>
            <div className={styles.actionCards}>
              <div
                className={styles.actionCard}
                onClick={() => handleCardClick("Registrar ocorrência")}
              >
                <div className={styles.cardIconCircle}>
                  <Plus size={24} className={styles.cardIcon} />
                </div>
                <span className={styles.cardTitle}>Registrar ocorrência</span>
              </div>

              <div
                className={styles.actionCard}
                onClick={() => handleCardClick("Gerenciar usuários")}
              >
                <div className={styles.cardIconCircle}>
                  <User size={24} className={styles.cardIcon} />
                </div>
                <span className={styles.cardTitle}>Gerenciar usuários</span>
              </div>

              <div
                className={styles.actionCard}
                onClick={() => handleCardClick("Gerar relatório diário")}
              >
                <div className={styles.cardIconCircle}>
                  <FileText size={24} className={styles.cardIcon} />
                </div>
                <span className={styles.cardTitle}>Gerar relatório diário</span>
              </div>
            </div>

            <div className={styles.feedContainer}>
              <h2 className={styles.feedTitle}>Feed de atividades</h2>
              <div className={styles.activityList}>
                {mockActivities.map((activity) => (
                  <div key={activity.id} className={styles.activityItem}>
                    <div className={styles.activityIcon}>{activity.icon}</div>
                    <div className={styles.activityText}>
                      {activity.text}
                      <div className={styles.activityTime}>{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.recentOccurrencesContainer}>
              <div className={styles.recentOccurrencesHeader}>
                <h2 className={styles.recentOccurrencesTitle}>
                  Ocorrência recentes
                </h2>
                <span
                  className={styles.seeMoreLink}
                  onClick={() => handleMenuItemClick("/Ocorrencias")}
                >
                  Ver tudo &gt;
                </span>
              </div>

              <table className={styles.occurrencesTable}>
                <thead>
                  <tr>
                    <th className={styles.tableHeaderTipo}>TIPO</th>
                    <th className={styles.tableHeaderRegiao}>REGIÃO</th>
                    <th className={styles.tableHeaderID}>ID</th>
                    <th className={styles.tableHeaderDataHora}>DATA/HORA</th>
                    <th className={styles.tableHeaderStatus}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {mockOcorrenciasRecentes.map((ocorrencia) => (
                    <tr key={ocorrencia.id} className={styles.tableRow}>
                      <td className={styles.cellTipo}>
                        <span className={styles.cellTipoName}>
                          {ocorrencia.tipo}
                        </span>
                        <span className={styles.cellAgente}>
                          {ocorrencia.agente}
                        </span>
                      </td>
                      <td className={styles.cellRegiao}>{ocorrencia.regiao}</td>
                      <td className={styles.cellID}>{ocorrencia.id}</td>
                      <td className={styles.cellDataHora}>
                        {ocorrencia.dataHora}
                      </td>
                      <td className={styles.cellStatus}>
                        <span
                          className={`${styles.statusPill} ${getStatusClass(
                            ocorrencia.status
                          )}`}
                        >
                          {ocorrencia.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className={styles.rightSidebar}>
          <div className={styles.profileCard}>
            <img
              src="/src/img/Persona1.png"
              alt="Roberta Silva"
              className={styles.profileImage}
            />
            <span className={styles.profileName}>Roberta Silva</span>
            <span className={styles.profileRole}>ADMIN</span>
          </div>

          <div className={styles.calendarCard}>
            <div className={styles.calendarHeader}>
              <span>
                {currentDate.toLocaleString("pt-BR", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <ChevronDown size={16} className={styles.dropdownArrow} />
            </div>
            <div className={styles.calendarGrid}>
              <div className={styles.calendarDayHeader}>DOM</div>
              <div className={styles.calendarDayHeader}>SEG</div>
              <div className={styles.calendarDayHeader}>TER</div>
              <div className={styles.calendarDayHeader}>QUA</div>
              <div className={styles.calendarDayHeader}>QUI</div>
              <div className={styles.calendarDayHeader}>SEX</div>
              <div className={styles.calendarDayHeader}>SAB</div>
              {renderCalendar()}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.modalCloseButton} onClick={closeModal}>
              <X size={24} />
            </button>
            <h3 className={styles.modalTitle}>
              Formulário de {modalActionType}
            </h3>

            <div className={styles.modalBody}>
              <p>O formulário para **{modalActionType}** irá aqui.</p>
              <input
                type="text"
                placeholder="Insira a informação..."
                className={styles.modalInput}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Inicial;
