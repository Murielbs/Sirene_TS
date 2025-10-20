import React, { useState, type JSX } from "react";
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
  tipo: string;
  criadoPor?: string;
  regiao: string;
  dataHora: string;
  status: string;
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

const MetricCard: React.FC<MetricCardProps> = ({ title, value, unit, isSpecial = false }) => (
  <div className={`${styles.metricCard} ${isSpecial ? styles.specialCard : ''}`}>
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


const OcorrenciasPorTurnoChart: React.FC = () => (
  <div className={styles.chartCard}>
    <h3 className={styles.chartTitle}>Ocorrências por turno</h3>
    <div className={styles.chartContent}>
      
      <div className={styles.radialChartPlaceholder}>
        <div className={styles.chartDonut}></div>
        <div className={styles.chartLegend}>
          <div className={styles.legendItem}><span style={{ backgroundColor: '#D9232F' }}></span> Noite</div>
          <div className={styles.legendItem}><span style={{ backgroundColor: '#5C5C5C' }}></span> Tarde</div>
          <div className={styles.legendItem}><span style={{ backgroundColor: '#212121' }}></span> Manhã</div>
          <div className={styles.legendItem}><span style={{ backgroundColor: '#212121' }}></span> 10K</div>
          <div className={styles.legendItem}><span style={{ backgroundColor: '#D9232F' }}></span> 4K</div>
          <div className={styles.legendItem}><span style={{ backgroundColor: '#212121' }}></span> 2K</div>
        </div>
      </div>
    </div>
  </div>
);

const OcorrenciasPorTipoChart: React.FC = () => (
  <div className={styles.chartCard}>
    <h3 className={styles.chartTitle}>Ocorrências por Tipo</h3>
    <div className={styles.chartContent}>
      
      <div className={styles.barChartPlaceholder}>
         
         <div className={styles.barGroup}>
            <div style={{ height: '70%' }}></div>
            <p>Vazamentos</p>
         </div>
         <div className={styles.barGroup}>
            <div style={{ height: '95%' }}></div>
            <p>Acidentes</p>
         </div>
         <div className={styles.barGroup}>
            <div style={{ height: '50%' }}></div>
            <p>Resgates</p>
         </div>
         <div className={styles.barGroup}>
            <div style={{ height: '75%' }}></div>
            <p>Incêndios</p>
         </div>
         <div className={styles.barGroup}>
            <div style={{ height: '80%' }}></div>
            <p>Afogamentos</p>
         </div>
         <div className={styles.barGroup}>
            <div style={{ height: '30%' }}></div>
            <p>Outros</p>
         </div>
      </div>
    </div>
  </div>
);

const OcorrenciasPorRegiaoChart: React.FC = () => (
  <div className={styles.chartCardFull}>
    <h3 className={styles.chartTitle}>Ocorrências por região</h3>
    <div className={styles.chartContent}>
      
      <div className={styles.lineChartPlaceholder}>
         
         <div className={styles.lineChartLegend}>
            <div className={styles.legendItem}><span style={{ backgroundColor: '#D9232F' }}></span> Comando Operacional Metropolitano (COM)</div>
            <div className={styles.legendItem}><span style={{ backgroundColor: '#629FEE' }}></span> Comando Operacional do Interior /1 (COInter/I)</div>
            <div className={styles.legendItem}><span className={styles.legendLine} style={{ backgroundColor: '#F98C4E' }}></span> Comando Operacional do Interior /2 (COInter/2)</div>
         </div>
         
         <div className={styles.lineChartArea}>
            <p className={styles.lineChartAxisLabel}>150</p>
            <p className={styles.lineChartAxisLabel}>100</p>
            <p className={styles.lineChartAxisLabel}>50</p>
            <p className={styles.lineChartAxisLabel}>10</p>
         </div>
         <div className={styles.lineChartAxisX}>
            <p>SEG</p>
            <p>TER</p>
            <p>QUA</p>
            <p>QUI</p>
            <p>SEX</p>
            <p>SÁB</p>
            <p>DOM</p>
         </div>
      </div>
    </div>
  </div>
);


function DashboardAdmin(): JSX.Element {
  const navigate = useNavigate();
  
  const totalOcorrencias = 530;
  const ocorrenciasAbertas = 30;
  const ocorrenciasResolvidas = 500;
  const tempoMedioResposta = "17min";

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
        <h1 className={styles.pageTitle}>Dashboard-ADMIN</h1>

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
              className={styles.filterButton}
            >
              <SlidersHorizontal size={18} />
              Filtro
            </button>
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
            title="Resolvidos"
            value={ocorrenciasResolvidas.toString()}
          />
          <MetricCard
            title="Tempo Médio de Resposta"
            value={tempoMedioResposta}
          />
        </div>

        <div className={styles.chartsGrid}>
          <OcorrenciasPorTurnoChart />
          <OcorrenciasPorTipoChart />
        </div>

        <div className={styles.chartFullWidth}>
          <OcorrenciasPorRegiaoChart />
        </div>
      </div>
    </div>
  );
}

export default DashboardAdmin;