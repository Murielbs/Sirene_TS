import React, { useState, useEffect, type JSX } from "react";
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

// Dados serão populados pela API

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
  const [totalOcorrencias, setTotalOcorrencias] = useState(0);
  const [ocorrenciasAbertas, setOcorrenciasAbertas] = useState(0);
  const [resolvidas, setResolvidas] = useState(0);

  const [dataTipo, setDataTipo] = useState<{ name: string; valor: number }[]>(
    []
  );
  const [dataRegiao, setDataRegiao] = useState<any[]>([
    { dia: "SEG", COM: 0, COInter1: 0, COInter2: 0 },
    { dia: "TER", COM: 0, COInter1: 0, COInter2: 0 },
    { dia: "QUA", COM: 0, COInter1: 0, COInter2: 0 },
    { dia: "QUI", COM: 0, COInter1: 0, COInter2: 0 },
    { dia: "SEX", COM: 0, COInter1: 0, COInter2: 0 },
    { dia: "SÁB", COM: 0, COInter1: 0, COInter2: 0 },
    { dia: "DOM", COM: 0, COInter1: 0, COInter2: 0 },
  ]);
  const [dataTurno, setDataTurno] = useState<any[]>([
    { name: "Noite", value: 0, color: "var(--primary-dark)" },
    { name: "Tarde", value: 0, color: "var(--status-in-progress)" },
    { name: "Manhã", value: 0, color: "var(--status-closed)" },
  ]);

  // Manhã: 06:00 - 11:59
  // Tarde: 12:00 - 17:59
  // Noite: 18:00 - 05:59
  const getTurnoFromDate = (d: Date) => {
    const h = d.getHours();
    if (h >= 6 && h <= 11) return "Manhã";
    if (h >= 12 && h <= 17) return "Tarde";
    return "Noite"; // 18-23 e 0-5
  };

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");
    const API_BASE =
      (typeof import.meta !== "undefined"
        ? (import.meta as any).env?.VITE_API_URL
        : "") || "";
    const base = API_BASE ? API_BASE.replace(/\/$/, "") : "";
    const url = `${base}/api/ocorrencia`;
    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const body = await res.json();
      const list = body?.data || body?.ocorrencias || body || [];

      // reset counters
      let total = 0;
      let abertas = 0;
      let concluidas = 0;

      const tipoMap: Record<string, number> = {};

      const regionWeek = [0, 0, 0, 0, 0, 0, 0].map(() => ({
        COM: 0,
        COInter1: 0,
        COInter2: 0,
      }));

      const turnoCounts: Record<string, number> = {
        Manhã: 0,
        Tarde: 0,
        Noite: 0,
      };

      (Array.isArray(list) ? list : []).forEach((o: any) => {
        total += 1;
        const rawStatus = String(o?.status ?? "").toLowerCase();
        const status =
          !rawStatus ||
          rawStatus === "open" ||
          rawStatus === "aberta" ||
          rawStatus === "aberto"
            ? "Em aberto"
            : rawStatus.includes("in_progress") ||
              rawStatus.includes("andamento")
            ? "Andamento"
            : rawStatus.includes("closed") ||
              rawStatus.includes("fech") ||
              rawStatus.includes("conclu")
            ? "Fechado"
            : "Em aberto";

        if (status === "Em aberto") abertas += 1;
        if (status === "Fechado") concluidas += 1;

        const tipo = o.tipoOcorrencia || o.tipo || o.descricao || "Outros";
        tipoMap[tipo] = (tipoMap[tipo] || 0) + 1;

        // região: simplificação por valor em o.regiao ou o.cidade
        const reg = (o.regiao || o.cidade || "").toString().toLowerCase();
        // dia da semana
        const rawDate = o.data_hora || o.dataHora || o.data || o.created_at;
        const d = rawDate ? new Date(rawDate) : new Date();
        const day = d.getDay(); // 0 (domingo) - 6

        if (reg.includes("metrop") || reg.includes("com"))
          regionWeek[day].COM += 1;
        else if (reg.includes("interior") || reg.includes("cointer"))
          regionWeek[day].COInter1 += 1;
        else regionWeek[day].COInter2 += 1;

        // turno
        const turno = getTurnoFromDate(d);
        turnoCounts[turno] = (turnoCounts[turno] || 0) + 1;
      });

      setTotalOcorrencias(total);
      setOcorrenciasAbertas(abertas);
      setResolvidas(concluidas);

      setDataTipo(
        Object.keys(tipoMap).map((k) => ({ name: k, valor: tipoMap[k] }))
      );

      // montar dataRegiao no formato esperado
      const dias = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
      const regData = dias.map((label, i) => ({
        dia: label,
        ...regionWeek[i],
      }));
      setDataRegiao(regData as any[]);

      setDataTurno([
        {
          name: "Noite",
          value: turnoCounts["Noite"] || 0,
          color: "var(--primary-dark)",
        },
        {
          name: "Tarde",
          value: turnoCounts["Tarde"] || 0,
          color: "var(--status-in-progress)",
        },
        {
          name: "Manhã",
          value: turnoCounts["Manhã"] || 0,
          color: "var(--status-closed)",
        },
      ]);
    } catch (err) {
      console.error("Erro ao carregar dashboard:", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

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
          <MetricCard
            title="Total de Ocorrências"
            value={String(totalOcorrencias)}
          />
          <MetricCard
            title="Ocorrências Abertas"
            value={String(ocorrenciasAbertas)}
          />
          <MetricCard title="Resolvidas" value={String(resolvidas)} />
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
