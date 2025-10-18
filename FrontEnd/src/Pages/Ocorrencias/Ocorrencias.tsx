import React, { useState, type JSX } from "react";
import { Search, SlidersHorizontal, ChevronDown, Plus } from "lucide-react";
import styles from "./Ocorrencias.module.css";
import { useNavigate } from "react-router-dom";
import PaginaIncialSvg from "../../img/PaginaIncial.svg";
import ListaOcorrenciaSvg from "../../img/ListaOcorrencia.svg";
import DashboardSvg from "../../img/Dashboard.svg";
import GestaoUsuarioSvg from "../../img/GestaoUsuario.svg";
import AuditoriaLogSvg from "../../img/AuditoriaLog.svg";
import ConfiguracaoSvg from "../../img/Configuracao.svg";
import SairSvg from "../../img/sair.svg";

interface Ocorrencia {
  id: number;
  tipo: string;
  regiao: string;
  dataHora: string;
  status: "Em aberto" | "Fechado" | "Andamento";
}

const mockOcorrencias: Ocorrencia[] = [
  {
    id: 202530,
    tipo: "Acidente",
    regiao: "Recife (COM)",
    dataHora: "02/02/2025 06:30",
    status: "Em aberto",
  },
  {
    id: 202531,
    tipo: "Vazamento",
    regiao: "Camaragibe (COM)",
    dataHora: "02/02/2025 07:33",
    status: "Fechado",
  },
  {
    id: 202532,
    tipo: "Incêndio",
    regiao: "Paulista (COM)",
    dataHora: "02/02/2025 07:35",
    status: "Fechado",
  },
  {
    id: 202533,
    tipo: "Resgate",
    regiao: "Caruaru (COInter/I)",
    dataHora: "02/02/2025 08:30",
    status: "Em aberto",
  },
  {
    id: 202534,
    tipo: "Desabamento",
    regiao: "Recife (COM)",
    dataHora: "02/02/2025 10:30",
    status: "Andamento",
  },
  {
    id: 202535,
    tipo: "Acidente",
    regiao: "Recife (COM)",
    dataHora: "02/02/2025 11:00",
    status: "Andamento",
  },
  {
    id: 202536,
    tipo: "Afogamento",
    regiao: "Bezerros (COInter/I)",
    dataHora: "02/02/2025 12:30",
    status: "Em aberto",
  },
  {
    id: 202537,
    tipo: "Resgate",
    regiao: "Carpina (COInter/I)",
    dataHora: "02/02/2025 13:30",
    status: "Fechado",
  },
  {
    id: 202538,
    tipo: "Afogamento",
    regiao: "Recife (COM)",
    dataHora: "02/02/2025 19:00",
    status: "Fechado",
  },
];

interface MetricCardProps {
  title: string;
  value: string;
  unit?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, unit }) => (
  <div className={styles.metricCard}>
    <span className={styles.metricTitle}>{title}</span>
    <div className={styles.metricValueGroup}>
      <span className={styles.metricValue}>{value}</span>
      {unit && <span className={styles.metricUnit}>{unit}</span>}
    </div>
  </div>
);

// --- COMPONENTE MODAL MULTI-ETAPA ---
interface NewOcorrenciaModalProps {
  onClose: () => void;
}

const NewOcorrenciaModal: React.FC<NewOcorrenciaModalProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const renderStepContent = (step: number): JSX.Element => {
    switch (step) {
      case 1:
        return (
          <form className={styles.modalForm}>
            <h3 className={styles.formTitle}>Dados da Ocorrência</h3>
            <input
              type="text"
              className={styles.modalInput}
              placeholder="Tipo de Ocorrência"
              required
            />
            <select className={styles.modalInput} required>
              <option value="">Selecione a Prioridade</option>
              <option value="alta">Alta</option>
              <option value="media">Média</option>
              <option value="baixa">Baixa</option>
            </select>
            <textarea
              className={styles.modalInput}
              placeholder="Descrição detalhada (opcional)"
            ></textarea>
          </form>
        );
      case 2:
        return (
          <form className={styles.modalForm}>
            <h3 className={styles.formTitle}>Localização</h3>
            <input
              type="text"
              className={styles.modalInput}
              placeholder="CEP / Logradouro"
              required
            />
            <input
              type="text"
              className={styles.modalInput}
              placeholder="Referência (opcional)"
            />
            <input
              type="text"
              className={styles.modalInput}
              placeholder="Produto Químico (se aplicável)"
            />
            <div className={styles.mapPlaceholder}>Mapa de localização</div>
          </form>
        );
      case 3:
        return (
          <form className={styles.modalForm}>
            <h3 className={styles.formTitle}>Anexos e Observações</h3>
            <p className={styles.uploadInfo}>
              Clique ou arraste imagens e vídeos para anexar.
            </p>
            <div className={styles.uploadBox}>Clique para fazer upload</div>
            <textarea
              className={styles.modalInput}
              placeholder="Observações finais (opcional)"
            ></textarea>
          </form>
        );
      default:
        return <p>Erro</p>;
    }
  };

  const handleNext = () =>
    setCurrentStep((prev) => Math.min(totalSteps, prev + 1));
  const handleBack = () => setCurrentStep((prev) => Math.max(1, prev - 1));
  const handleSubmit = () => {
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modalContent} ${styles.multistepModal}`}>
        <div className={styles.stepIndicator}>
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`${styles.stepCircle} ${
                step <= currentStep ? styles.stepActive : ""
              }`}
            >
              {step}
            </div>
          ))}
        </div>

        <div className={styles.stepContent}>
          {renderStepContent(currentStep)}
        </div>

        <div className={styles.modalActions}>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonSecondary}`}
            onClick={onClose}
          >
            Cancelar
          </button>
          {currentStep > 1 && (
            <button
              type="button"
              className={styles.button}
              onClick={handleBack}
            >
              Voltar
            </button>
          )}
          {currentStep < totalSteps ? (
            <button
              type="button"
              className={`${styles.button} ${styles.buttonPrimary}`}
              onClick={handleNext}
            >
              Próximo
            </button>
          ) : (
            <button
              type="button"
              className={`${styles.button} ${styles.buttonPrimary}`}
              onClick={handleSubmit}
            >
              Finalizar Registro
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
// --- FIM DO MODAL MULTI-ETAPA ---

function ListaOcorrencias(): JSX.Element {
  const navigate = useNavigate();
  const [allOcorrencias] = useState<Ocorrencia[]>(mockOcorrencias);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"recente" | "tipo">("recente");
  const [currentPage, setCurrentPage] = useState(1);
  const ocorrenciasPerPage = 8;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // NOVO ESTADO PARA O MODAL MULTI-ETAPA
  const [isNewOcorrenciaModalOpen, setIsNewOcorrenciaModalOpen] =
    useState(false);

  const totalOcorrencias = 530;
  const ocorrenciasAbertas = 30;
  const tempoMedioResposta = "17";

  const filteredOcorrencias = allOcorrencias.filter(
    (ocorrencia) =>
      ocorrencia.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ocorrencia.regiao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ocorrencia.id.toString().includes(searchTerm.toLowerCase())
  );

  const sortedOcorrencias = [...filteredOcorrencias].sort((a, b) => {
    if (sortBy === "recente") {
      return b.id - a.id;
    }
    return a.tipo.localeCompare(b.tipo);
  });

  const totalPages = Math.max(
    1,
    Math.ceil(sortedOcorrencias.length / ocorrenciasPerPage)
  );
  const indexOfLastOcorrencia = currentPage * ocorrenciasPerPage;
  const indexOfFirstOcorrencia = indexOfLastOcorrencia - ocorrenciasPerPage;
  const currentOcorrencias = sortedOcorrencias.slice(
    indexOfFirstOcorrencia,
    indexOfLastOcorrencia
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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

  const handleViewDetail = (id: number) => {
    navigate(`/visualizacao/${id}`);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages > maxPagesToShow) {
      pageNumbers.push(1, 2, 3, 4, "...", totalPages);
    } else {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    }

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
          <div className={styles.sLogo}>S</div>
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
            className={`${styles.navItem} ${styles.navActive}`}
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
            <button
              className={styles.newOcorrenciaButton}
              // CHAMA O NOVO MODAL
              onClick={() => setIsNewOcorrenciaModalOpen(true)}
            >
              <Plus size={18} />
              nova ocorrência
            </button>

            <div className={styles.sortDropdown}>
              <span>Ordenar por:</span>
              <select
                className={styles.dropdownSelect}
                value={sortBy}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSortBy(e.target.value as "recente" | "tipo")
                }
              >
                <option value="recente">Recente</option>
                <option value="tipo">Tipo</option>
              </select>
              <ChevronDown size={18} className={styles.dropdownArrow} />
            </div>
          </div>
        </div>

        <div className={styles.metricCardsContainer}>
          <MetricCard
            title="Total de Ocorrências"
            value={totalOcorrencias.toString()}
          />
          <MetricCard
            title="Ocorrências Abertas"
            value={ocorrenciasAbertas.toString()}
          />
          <MetricCard
            title="Tempo Médio de Resposta"
            value={tempoMedioResposta}
            unit="min"
          />
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.userTable}>
            <thead>
              <tr>
                <th className={styles.headerLarge}>TIPO</th>
                <th className={styles.headerSmall}>ID</th>
                <th className={styles.headerMedium}>REGIÃO</th>
                <th className={styles.headerMedium}>DATA/HORA</th>
                <th className={styles.headerActions}>AÇÕES</th>
                <th className={styles.headerSmall}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {currentOcorrencias.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.emptyState}>
                    Nenhuma ocorrência encontrada.
                  </td>
                </tr>
              ) : (
                currentOcorrencias.map((ocorrencia) => (
                  <tr key={ocorrencia.id}>
                    <td>{ocorrencia.tipo}</td>
                    <td>{ocorrencia.id}</td>
                    <td>{ocorrencia.regiao}</td>
                    <td>{ocorrencia.dataHora}</td>
                    <td className={styles.actionsCell}>
                      <span onClick={() => handleViewDetail(ocorrencia.id)}>
                        Ver detalhe
                      </span>
                    </td>
                    <td>
                      <span
                        className={`${styles.statusPill} ${getStatusClass(
                          ocorrencia.status
                        )}`}
                      >
                        {ocorrencia.status}
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

      {/* RENDERIZAÇÃO DO MODAL MULTI-ETAPA */}
      {isNewOcorrenciaModalOpen && (
        <NewOcorrenciaModal
          onClose={() => setIsNewOcorrenciaModalOpen(false)}
        />
      )}
    </div>
  );
}

export default ListaOcorrencias;
