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

interface MetricCardProps {
  title: string;
  value: string;
  unit?: string;
  isSpecial?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  isSpecial = false,
}) => (
  <div
    className={`${styles.metricCard} ${isSpecial ? styles.specialCard : ""}`}
  >
    <span className={styles.metricTitle}>{title}</span>
    <div className={styles.metricValueGroup}>
      {isSpecial && (
        <div className={styles.specialIcon}>
          <span className={styles.specialIconText}>P</span>
        </div>
      )}
      <span className={styles.metricValue}>{value}</span>
      {unit && <span className={styles.metricUnit}>{unit}</span>}
    </div>
  </div>
);

type ChartProps = { ocorrencias: Ocorrencia[] };

const OcorrenciasPorTurnoChart: React.FC<ChartProps> = ({ ocorrencias }) => {
  const counts = { manha: 0, tarde: 0, noite: 0, desconhecido: 0 };
  ocorrencias.forEach((o) => {
    const dt = o.dataHora ? new Date(o.dataHora) : null;
    if (!dt || Number.isNaN(dt.getTime())) {
      counts.desconhecido++;
      return;
    }
    const h = dt.getHours();
    if (h >= 6 && h < 12) counts.manha++;
    else if (h >= 12 && h < 18) counts.tarde++;
    else counts.noite++;
  });

  const colors = ['#FF5733', '#d9232f', '#550d08'];
  const legendItems = [
    { label: 'Manhã', count: counts.manha, color: colors[0] },
    { label: 'Tarde', count: counts.tarde, color: colors[1] },
    { label: 'Noite', count: counts.noite, color: colors[2] },
  ];
  const segments = legendItems.filter((i) => i.count > 0);
  const total = segments.reduce((acc, cur) => acc + cur.count, 0);

  // Gera gradiente dinâmico apenas com segmentos > 0
  let start = 0;
  const stops: string[] = [];
  segments.forEach((seg) => {
    const pct = total > 0 ? (seg.count / total) * 100 : 0;
    const end = start + pct;
    stops.push(`${seg.color} ${start}% ${end}%`);
    start = end;
  });
  const donutBackground = total > 0
    ? `conic-gradient(${stops.join(', ')})`
    : 'conic-gradient(#e9ecef 0% 100%)';

  return (
    <div className={styles.chartCard}>
      <h3 className={styles.chartTitle}>Ocorrências por turno</h3>
      <div className={styles.chartContent}>
        <div className={styles.radialChartPlaceholder}>
          <div className={styles.chartDonut} style={{ background: donutBackground }} />
          <div className={styles.chartLegend}>
            {legendItems.map(item => (
              <div className={styles.legendItem} key={item.label}>
                <span style={{ backgroundColor: item.color }}></span> {item.label} ({item.count})
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const OcorrenciasPorTipoChart: React.FC<ChartProps> = ({ ocorrencias }) => {
  const counts: Record<string, number> = {};

  // Normaliza o rótulo do tipo para exibição
  function normalizeTipoLabel(raw?: string): string {
    if (!raw) return 'Não classificado';
    const v = raw.toString().trim().toLowerCase();
    const map: Record<string, string> = {
      incendio: 'Incêndio',
      incêndio: 'Incêndio',
      acidente: 'Acidente',
      salvamento: 'Salvamento',
      outros: 'Outros',
      outro: 'Outros',
    };
    if (map[v]) return map[v];
    // Capitaliza primeira letra e substitui _ por espaço
    return v.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }

  ocorrencias.forEach((o) => {
    const raw = (o.tipoOcorrencia ?? o.tipo ?? '').toString();
    const key = normalizeTipoLabel(raw);
    counts[key] = (counts[key] || 0) + 1;
  });

  const items = Object.entries(counts)
    .filter(([_, valor]) => valor > 0)
    .sort((a, b) => b[1] - a[1]);

  return (
    <div className={styles.chartCard}>
      <h3 className={styles.chartTitle}>Ocorrências por Tipo</h3>
      <div className={styles.chartContent}>
        <div className={styles.barChartPlaceholder}>
          {items.map(([tipo, valor]) => (
            <div key={tipo} className={styles.barGroup}>
              <div
                style={{
                  height: `${Math.min(100, Math.max(10, (valor / (ocorrencias.length || 1)) * 100))}%`,
                  backgroundColor: '#D9232F',
                }}
              ></div>
              <p>{tipo} ({valor})</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const OcorrenciasPorRegiaoChart: React.FC<ChartProps> = ({ ocorrencias }) => {
  const counts: Record<string, number> = {};
  ocorrencias.forEach((o) => {
    const key = (o.regiao || 'Sem Região').toString();
    counts[key] = (counts[key] || 0) + 1;
  });

  const items = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  return (
    <div className={styles.chartCardFull}>
      <h3 className={styles.chartTitle}>Ocorrências por região</h3>
      <div className={styles.chartContent}>
        <div className={styles.lineChartPlaceholder}>
          <div className={styles.lineChartLegend}>
            {items.slice(0, 6).map(([regiao, valor]) => (
              <div key={regiao} className={styles.legendItem}><span style={{ backgroundColor: '#D9232F' }}></span> {regiao} ({valor})</div>
            ))}
          </div>

          <div className={styles.lineChartArea}>
            <p className={styles.lineChartAxisLabel}>{Math.max(...items.map(i => i[1]), 0)}</p>
          </div>
          <div className={styles.lineChartAxisX}>
            {items.slice(0, 7).map(i => <p key={i[0]}>{i[0].slice(0,6)}</p>)}
          </div>
        </div>
      </div>
    </div>
  );
};

function DashboardAdmin(): JSX.Element {
  const navigate = useNavigate();

  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOcorrencias = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

  const res = await apiFetch('/api/ocorrencia', { headers });
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Erro ${res.status}: ${errorText}` || 'Erro ao buscar ocorrências');
        }
        const data = await res.json();
        
        const list: Ocorrencia[] = Array.isArray(data) ? data : (data.data || data.ocorrencias || []);
        setOcorrencias(list);
      } catch (err: any) {
        console.error('Erro ao buscar ocorrências:', err);
        setError(err.message || 'Ocorreu um erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchOcorrencias();
  }, []);

  const totalOcorrencias = ocorrencias.length;
  const ocorrenciasAbertas = ocorrencias.filter((o) => o.status && o.status.toLowerCase() === 'aberta').length;
  const ocorrenciasResolvidas = ocorrencias.filter((o) => o.status && (o.status.toLowerCase() === 'resolvida' || o.status.toLowerCase() === 'fechada' || o.status.toLowerCase() === 'concluida')).length;
  const tempoMedioResposta = "—"; // Placeholder

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
            onClick={() => handleMenuItemClick("/Conniguracoes")}
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
        <h1 className={styles.pageTitle}></h1>

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

            <button className={styles.filterButton}>
              <SlidersHorizontal size={18} />
              Filtro
            </button>
          </div>
        </div>

        <div className={styles.metricCardsContainer}>
          {loading ? (
            <p>Carregando...</p>
          ) : error ? (
            <p className={styles.errorMessage}>{error}</p>
          ) : (
            <>
              <MetricCard
                title="Total de Ocorrências"
                value={totalOcorrencias.toString()}
              />
              <MetricCard
                title="Ocorrências Abertas"
                value={ocorrenciasAbertas.toString()}
              />
              <MetricCard
                title="Resolvidos"
                value={ocorrenciasResolvidas.toString()}
              />
              <MetricCard
                title="Tempo Médio de Resposta"
                value={tempoMedioResposta}
              />
            </>
          )}
        </div>

        <div className={styles.chartsGrid}>
          <OcorrenciasPorTurnoChart ocorrencias={ocorrencias} />
          <OcorrenciasPorTipoChart ocorrencias={ocorrencias} />
        </div>

        <div className={styles.chartFullWidth}>
          <OcorrenciasPorRegiaoChart ocorrencias={ocorrencias} />
        </div>
      </div>
    </div>
  );
}

export default DashboardAdmin;
