import React, { useEffect, useState, type JSX } from "react";
import { ChevronLeft, MapPin } from "lucide-react";
import styles from "./visualizacao.module.css";
import { useNavigate, useParams } from "react-router-dom";
import PaginaIncialSvg from "../../img/PaginaIncial.svg";
import ListaOcorrenciaSvg from "../../img/ListaOcorrencia.svg";
import DashboardSvg from "../../img/Dashboard.svg";
import GestaoUsuarioSvg from "../../img/GestaoUsuario.svg";
import AuditoriaLogSvg from "../../img/AuditoriaLog.svg";
import ConfiguracaoSvg from "../../img/Configuracao.svg";
import SairSvg from "../../img/sair.svg";
import LogoSvg from "../../img/Logo.svg";

interface DetalheOcorrenciaData {
  id: string;
  status?: string;
  tipo?: string;
  prioridade?: string;
  dataHora?: string;
  criadoPor?: string;
  localizacaoEndereco?: string;
  localizacaoImagem?: string;
  descricao?: string;
}

interface DetailItemProps {
  label: string;
  value?: string;
  isStatus?: boolean;
}

const DetailItem: React.FC<DetailItemProps> = ({
  label,
  value = "—",
  isStatus = false,
}) => {
  let statusClass = "";
  if (isStatus) {
    switch (value) {
      case "Em aberto":
        statusClass = styles.detailStatusOpen;
        break;
      case "Fechado":
        statusClass = styles.detailStatusClosed;
        break;
      case "Andamento":
        statusClass = styles.detailStatusInProgress;
        break;
      default:
        break;
    }
  }

  return (
    <div className={styles.detailItem}>
      <span className={styles.detailLabel}>{label}</span>
      <span className={`${styles.detailValue} ${statusClass}`}>{value}</span>
    </div>
  );
};

function DetalheOcorrencia(): JSX.Element {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState<DetalheOcorrenciaData | null>(null);

  useEffect(() => {
    if (!id) return;
    const token = localStorage.getItem("token");
    const API_BASE =
      (typeof import.meta !== "undefined"
        ? (import.meta as any).env?.VITE_API_URL
        : "") || "";
    const base = API_BASE ? API_BASE.replace(/\/$/, "") : "";
    const url = `${base}/api/ocorrencia/${id}`;

    (async () => {
      try {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Resposta não OK: ${res.status}`);
        const body = await res.json();
        const o =
          body?.data || body || body?.ocorrencia || body?.ocorrencias?.[0];

        const rawDate = o?.data_hora || o?.dataHora || o?.created_at;
        const dateStr = rawDate
          ? new Date(rawDate).toLocaleString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : undefined;

        const normalizeStatus = (s: any) => {
          if (!s) return "Em aberto";
          const ss = String(s).toLowerCase();
          if (
            ss.includes("open") ||
            ss.includes("aberto") ||
            ss.includes("aberta") ||
            ss.includes("pend")
          )
            return "Em aberto";
          if (
            ss.includes("progress") ||
            ss.includes("andament") ||
            ss.includes("in_progress") ||
            ss.includes("em_andamento")
          )
            return "Andamento";
          if (
            ss.includes("close") ||
            ss.includes("fech") ||
            ss.includes("conclu") ||
            ss.includes("closed")
          )
            return "Fechado";
          return "Em aberto";
        };

        const criadoFromApi = body?.criadoPor ?? o?.criadoPor;
        const criadoFallback =
          o?.assinatura_digital ||
          o?.assinaturaDigital ||
          o?.responsavel ||
          undefined;

        const cidade = o?.cidade || o?.localizacao?.cidade || undefined;
        const bairro = o?.bairro || o?.localizacao?.bairro || undefined;
        const localGps =
          o?.localizacao_gps ||
          o?.localizacaoGps ||
          o?.localizacao?.gps ||
          undefined;

        setData({
          id: String(o?.id ?? o?._id ?? ""),
          status: normalizeStatus(body?.status ?? o?.status),
          tipo: o?.tipoOcorrencia || o?.tipo || o?.descricao || undefined,
          prioridade: o?.prioridade || undefined,
          dataHora: dateStr,
          criadoPor: criadoFromApi ?? criadoFallback ?? undefined,
          localizacaoEndereco: [cidade, bairro, localGps]
            .filter(Boolean)
            .join(", "),
          localizacaoImagem: o?.foto_url || o?.video_url || undefined,
          descricao: o?.descricao || undefined,
        });
      } catch (err) {
        console.error("Erro ao buscar detalhe da ocorrência:", err);
      }
    })();
  }, [id]);

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
        <div className={styles.detailHeader}>
          <a
            className={styles.backLink}
            onClick={() => navigate("/Ocorrencias")}
          >
            <ChevronLeft size={14} /> Voltar para a lista
          </a>
          <h1 className={styles.detailTitle}>Visualização de detalhe</h1>
          <span className={styles.detailSubtitle}>
            {data ? data.id : "Carregando..."}
          </span>
        </div>

        <div className={styles.detailGrid}>
          <div className={styles.detailCard}>
            <div className={styles.detailInfoList}>
              <DetailItem
                label="Status"
                value={data?.status ?? "—"}
                isStatus={true}
              />
              <DetailItem label="Tipo" value={data?.tipo ?? "—"} />
              <DetailItem label="Prioridade" value={data?.prioridade ?? "—"} />

              <DetailItem label="Data/Hora" value={data?.dataHora ?? "—"} />
              <DetailItem label="Criado por" value={data?.criadoPor ?? "—"} />
            </div>
          </div>

          <div className={styles.detailLocationCard}>
            <h2 className={styles.locationTitle}>Localização</h2>
            <div className={styles.mapPlaceholder}>
              {/* Conteúdo do mapa aqui */}
            </div>
            <div className={styles.locationFooter}>
              <MapPin size={16} className={styles.locationIcon} />
              <span className={styles.locationAddress}>
                {data?.localizacaoEndereco ?? "—"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalheOcorrencia;
