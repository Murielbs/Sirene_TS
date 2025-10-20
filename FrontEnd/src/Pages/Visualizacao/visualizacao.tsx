import React, { useEffect, useState, type JSX, useRef } from "react";
import { ChevronLeft, MapPin, Download, Image as ImageIcon } from "lucide-react";
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

// Importação alterada para incluir AdvancedMarkerElement
import { GoogleMap, useLoadScript, Libraries } from "@react-google-maps/api";
// Nota: O AdvancedMarkerElement é geralmente acessado pela instância do mapa, 
// mas usaremos useRef para acessá-lo no useEffect, conforme o guia de migração.

// --- DADOS E COORDENADAS FIXAS ---
const MAP_API_KEY = "SUA_CHAVE_DE_API_GOOGLE";
const CASA_FORTE_COORDS = { lat: -8.0335, lng: -34.9080 };
const MAP_CONTAINER_STYLE = {
    width: '100%',
    height: '200px'
};

// 1. CORREÇÃO DE PERFORMANCE: Libraries como constante fora do componente
const libraries: Libraries = ["places", "marker"]; 
// ----------------------------------

interface TimelineItem {
  id: number;
  data: string;
  hora: string;
  descricao: string;
}

interface MidiaItem {
  id: number;
  tipo: 'imagem' | 'documento';
  url: string;
}

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

const mockTimeline: TimelineItem[] = [
    { id: 1, data: "15/02/2023", hora: "09:30", descricao: "Ocorrência registrada por João Silva" },
    { id: 2, data: "15/02/2023", hora: "09:30", descricao: "Encaminhada para equipe de manutenção" },
    { id: 3, data: "15/02/2023", hora: "09:30", descricao: "Equipe designada: Equipe bravo" },
    { id: 4, data: "15/02/2023", hora: "09:30", descricao: "Ocorrência Em andamento" },
];

const mockMidia: MidiaItem[] = [
    { id: 1, tipo: 'imagem', url: '' },
    { id: 2, tipo: 'imagem', url: '' },
    { id: 3, tipo: 'documento', url: '' },
];

const TimelineItemDisplay: React.FC<{ item: TimelineItem }> = ({ item }) => (
    <div className={styles.timelineItem}>
        <div className={styles.timelineDot} />
        <div className={styles.timelineContent}>
            <p className={styles.timelineDescription} dangerouslySetInnerHTML={{ __html: item.descricao }} />
            <p className={styles.timelineDateTime}>{item.data} {item.hora}</p>
        </div>
    </div>
);

const MidiaItemPlaceholder: React.FC<{ item: MidiaItem }> = ({ item }) => (
    <div className={styles.midiaPlaceholder}>
        {item.tipo === 'imagem' ? (
            <ImageIcon size={30} color="#999" />
        ) : (
            <Download size={30} color="#999" />
        )}
    </div>
);

// --- COMPONENTE: RENDERIZA O MAPA (COM CORREÇÕES) ---
const RealTimeMap: React.FC = () => {
    // 2. CORREÇÃO DO MARKER E PERFORMANCE: 
    // Removemos a dependência de 'libraries' do useLoadScript
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: MAP_API_KEY,
        libraries: libraries, // Usa a constante definida fora do componente
    });
    
    // Ref para a instância do mapa
    const mapRef = useRef<google.maps.Map | null>(null);

    // Adiciona o AdvancedMarkerElement após o mapa carregar
    useEffect(() => {
        if (isLoaded && mapRef.current) {
            const map = mapRef.current;
            
            // Verifica se a API de Marcadores Avançados está carregada
            if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
                // Cria o AdvancedMarkerElement
                new google.maps.marker.AdvancedMarkerElement({
                    map: map,
                    position: CASA_FORTE_COORDS,
                    title: 'Local da Ocorrência'
                });
            }
        }
    }, [isLoaded]);

    const onLoad = React.useCallback(function callback(mapInstance: google.maps.Map) {
        mapRef.current = mapInstance;
    }, []);

    const onUnmount = React.useCallback(function callback() {
        mapRef.current = null;
    }, []);

    if (loadError) return <div className={styles.mapError}>Erro ao carregar o mapa.</div>;
    if (!isLoaded) return <div className={styles.mapLoading}>Carregando Mapa...</div>;

    return (
        <GoogleMap
            mapContainerStyle={MAP_CONTAINER_STYLE}
            center={CASA_FORTE_COORDS}
            zoom={15}
            options={{ disableDefaultUI: true, zoomControl: true }}
            onLoad={onLoad}
            onUnmount={onUnmount}
        >
            {/* O Marker agora é criado via useEffect (AdvancedMarkerElement) */}
        </GoogleMap>
    );
};
// ------------------------------------------

function DetalheOcorrencia(): JSX.Element {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState<DetalheOcorrenciaData | null>({
      id: "68f56b9ad5bdeb5da2147841",
      status: "Fechado", 
      tipo: "RESGATE",    
      prioridade: "alta",  
      dataHora: "19/10/2025, 19:52",
      criadoPor: "Ana Carolina", 
      localizacaoEndereco: "Recife, Casa forte",
      descricao: "Acidente de trânsito envolvendo um carro e uma moto, resultando em três vítimas, duas das quais em estado grave e uma em estado não grave.",
  });

  const handleGoBack = () => {
    navigate(-1); 
  };

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
          if (ss.includes("open") || ss.includes("aberto") || ss.includes("aberta") || ss.includes("pend")) return "Em aberto";
          if (ss.includes("progress") || ss.includes("andament") || ss.includes("in_progress") || ss.includes("em_andamento")) return "Andamento";
          if (ss.includes("close") || ss.includes("fech") || ss.includes("conclu") || ss.includes("closed")) return "Fechado";
          return "Em aberto";
        };

        const criadoFromApi = body?.criadoPor ?? o?.criadoPor;
        const criadoFallback = o?.assinatura_digital || o?.assinaturaDigital || o?.responsavel || undefined;

        const cidade = o?.cidade || o?.localizacao?.cidade || undefined;
        const bairro = o?.bairro || o?.localizacao?.bairro || undefined;
        const localGps = o?.localizacao_gps || o?.localizacaoGps || o?.localizacao?.gps || undefined;
        
        const apiEndereco = [cidade, bairro, localGps].filter(Boolean).join(", ");

        setData({
          id: String(o?.id ?? o?._id ?? ""),
          status: normalizeStatus(body?.status ?? o?.status),
          tipo: o?.tipoOcorrencia || o?.tipo || o?.descricao || undefined,
          prioridade: o?.prioridade || undefined,
          dataHora: dateStr,
          criadoPor: criadoFromApi ?? criadoFallback ?? undefined,
          localizacaoEndereco: apiEndereco || "Recife, Casa forte", 
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
        
        <div className={styles.pageHeader}>
            <a
                className={styles.backLink}
                onClick={handleGoBack}
            >
                <ChevronLeft size={14} /> Voltar para a lista
            </a>
        </div>
        <div className={styles.detailTitleContainer}>
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
            
            <div className={styles.mapContainer}>
              <RealTimeMap />
            </div>
            
            <div className={styles.locationFooter}>
              <MapPin size={16} className={styles.locationIcon} />
              <span className={styles.locationAddress}>
                Recife, Casa forte
              </span>
            </div>
          </div>
        </div>

        <div className={styles.detailDescription}>
            <h2 className={styles.descriptionTitle}>Descrição</h2>
            <p>{data?.descricao ?? "Nenhuma descrição disponível."}</p>
        </div>
        
        <div className={styles.timelineMediaContainer}>
            
            <div className={styles.timelineSection}>
                <h2 className={styles.timelineTitle}>Timeline</h2>
                <div className={styles.timelineList}>
                    {mockTimeline.map(item => (
                        <TimelineItemDisplay key={item.id} item={item} />
                    ))}
                </div>
            </div>

            <div className={styles.mediaSection}>
                <h2 className={styles.mediaTitle}>Mídia</h2>
                <div className={styles.mediaGrid}>
                    {mockMidia.map(item => (
                        <MidiaItemPlaceholder key={item.id} item={item} />
                    ))}
                </div>
                <button className={styles.downloadButton}>
                    <Download size={16} /> Baixar anexo
                </button>
            </div>
        </div>
        
      </div>
    </div>
  );
}

export default DetalheOcorrencia;