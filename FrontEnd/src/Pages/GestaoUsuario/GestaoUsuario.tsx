import React, { useState, type JSX } from "react";
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
  id: number;
  nome: string;
  cargo: string;
  numero: string;
  email: string;
  status: "Em serviço" | "Fora de serviço";
}

type ModalAction = "edit" | "delete" | "changePassword" | null;

interface ActionModalState {
  isOpen: boolean;
  action: ModalAction;
  user: User | null;
}

const mockUsers: User[] = [
  {
    id: 1,
    nome: "Ana Silva",
    cargo: "Analista",
    numero: "1199999999",
    email: "ana.silva@email.com",
    status: "Em serviço",
  },
  {
    id: 2,
    nome: "João Souza",
    cargo: "Bombeiro",
    numero: "2198888888",
    email: "joao.souza@email.com",
    status: "Fora de serviço",
  },
];

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
            placeholder="Cargo"
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
}

const NewUserModal: React.FC<NewUserModalProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

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
          <form className={styles.modalFormPasso}>
            <div className={styles.formRowTwoColumns}>
              <div className={styles.formGroup}>
                <label>Nome Completo</label>
                <input
                  type="text"
                  className={styles.modalInput}
                  placeholder="Nome completo"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Email</label>
                <input
                  type="email"
                  className={styles.modalInput}
                  placeholder="email@exemplo.com"
                  required
                />
              </div>
            </div>
            <div className={styles.formRowTwoColumns}>
              <div className={styles.formGroup}>
                <label>Cargo</label>
                <input
                  type="text"
                  className={styles.modalInput}
                  placeholder="Ex: Bombeiro, Analista..."
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Telefone</label>
                <input
                  type="text"
                  className={styles.modalInput}
                  placeholder="(00) 90000-0000"
                  required
                />
              </div>
            </div>
          </form>
        );
      case 2:
        return (
          <form className={styles.modalFormPasso}>
            <div className={styles.formRowTwoColumns}>
              <div className={styles.formGroup}>
                <label>Data de Admissão</label>
                <input type="date" className={styles.modalInput} required />
              </div>
              <div className={styles.formGroup}>
                <label>Unidade</label>
                <select className={styles.modalInput} required>
                  <option value="">Selecione a Unidade</option>
                  <option value="RegiaoMetropolitana">(COM)</option>
                  <option value="AgresteZonaDaMata">(COInter/I)</option>
                  <option value="Sertão">(COInter/II)</option>
                  {/* Outras opções de unidade */}
                </select>
              </div>
            </div>
            <div className={styles.formRowTwoColumns}>
              <div className={styles.formGroup}>
                <label>Perfil de Acesso</label>
                <select className={styles.modalInput} required>
                  <option value="">Selecione o Perfil</option>
                  <option value="admin">Administrador</option>
                  <option value="operador">Operador</option>
                  <option value="visualizador">Visualizador</option>
                </select>
              </div>
              {/* Espaço vazio para manter o layout de 2 colunas */}
              <div className={styles.formGroup}></div>
            </div>
          </form>
        );
      case 3:
        return (
          <form className={styles.modalFormPasso}>
            <div className={styles.formRowTwoColumns}>
              <div className={styles.formGroup}>
                <label>Senha</label>
                <input
                  type="password"
                  className={styles.modalInput}
                  placeholder="Nova Senha"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Confirmar Senha</label>
                <input
                  type="password"
                  className={styles.modalInput}
                  placeholder="Confirmar Senha"
                  required
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
    // Lógica final de submissão do formulário
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

function GestaoUsuarios(): JSX.Element {
  const navigate = useNavigate();
  const [allUsers] = useState<User[]>(mockUsers);
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);

  const [actionModal, setActionModal] = useState<ActionModalState>({
    isOpen: false,
    action: null,
    user: null,
  });
  const [sortBy, setSortBy] = useState<"recente" | "nome">("recente");
  const [filterBy, setFilterBy] = useState<
    "todos" | "Em serviço" | "Fora de serviço"
  >("todos");
  const currentPage = 1;
  const usersPerPage = 8;
  const totalPages = Math.max(1, Math.ceil(allUsers.length / usersPerPage));

  const filteredUsers = allUsers.filter((user) => {
    if (filterBy === "todos") return true;
    return user.status === filterBy;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === "recente") {
      return b.id - a.id;
    }
    return a.nome.localeCompare(b.nome);
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);

  const getStatusClass = (status: User["status"]) => {
    return status === "Em serviço"
      ? styles.statusActive
      : styles.statusInactive;
  };

  const paginate = (pageNumber: number) =>
    console.log("Paginar para", pageNumber);

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

  const renderPageNumbers = () => {
    return <p className={styles.pageNumber}>1</p>;
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
                {currentUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.emptyState}>
                      Nenhum usuário encontrado. Adicione um novo usuário.
                    </td>
                  </tr>
                ) : (
                  currentUsers.map((user) => (
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
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1 || totalPages === 1}
              className={styles.pageArrow}
            >
              <ChevronLeft size={20} />
            </button>
            {renderPageNumbers()}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 1}
              className={styles.pageArrow}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {isNewUserModalOpen && (
        <NewUserModal onClose={() => setIsNewUserModalOpen(false)} />
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
