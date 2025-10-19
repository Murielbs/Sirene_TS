import React, { type JSX } from 'react';
import { LayoutDashboard, Users, FileText, BarChart, Settings, LogOut, ChevronLeft, MapPin } from 'lucide-react';
import styles from './visualizacao.module.css'; 
import { useNavigate } from 'react-router-dom';


interface DetalheOcorrenciaData {
    id: number;
    status: string;
    tipo: string;
    prioridade: string;
    dataHora: string;
    criadoPor: string;
    localizacaoEndereco: string;
    localizacaoImagem: string; 
}

const mockDetalhe: DetalheOcorrenciaData = {
    id: 202530,
    status: 'Em aberto',
    tipo: 'Acidente',
    prioridade: 'Alta',
    dataHora: '02/02/2025 09:30',
    criadoPor: 'Marina Sena',
    localizacaoEndereco: 'Av Gov. Agamenon Magalhães - Recife, PE',
    localizacaoImagem: 'URL_DA_IMAGEM_DO_MAPA_AQUI' 
};

interface DetailItemProps {
    label: string;
    value: string;
    isStatus?: boolean;
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value, isStatus = false }) => {
    let statusClass = '';
    if (isStatus) {
        switch (value) {
            case 'Em aberto': statusClass = styles.detailStatusOpen; break;
            case 'Fechado': statusClass = styles.detailStatusClosed; break;
            case 'Andamento': statusClass = styles.detailStatusInProgress; break;
            default: break;
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
    const data = mockDetalhe;
    
    const handleMenuItemClick = (path: string) => {
        navigate(path);
    };

    return (
        <div className={styles.appContainer}>
            
            <div className={styles.sidebar}>
                <div className={styles.logoSection}>
                    <div className={styles.sLogo}>S</div> 
                </div>

                <nav className={styles.navMenu}>
                    
                    <div className={styles.navItem} onClick={() => handleMenuItemClick('/Inicial')}>
                        <div className={styles.navIcon}><LayoutDashboard size={20} /></div>
                        <span className={styles.navText}>Pagina inicial</span>
                    </div>

                    <div className={`${styles.navItem} ${styles.navActive}`} onClick={() => handleMenuItemClick('/Ocorrencias')}>
                        <div className={styles.navIcon}><FileText size={20} /></div>
                        <span className={styles.navText}>Lista de ocorrências</span>
                    </div>

                    <div className={styles.navItem} onClick={() => handleMenuItemClick('/dashboard')}>
                        <div className={styles.navIcon}><BarChart size={20} /></div>
                        <span className={styles.navText}>Dashboard</span>
                    </div>

                    <div className={styles.navItem} onClick={() => handleMenuItemClick('/GestaoUsuario')}>
                        <div className={styles.navIcon}><Users size={20} /></div>
                        <span className={styles.navText}>Gestão de usuários</span>
                    </div>
                
                    <div className={styles.navItem} onClick={() => handleMenuItemClick('/auditoria')}>
                        <div className={styles.navIcon}><BarChart size={20} /></div>
                        <span className={styles.navText}>Auditoria e logs</span>
                    </div>

                    <div className={styles.navItem} onClick={() => handleMenuItemClick('/configuracao')}>
                        <div className={styles.navIcon}><Settings size={20} /></div>
                        <span className={styles.navText}>Configuração</span>
                    </div>
                </nav>

                <div className={styles.navItem} onClick={() => handleMenuItemClick('/')}>
                    <LogOut size={20} className={styles.navIcon} />
                    <span className={styles.navText}>Sair</span>
                </div>
            </div>

            <div className={styles.mainContent}>
                
                <div className={styles.detailHeader}>
                    <a className={styles.backLink} onClick={() => navigate('/Ocorrencias')}>
                        <ChevronLeft size={14} /> Voltar para a lista
                    </a>
                    <h1 className={styles.detailTitle}>Visualização de detalhe</h1>
                    <span className={styles.detailSubtitle}>{data.id}</span>
                </div>

                <div className={styles.detailGrid}>
                    
                    <div className={styles.detailCard}>
                        <div className={styles.detailInfoList}>
                            <DetailItem label="Status" value={data.status} isStatus={true} />
                            <DetailItem label="Tipo" value={data.tipo} />
                            <DetailItem label="Prioridade" value={data.prioridade} />
                            <DetailItem label="Data/Hora" value={data.dataHora} />
                            <DetailItem label="Criado por" value={data.criadoPor} />
                        </div>
                    </div>

                    
                    <div className={styles.detailLocationCard}>
                        <h2 className={styles.locationTitle}>Localização</h2>
                        <div className={styles.mapPlaceholder}>
                             {/* Conteúdo do mapa aqui */}
                        </div>
                        <div className={styles.locationFooter}>
                            <MapPin size={16} className={styles.locationIcon}/>
                            <span className={styles.locationAddress}>{data.localizacaoEndereco}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetalheOcorrencia;