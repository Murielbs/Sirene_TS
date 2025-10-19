import { useState, useEffect, type JSX } from "react";
import { Plus, FileText, ChevronDown, User, X } from "lucide-react";
import { jwtDecode } from "jwt-decode";
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
  id: string;
  tipo: string;
  criadoPor?: string;
  regiao: string;
  dataHora: string;
  status: "Em aberto" | "Fechado" | "Andamento";
}

interface JwtPayload {
  nome: string;
  cargo: string;
  [key: string]: any;
}

// atividades serão carregadas via API futuramente
function Inicial(): JSX.Element {
  const navigate = useNavigate();
  const [currentDate] = useState(new Date(2025, 9, 13));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalActionType, setModalActionType] = useState("");
  const [userData, setUserData] = useState<JwtPayload | null>(null);
  const [ocorrenciasRecentes, setOcorrenciasRecentes] = useState<Ocorrencia[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) return;

    let cancelled = false;

    try {
      const decodedUser = jwtDecode<any>(token);

      // Base da API (Vite): VITE_API_URL, se não setada tenta rota relativa
      const API_BASE = (typeof import.meta !== 'undefined' ? (import.meta as any).env?.VITE_API_URL : '') || '';
      const base = API_BASE ? API_BASE.replace(/\/$/, '') : '';

      // buscar ocorrências recentes do backend (fallback para mock em erro)
  const urlOcorrencias = `${base}/api/ocorrencia`;
      const fetchOcorrencias = async () => {
        try {
          const res = await fetch(urlOcorrencias, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!res.ok) throw new Error(`Resposta não OK: ${res.status}`);

          const body = await res.json();
          const list = body?.data || body?.ocorrencias || body;

              const normalizedList: Ocorrencia[] = (Array.isArray(list) ? list : []).map((o: any) => {
                const rawDate = o.data_hora || o.dataHora || o.data || o.created_at;
                const dateStr = rawDate ? new Date(rawDate).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

                const rawStatus = String(o?.status ?? '').toLowerCase();
                const status = (
                  !rawStatus || rawStatus === 'open' || rawStatus === 'aberta' || rawStatus === 'aberto' || rawStatus === 'aberta' || rawStatus === 'aberto' || rawStatus === 'aberta' || rawStatus === 'aberta'
                ) ? 'Em aberto'
                : (rawStatus.includes('in_progress') || rawStatus.includes('andamento') || rawStatus.includes('em_andamento') || rawStatus.includes('em-andamento') || rawStatus.includes('em andamento')) ? 'Andamento'
                : (rawStatus.includes('closed') || rawStatus.includes('fechado') || rawStatus.includes('concluida') || rawStatus.includes('concluído') || rawStatus.includes('concluido') || rawStatus.includes('cancel') || rawStatus.includes('cancelada')) ? 'Fechado'
                : 'Em aberto';

                return {
                  id: String(o.id ?? o._id ?? o.codigo ?? o.numero ?? ''),
                  tipo: o.tipoOcorrencia || o.tipo || o.descricao || '—',
                  criadoPor: o.assinatura_digital || o.assinaturaDigital || o.responsavel || o.nomeAgente || undefined,
                  regiao: o.cidade || o.regiao || o.local || o.unidade || '—',
                  dataHora: dateStr,
                  status,
                } as Ocorrencia;
              });

          // mostrar apenas os 4 mais recentes no feed
          const top4 = normalizedList.slice(0, 4);
          if (!cancelled) setOcorrenciasRecentes(top4);
        } catch (err) {
          console.error('Erro ao buscar ocorrências:', err);
          if (!cancelled) setOcorrenciasRecentes([]);
        }
      };

      fetchOcorrencias();

      const url = `${base}/api/auth/me`;

      const fetchUser = async () => {
        try {
          const res = await fetch(url, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!res.ok) throw new Error(`Resposta não OK: ${res.status}`);

          const respJson = await res.json();

          // Backend padroniza como { success, message, data }
          const apiUser = respJson?.data || respJson?.militar || respJson;

          // Normaliza os campos para o formato esperado pelo componente
          const normalized = {
            ...apiUser,
            nome: apiUser?.nome || decodedUser?.nome || '',
            cargo: apiUser?.posto || apiUser?.perfilAcesso || decodedUser?.cargo || decodedUser?.perfilAcesso || '',
          };

          if (!cancelled) setUserData(normalized);
        } catch (fetchErr) {
          console.error('Erro ao buscar usuário:', fetchErr);

          // fallback: usar dados do token se houver nome/cargo
          if (!cancelled && decodedUser && decodedUser.nome && (decodedUser.cargo || decodedUser.perfilAcesso)) {
            setUserData({
              ...decodedUser,
              nome: decodedUser.nome,
              cargo: decodedUser.cargo || decodedUser.perfilAcesso,
            });
          }
        }
      };

      fetchUser();
    } catch (error) {
      console.error('Erro ao decodificar o token JWT:', error);
    }

    return () => {
      cancelled = true;
    };
  }, []);

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
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate("/");
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
              onClick={() => handleMenuItemClick("/inicial")} 
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
            onClick={handleLogout} 
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
                <div className={styles.noData}>Nenhuma atividade recente</div>
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
                  {ocorrenciasRecentes.map((ocorrencia) => (
                    <tr key={ocorrencia.id} className={styles.tableRow}>
                      <td className={styles.cellTipo}>
                        <span className={styles.cellTipoName}>
                          {ocorrencia.tipo}
                        </span>
                        <span className={styles.cellAgente}>
                          {ocorrencia.criadoPor}
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
              src={userData?.foto || "/src/img/Persona1.png"}
              alt={userData?.nome || "Usuário"}
              className={styles.profileImage}
            />
            <span className={styles.profileName}>
              {userData ? userData.nome : "Carregando..."}
            </span>
            <span className={styles.profileRole}>
              {userData ? userData.cargo.toUpperCase() : "..."}
            </span>
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