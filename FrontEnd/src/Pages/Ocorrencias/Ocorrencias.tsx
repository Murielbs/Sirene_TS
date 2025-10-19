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
import LogoSvg from "../../img/Logo.svg";

interface Ocorrencia {
  id: string;
  tipo: string;
  criadoPor?: string;
  regiao: string;
  dataHora: string;
  status: string;
  dataTimestamp?: number;
}

// dados de ocorrências virão do backend; não usar mocks estáticos aqui

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

interface NewOcorrenciaModalProps {
  onClose: () => void;
}

const NewOcorrenciaModal: React.FC<NewOcorrenciaModalProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const renderPassos = () => (
    <div className={styles.stepIndicator}>
      {[1, 2, 3].map((step) => (
        <div
          key={step}
          // Aplica a classe 'active' se a etapa for menor ou igual à etapa atual
          className={`${styles.stepCircle} ${
            step <= currentStep ? styles.active : "" // Usando 'active' para a cor de fundo sólida
          }`}
        >
          {step}
        </div>
      ))}
    </div>
  );

  const renderStepContent = (step: number): JSX.Element => {
    switch (step) {
      case 1:
        return (
          <form className={styles.modalFormPasso}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Tipo de ocorrência</label>
                <input
                  type="text"
                  className={styles.modalInput}
                  placeholder="Tipo de ocorrência"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Data e Hora</label>
                <input
                  type="datetime-local"
                  className={styles.modalInput}
                  required
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Prioridade</label>
                <select className={styles.modalInput} required>
                  <option value="">Prioridade</option>
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Status</label>
                <select className={styles.modalInput} required>
                  <option value="">Status</option>
                  <option value="ativo">Ativo</option>
                  <option value="pendente">Pendente</option>
                </select>
              </div>
            </div>
          </form>
        );
      case 2:
        return (
          <form className={styles.modalFormPasso}>
            <div className={styles.formRow}>
              <div className={styles.formGroupFull}>
                <label>Endereço</label>
                <input
                  type="text"
                  className={styles.modalInput}
                  placeholder="Endereço"
                  required
                />
              </div>
              <div className={styles.formGroupSmall}>
                <label>Número</label>
                <input
                  type="text"
                  className={styles.modalInput}
                  placeholder="Número"
                  required
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroupSmall}>
                <label>Bairro</label>
                <input
                  type="text"
                  className={styles.modalInput}
                  placeholder="Bairro"
                  required
                />
              </div>
              <div className={styles.formGroupSmall}>
                <label>Cidade</label>
                <input
                  type="text"
                  className={styles.modalInput}
                  placeholder="Cidade"
                  required
                />
              </div>
              <div className={styles.formGroupSmall}>
                <label>Região</label>
                <select className={styles.modalInput} required>
                  <option value="">Região</option>
                  <option value="RegiaoMetropolitana">(COM)</option>
                  <option value="AgresteZonaDaMata">(COInter/I)</option>
                  <option value="Sertão">(COInter/II)</option>
                  {/* Opções de Região */}
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Ponto de referência</label>
              <input
                type="text"
                className={styles.modalInput}
                placeholder="Ponto de referência (Opcional)"
              />
            </div>
          </form>
        );
      case 3:
        return (
          <form className={styles.modalFormPasso}>
            <div className={styles.formGroup}>
              <label>Descrição detalhada</label>
              <textarea
                className={styles.modalTextarea}
                placeholder="Descrição detalhada (opcional)"
                rows={5}
              ></textarea>
            </div>

            <div className={styles.formGroup}>
              <label>Anexo de mídia</label>
              <div className={styles.uploadContainer}>
                <p>Arraste o arquivo ou clique para fazer o upload</p>
                <div className={styles.uploadIcon}>
                  <span role="img" aria-label="upload icon">
                    ☁️
                  </span>
                </div>
                <input
                  type="file"
                  multiple
                  className={styles.hiddenFileInput}
                />
              </div>
            </div>
          </form>
        );
      default:
        return <p>Erro</p>;
    }
  };

  const handleNext = () =>
    setCurrentStep((prev) => Math.min(totalSteps, prev + 1));
  const handleSubmit = () => {
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modalContent} ${styles.multistepModal}`}>
        <div className={styles.stepHeader}>{renderPassos()}</div>

        <div className={styles.boxFundoBranca}>
          <div className={styles.stepContent}>
            {renderStepContent(currentStep)}
          </div>
        </div>

        <div className={styles.modalActions}>
          <button
            type="button"
            className={styles.botaoCancelar}
            onClick={onClose}
          >
            CANCELAR
          </button>

          {currentStep < totalSteps ? (
            <button
              type="button"
              className={styles.botaoAvancar}
              onClick={handleNext}
            >
              AVANÇAR
            </button>
          ) : (
            <button
              type="button"
              className={styles.botaoCadastrar}
              onClick={handleSubmit}
            >
              CADASTRAR
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

import { useEffect } from "react";

function ListaOcorrencias(): JSX.Element {
  const navigate = useNavigate();
  const [allOcorrencias, setAllOcorrencias] = useState<Ocorrencia[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"recente" | "tipo">("recente");
  const [currentPage, setCurrentPage] = useState(1);
  const ocorrenciasPerPage = 8;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isNewOcorrenciaModalOpen, setIsNewOcorrenciaModalOpen] =
    useState(false);

  const totalOcorrencias = allOcorrencias.length.toString();
  const ocorrenciasAbertas = allOcorrencias.filter(
    (o) => o.status === "Em aberto"
  ).length;
  const tempoMedioResposta = "-"; // não disponível no backend ainda

  const filteredOcorrencias = allOcorrencias.filter(
    (ocorrencia) =>
      ocorrencia.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ocorrencia.regiao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ocorrencia.id.toString().includes(searchTerm.toLowerCase())
  );

  const sortedOcorrencias = [...filteredOcorrencias].sort((a, b) => {
    if (sortBy === "recente") {
      const ta = a.dataTimestamp || 0;
      const tb = b.dataTimestamp || 0;
      return tb - ta;
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

  const handleViewDetail = (id: string) => {
    navigate(`/visualizacao/${id}`);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    let cancelled = false;

    const API_BASE =
      (typeof import.meta !== "undefined"
        ? (import.meta as any).env?.VITE_API_URL
        : "") || "";
    const base = API_BASE ? API_BASE.replace(/\/$/, "") : "";
    const url = `${base}/api/ocorrencia`;

    (async () => {
      try {
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error(`Resposta não OK: ${res.status}`);

        const body = await res.json();
        const list = body?.data || body?.ocorrencias || body;

        const normalized: Ocorrencia[] = (Array.isArray(list) ? list : []).map(
          (o: any) => {
            const rawDate = o.data_hora || o.dataHora || o.data || o.created_at;
            const ts = rawDate ? new Date(rawDate).getTime() : undefined;
            const dateStr = ts
              ? new Date(ts).toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "—";

            const rawStatus = String(o?.status ?? "").toLowerCase();
            const status =
              !rawStatus ||
              rawStatus === "open" ||
              rawStatus === "aberta" ||
              rawStatus === "aberto"
                ? "Em aberto"
                : rawStatus.includes("in_progress") ||
                  rawStatus.includes("andamento") ||
                  rawStatus.includes("em_andamento") ||
                  rawStatus.includes("em-andamento") ||
                  rawStatus.includes("em andamento")
                ? "Andamento"
                : rawStatus.includes("closed") ||
                  rawStatus.includes("fechado") ||
                  rawStatus.includes("concluida") ||
                  rawStatus.includes("concluido") ||
                  rawStatus.includes("cancel")
                ? "Fechado"
                : "Em aberto";

            return {
              id: String(o.id ?? o._id ?? o.codigo ?? o.numero ?? ""),
              tipo: o.tipoOcorrencia || o.tipo || o.descricao || "—",
              criadoPor:
                o.assinatura_digital ||
                o.assinaturaDigital ||
                o.responsavel ||
                o.nomeAgente ||
                undefined,
              regiao: o.cidade || o.regiao || o.local || o.unidade || "—",
              dataHora: dateStr,
              dataTimestamp: ts,
              status,
            } as Ocorrencia;
          }
        );

        if (!cancelled) setAllOcorrencias(normalized);
      } catch (err) {
        console.error("Erro ao buscar ocorrências (lista):", err);
        if (!cancelled) setAllOcorrencias([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

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

      {isNewOcorrenciaModalOpen && (
        <NewOcorrenciaModal
          onClose={() => setIsNewOcorrenciaModalOpen(false)}
        />
      )}
    </div>
  );
}

export default ListaOcorrencias;
