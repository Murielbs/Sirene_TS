import React, { useState, type JSX } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import LogoSvg from "../../img/Logo.svg";
import PaginaIncialSvg from "../../img/PaginaIncial.svg";
import ListaOcorrenciaSvg from "../../img/ListaOcorrencia.svg";
import DashboardSvg from "../../img/Dashboard.svg";
import GestaoUsuarioSvg from "../../img/GestaoUsuario.svg";
import AuditoriaLogSvg from "../../img/AuditoriaLog.svg";
import ConfiguracaoSvg from "../../img/Configuracao.svg";
import SairSvg from "../../img/sair.svg";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import styles from "../Ocorrencias/Ocorrencias.module.css";
import { useNavigate } from "react-router-dom";

const dataTipo = [
  { name: "Vazamentos", valor: 100 },
  { name: "Acidentes", valor: 120 },
  { name: "Resgates", valor: 80 },
  { name: "Incêndios", valor: 90 },
  { name: "Afogamentos", valor: 110 },
  { name: "Outros", valor: 45 },
];

const dataRegiao = [
  { dia: "SEG", COM: 60, COInter1: 80, COInter2: 40 },
  { dia: "TER", COM: 30, COInter1: 50, COInter2: 65 },
  { dia: "QUA", COM: 90, COInter1: 85, COInter2: 30 },
  { dia: "QUI", COM: 70, COInter1: 110, COInter2: 80 },
  { dia: "SEX", COM: 120, COInter1: 70, COInter2: 50 },
  { dia: "SÁB", COM: 80, COInter1: 115, COInter2: 15 },
  { dia: "DOM", COM: 95, COInter1: 60, COInter2: 100 },
];

const dataTurno = [
  { name: "Noite", value: 10000, color: "var(--primary-dark)" },
  { name: "Tarde", value: 4000, color: "var(--status-in-progress)" },
  { name: "Manhã", value: 2000, color: "var(--status-closed)" },
];

interface MetricCardProps {
  title: string;
  value: string;
  unit?: string;
  isPrimary?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  isPrimary = false,
}) => (
  <div
    className={`${styles.metricCard} ${
      isPrimary ? styles.metricCardPrimary : ""
    }`}
  >
    {isPrimary && <div className={styles.pBadge}>P</div>}
    <span className={styles.metricTitle}>{title}</span>
    <div className={styles.metricValueGroup}>
      <span className={styles.metricValue}>{value}</span>
      {unit && <span className={styles.metricUnit}>{unit}</span>}
    </div>
  </div>
);

interface VisualizationPanelProps {
  title: string;
  children: React.ReactNode;
  fullWidth?: boolean;
}

const VisualizationPanel: React.FC<VisualizationPanelProps> = ({
  title,
  children,
  fullWidth = false,
}) => (
  <div
    className={`${styles.visualizationPanel} ${
      fullWidth ? styles.panelFullWidth : ""
    }`}
  >
    <h2 className={styles.panelTitle}>{title}</h2>
    <div className={styles.panelContent}>{children}</div>
  </div>
);

function DashboardAdmin(): JSX.Element {
  const navigate = useNavigate();
  const [isFilterActive, setIsFilterActive] = useState(false);

  const totalOcorrencias = "530";
  const ocorrenciasAbertas = "30";
  const resolvidas = "500";

  const handleMenuItemClick = (path: string) => {
    navigate(path);
  };

  const handleFilterClick = () => {
    setIsFilterActive(!isFilterActive);
  };

  return (
    <div className={styles.appContainer}>
      <div className={styles.sidebar}>
        <div className={styles.logoSection}>
          <span className={styles.logoText}>
            <img src={LogoSvg} alt="Sirene" className={styles.logoImage} />
            Sirene
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
              />
            </div>

            <button
              className={`${styles.filterButton} ${
                isFilterActive ? styles.filterButtonActive : ""
              }`}
              onClick={handleFilterClick}
            >
              <SlidersHorizontal size={18} />
              Filtro
            </button>
          </div>
        </div>

        <div className={styles.metricCardsContainer}>
          <MetricCard title="Total de Ocorrências" value={totalOcorrencias} />
          <MetricCard title="Ocorrências Abertas" value={ocorrenciasAbertas} />
          <MetricCard title="Resolvidas" value={resolvidas} />
          <MetricCard
            title="Tempo Médio de Resposta"
            value="17"
            unit="min"
            isPrimary={true}
          />
        </div>

        <div className={styles.dashboardGrid}>
          <div className={styles.dashboardRow}>
            <VisualizationPanel title="Ocorrências por turno">
              <div className={styles.turnoChartContainer}>
                <div style={{ width: "150px", height: "150px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dataTurno}
                        dataKey="value"
                        innerRadius={60}
                        outerRadius={75}
                        paddingAngle={2}
                        labelLine={false}
                      >
                        {dataTurno.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <ul className={styles.turnoLegend}>
                  {dataTurno.map((item, index) => (
                    <li key={index} className={styles.turnoLegendItem}>
                      <span
                        style={{ backgroundColor: item.color }}
                        className={styles.legendDot}
                      ></span>
                      {item.name}{" "}
                      <span className={styles.legendValue}>
                        {item.value / 1000 + "K"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </VisualizationPanel>

            <VisualizationPanel title="Ocorrências por Tipo">
              <div style={{ width: "100%", height: 280, padding: "1rem 0" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dataTipo}
                    margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                  >
                    <XAxis dataKey="name" style={{ fontSize: "10px" }} />
                    <YAxis style={{ fontSize: "10px" }} />
                    <Tooltip />
                    <Bar dataKey="valor" fill="#550D08" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </VisualizationPanel>
          </div>

          <VisualizationPanel title="Ocorrências por região" fullWidth={true}>
            <div className={styles.regionLegend}>
              <span>
                <span
                  style={{ backgroundColor: "var(--status-closed)" }}
                  className={styles.legendDot}
                ></span>{" "}
                Comando Operacional Metropolitano (COM)
              </span>
              <span>
                <span
                  style={{ backgroundColor: "var(--status-in-progress)" }}
                  className={styles.legendDot}
                ></span>{" "}
                Comando Operacional do Interior I (COInter/I)
              </span>
              <span>
                <span
                  style={{ backgroundColor: "#007bff" }}
                  className={styles.legendDot}
                ></span>{" "}
                Comando Operacional do Interior II (COInter/2)
              </span>
            </div>

            <div style={{ width: "100%", height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dataRegiao}
                  margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                >
                  <XAxis dataKey="dia" style={{ fontSize: "10px" }} />
                  <YAxis style={{ fontSize: "10px" }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="COM"
                    stroke="var(--status-closed)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="COInter1"
                    stroke="var(--status-in-progress)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="COInter2"
                    stroke="#007bff"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </VisualizationPanel>
        </div>
      </div>
    </div>
  );
}

export default DashboardAdmin;
