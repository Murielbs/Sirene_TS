import React, { useEffect, useState, type JSX } from "react";
import { apiFetch } from "../../lib/api";
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Key,
} from "lucide-react";
import LogoSvg from "../../img/Logo.svg";
import PaginaIncialSvg from "../../img/PaginaIncial.svg";
import ListaOcorrenciaSvg from "../../img/ListaOcorrencia.svg";
import DashboardSvg from "../../img/Dashboard.svg";
import GestaoUsuarioSvg from "../../img/GestaoUsuario.svg";
import AuditoriaLogSvg from "../../img/AuditoriaLog.svg";
import ConfiguracaoSvg from "../../img/Configuracao.svg";
import SairSvg from "../../img/sair.svg";
import styles from "./GestaoUsuario.module.css";
import { useNavigate } from "react-router-dom";

interface User {
  id: string; // ObjectId do MongoDB
  nome: string;
  cargo: string; // mapeado de "posto"
  numero: string; // mapeado de "numeroMilitar" ou "matricula"
  email: string;
  status: "Em serviço" | "Fora de serviço";
}

type ModalAction = "edit" | "delete" | "changePassword" | null;

interface ActionModalState {
  isOpen: boolean;
  action: ModalAction;
  user: User | null;
}

// ... sem mock: carregaremos da API

interface SimpleModalProps {
  onClose: () => void;
  action: ModalAction;
  user: User | null;
}

const ActionModal: React.FC<SimpleModalProps> = ({ onClose, action, user }) => {
  let title = "";
  let content = <p>Selecione uma ação.</p>;
  let primaryButtonText = "Confirmar";

  if (user) {
    if (action === "edit") {
      title = `Editar Usuário: ${user.nome}`;
      primaryButtonText = "Salvar Alterações";
      content = (
        <form className={styles.form}>
          <input
            type="text"
            placeholder="Nome"
            defaultValue={user.nome}
            required
          />
          <input
            type="text"
            placeholder="Posto"
            defaultValue={user.cargo}
            required
          />
          <input
            type="text"
            placeholder="Número"
            defaultValue={user.numero}
            required
          />
          <input
            type="email"
            placeholder="Email"
            defaultValue={user.email}
            required
          />
          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.botaoCancelar}
              onClick={onClose}
            >
              CANCELAR
            </button>
            <button type="submit" className={styles.botaoAvancar}>
              {primaryButtonText}
            </button>
          </div>
        </form>
      );
    } else if (action === "delete") {
      title = "Excluir Usuário";
      primaryButtonText = "Excluir Permanentemente";
      content = (
        <div>
          <p>
            Tem certeza que deseja excluir o usuário{" "}
            <strong>{user.nome}</strong>? Esta ação é irreversível.
          </p>
          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.botaoCancelar}
              onClick={onClose}
            >
              CANCELAR
            </button>
            <button
              type="button"
              className={`${styles.botaoAvancar} ${styles.buttonDanger}`}
            >
              {primaryButtonText}
            </button>
          </div>
        </div>
      );
    } else if (action === "changePassword") {
      title = `Alterar Senha de ${user.nome}`;
      primaryButtonText = "Salvar Nova Senha";
      content = (
        <form className={styles.form}>
          <input type="password" placeholder="Nova Senha" required />
          <input type="password" placeholder="Confirmar Nova Senha" required />
          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.botaoCancelar}
              onClick={onClose}
            >
              CANCELAR
            </button>
            <button type="submit" className={styles.botaoAvancar}>
              {primaryButtonText}
            </button>
          </div>
        </form>
      );
    }
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>{title}</h2>
        {content}
      </div>
    </div>
  );
};

// NOVO MODAL: Multi-etapas para cadastro de usuário
interface NewUserModalProps {
  onClose: () => void;
  onCreated?: () => void;
}

const NewUserModal: React.FC<NewUserModalProps> = ({ onClose, onCreated }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const [form, setForm] = useState({
    nome: "",
    matricula: "",
    cpf: "",
    numeroMilitar: "",
    posto: "",
    email: "",
    senha: "",
    perfilAcesso: "MILITAR",
  });
  const [confirmSenha, setConfirmSenha] = useState("");

  const renderPassos = () => (
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
  );

  const renderStepContent = (step: number): JSX.Element => {
    switch (step) {
      case 1:
        return (
          <div className={styles.modalFormPasso}>
            <div className={styles.formRowTwoColumns}>
              <div className={styles.formGroup}>
                <label>Nome Completo</label>
                <input
                  type="text"
                  className={styles.modalInput}
                  placeholder="Nome completo"
                  required
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Email</label>
                <input
                  type="email"
                  className={styles.modalInput}
                  placeholder="email@exemplo.com"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div className={styles.formRowTwoColumns}>
              <div className={styles.formGroup}>
                <label>Posto</label>
                <input
                  type="text"
                  className={styles.modalInput}
                  placeholder="Ex: 2º Sargento"
                  required
                  value={form.posto}
                  onChange={(e) => setForm({ ...form, posto: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Número</label>
                <input
                  type="text"
                  className={styles.modalInput}
                  placeholder="Número do militar"
                  required
                  value={form.numeroMilitar}
                  onChange={(e) => setForm({ ...form, numeroMilitar: e.target.value })}
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
            <div className={styles.formRowTwoColumns}>
              <div className={styles.formGroup}>  
              <div className={styles.formGroup}>
                <label>CPF</label>
                <input
                  type="text"
                  className={styles.modalInput}
                  placeholder="000.000.000-00"
                  required
                  value={form.cpf}
                  onChange={(e) => setForm({ ...form, cpf: e.target.value })}
                />
              </div>
            </div>

            <div className={styles.formRowTwoColumns}>
              <div className={styles.formGroup}>
                <label>Perfil de Acesso</label>
                <select
                  className={styles.modalInput}
                  required
                  value={form.perfilAcesso}
                  onChange={(e) => setForm({ ...form, perfilAcesso: e.target.value })}
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="COMANDANTE">COMANDANTE</option>
                  <option value="MILITAR">MILITAR</option>
                </select>
              </div>
              <div className={styles.formGroup}></div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className={styles.modalFormPasso}>
            <div className={styles.formRowTwoColumns}>
              <div className={styles.formGroup}>
                <label>Senha</label>
                <input
                  type="password"
                  className={styles.modalInput}
                  placeholder="Nova Senha"
                  required
                  value={form.senha}
                  onChange={(e) => setForm({ ...form, senha: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Confirmar Senha</label>
                <input
                  type="password"
                  className={styles.modalInput}
                  placeholder="Confirmar Senha"
                  required
                  value={confirmSenha}
                  onChange={(e) => setConfirmSenha(e.target.value)}
                />
              </div>
            </div>
            {serverError && <div className={styles.formError}>{serverError}</div>}
          </div>
        );
      default:
        return <p>Erro</p>;
    }
  };

  const handleNext = () => setCurrentStep((prev) => Math.min(totalSteps, prev + 1));

  const handleFinalSubmit = async () => {
    setServerError(null);
    if (!form.nome || !form.email || !form.senha) {
      setServerError('Preencha os campos obrigatórios');
      return;
    }
    if (form.senha !== confirmSenha) {
      setServerError('As senhas não conferem');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const body = JSON.stringify({
        nome: form.nome,
        matricula: form.matricula,
        cpf: form.cpf,
        numeroMilitar: form.numeroMilitar,
        posto: form.posto,
        email: form.email,
        senha: form.senha,
        perfilAcesso: form.perfilAcesso,
      });

      const resp = await apiFetch('/api/auth/militar', { method: 'POST', headers, body });
      const text = await resp.text();
      let json: any = null;
      try { json = text ? JSON.parse(text) : null; } catch (e) { json = text; }

      if (!resp.ok) {
        const msg = json?.message || text || `Erro ${resp.status}`;
        setServerError(String(msg));
        return;
      }

      if (onCreated) onCreated();
      onClose();
    } catch (e: any) {
      setServerError(e.message || 'Erro ao comunicar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modalContent} ${styles.multistepModal}`}>
        <div className={styles.stepHeader}>{renderPassos()}</div>

        <div className={styles.boxFundoBranca}>
          <div className={styles.stepContent}>{renderStepContent(currentStep)}</div>
        </div>

        <div className={styles.modalActions}>
          <button type="button" className={styles.botaoCancelar} onClick={onClose}>
            CANCELAR
          </button>

          {currentStep < totalSteps ? (
            <button type="button" className={styles.botaoAvancar} onClick={handleNext}>
              AVANÇAR
            </button>
          ) : (
            <button type="button" className={styles.botaoCadastrar} onClick={handleFinalSubmit} disabled={loading}>
              {loading ? 'Enviando...' : 'CADASTRAR'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

function GestaoUsuarios(): JSX.Element {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 10;
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [actionModal, setActionModal] = useState<ActionModalState>({
    isOpen: false,
    action: null,
    user: null,
  });
  const [sortBy, setSortBy] = useState<"recente" | "nome">("recente");
  const [filterBy, setFilterBy] = useState<
    "todos" | "Em serviço" | "Fora de serviço"
  >("todos");
  
  const filteredUsers = users.filter((user) => {
    if (filterBy === "todos") return true;
    return user.status === filterBy;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === "nome") return a.nome.localeCompare(b.nome);
    // "recente": mantém a ordem vinda da API
    return 0;
  });

  const getStatusClass = (status: User["status"]) => {
    return status === "Em serviço"
      ? styles.statusActive
      : styles.statusInactive;
  };

  const paginate = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setPage(pageNumber);
  };

  // Fetch de usuários reais
  useEffect(() => {
    let cancelled = false;
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

  const resp = await apiFetch(`/api/auth/militares?page=${page}&limit=${limit}`, { headers });
        if (!resp.ok) {
          const t = await resp.text();
          throw new Error(`Erro ${resp.status}: ${t}`);
        }
        const json = await resp.json();
        const payload = json?.data || json;
        const militares = payload?.militares || payload?.items || [];
        const tp = payload?.totalPages || 1;

        // Normaliza para User
        const mapped: User[] = (militares as any[]).map((m) => ({
          id: String(m.id),
          nome: m.nome || "",
          cargo: m.posto || m.perfilAcesso || "",
          numero: m.numeroMilitar || m.matricula || "",
          email: m.email || "",
          status: "Em serviço", // Sem campo no backend; default
        }));

        if (!cancelled) {
          setUsers(mapped);
          setTotalPages(tp || 1);
        }
      } catch (e: any) {
        if (!cancelled) setError(e.message || "Erro ao carregar usuários");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchUsers();
    return () => { cancelled = true; };
  }, [page, refreshKey]);

  const handleMenuItemClick = (path: string) => {
    navigate(path);
  };

  const openActionModal = (user: User, action: ModalAction) => {
    setActionModal({
      isOpen: true,
      action: action,
      user: user,
    });
  };

  const closeActionModal = () => {
    setActionModal({
      isOpen: false,
      action: null,
      user: null,
    });
  };

  // paginação: números renderizados inline no footer

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
            className={`${styles.navItem} ${styles.navActive}`}
            onClick={() => handleMenuItemClick("/gestao-usuarios")}
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
            onClick={() => handleMenuItemClick("/Configuracoes")}
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
        <div className={styles.contentCard}>
          <h1 className={styles.pageTitle}>Usuários cadastrados</h1>

          <div className={styles.controlsBar}>
            <div className={styles.searchBox}>
              <Search size={20} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search"
                className={styles.searchInput}
              />
            </div>

            <div className={styles.dropdown}>
              <span>Filtrar: </span>
              <select
                className={styles.dropdownButton}
                value={filterBy}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFilterBy(
                    e.target.value as "todos" | "Em serviço" | "Fora de serviço"
                  )
                }
              >
                <option value="todos">Todos</option>
                <option value="Em serviço">Em serviço</option>
                <option value="Fora de serviço">Fora de serviço</option>
              </select>
            </div>

            <div className={styles.spacer}></div>

            <button
              className={`${styles.button} ${styles.buttonPrimary}`}
              onClick={() => setIsNewUserModalOpen(true)}
            >
              <Plus size={20} />
              novo usuário
            </button>

            <div className={styles.dropdown}>
              <span>Ordenar por: </span>
              <select
                className={styles.dropdownButton}
                value={sortBy}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSortBy(e.target.value as "recente" | "nome")
                }
              >
                <option value="recente">Recente</option>
                <option value="nome">Nome (A-Z)</option>
              </select>
            </div>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.userTable}>
              <thead>
                <tr>
                  <th className={styles.headerSmall}>Nome</th>
                  <th className={styles.headerSmall}>Cargo</th>
                  <th className={styles.headerSmall}>Número</th>
                  <th className={styles.headerLarge}>Email</th>
                  <th className={styles.headerActions}>Ações</th>
                  <th className={styles.headerSmall}>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className={styles.emptyState}>Carregando...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className={styles.emptyState}>{error}</td>
                  </tr>
                ) : sortedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.emptyState}>
                      Nenhum usuário encontrado. Adicione um novo usuário.
                    </td>
                  </tr>
                ) : (
                  sortedUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.nome}</td>
                      <td>{user.cargo}</td>
                      <td>{user.numero}</td>
                      <td>{user.email}</td>
                      <td className={styles.actionsCell}>
                        <Edit
                          size={16}
                          className={styles.actionIcon}
                          onClick={() => openActionModal(user, "edit")}
                        />
                        <Key
                          size={16}
                          className={styles.actionIcon}
                          onClick={() =>
                            openActionModal(user, "changePassword")
                          }
                        />
                        <Trash2
                          size={16}
                          className={`${styles.actionIcon} ${styles.actionIconDanger}`}
                          onClick={() => openActionModal(user, "delete")}
                        />
                      </td>
                      <td>
                        <span
                          className={`${styles.statusPill} ${getStatusClass(
                            user.status
                          )}`}
                        >
                          {user.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className={styles.pagination}>
            <button
              onClick={() => paginate(page - 1)}
              disabled={page === 1 || totalPages === 1}
              className={styles.pageArrow}
            >
              <ChevronLeft size={20} />
            </button>
            <p className={styles.pageNumber}>
              {page} / {totalPages}
            </p>
            <button
              onClick={() => paginate(page + 1)}
              disabled={page === totalPages || totalPages === 1}
              className={styles.pageArrow}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {isNewUserModalOpen && (
        <NewUserModal
          onClose={() => setIsNewUserModalOpen(false)}
          onCreated={() => {
            // força reload da lista (volta pra página 1)
            setPage(1);
            setRefreshKey((k) => k + 1);
          }}
        />
      )}

      {actionModal.isOpen && (
        <ActionModal
          onClose={closeActionModal}
          action={actionModal.action}
          user={actionModal.user}
        />
      )}
    </div>
  );
}

export default GestaoUsuarios;
