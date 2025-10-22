import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Settings,
  User,
  Bell,
  Lock,
  LogOut,
  ArrowLeftRight,
  Download,
  Home,
  ListChecks,
  LayoutDashboard,
  Users,
  ClipboardList,
  Sun,
  Moon,
} from "lucide-react";
import LogoSvg from "../../img/Logo.svg";
import PaginaIncialSvg from "../../img/PaginaIncial.svg";
import ListaOcorrenciaSvg from "../../img/ListaOcorrencia.svg";
import DashboardSvg from "../../img/Dashboard.svg";
import GestaoUsuarioSvg from "../../img/GestaoUsuario.svg";
import AuditoriaLogSvg from "../../img/AuditoriaLog.svg";
import ConfiguracaoSvg from "../../img/Configuracao.svg";
import SairSvg from "../../img/sair.svg";

import styles from "./Configuracoes.module.css";

const Configuracoes = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("account");

  const alertMessage = (message: string) => {
    console.log("MENSAGEM AO USUÁRIO:", message);
    alert(message);
  };

  const SettingsTabs = [
    { id: "account", label: "Minha Conta" },
    { id: "appearance", label: "Aparência" },
    { id: "notifications", label: "Notificações" },
    { id: "security", label: "Segurança" },
    { id: "integrations", label: "Integrações" },
  ];

  const handleMenuItemClick = (path: string) => {
    navigate(path);
  };

  const SettingsCard = ({ title, description, children }: { title: string, description: string, children: React.ReactNode }) => (
    <div className={styles.settingsCard}>
      <h2 className={styles.cardTitle}>{title}</h2>
      <p className={styles.cardDescription}>{description}</p>
      {children}
    </div>
  );

  const InputGroup = ({ label, type = "text", defaultValue = "" }: { label: string, type?: string, defaultValue?: string }) => (
    <div className={styles.inputGroup}>
      <label className={styles.inputLabel}>{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        className={styles.inputField}
        placeholder={`Seu ${label.toLowerCase()}`}
      />
    </div>
  );

  const ToggleOption = ({ label, checked, action }: { label: string, checked: boolean, action: (c: boolean) => void }) => {
    const [isChecked, setIsChecked] = useState(checked);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked;
      setIsChecked(newChecked);
      if (action) action(newChecked);
    };

    return (
      <label className={styles.toggleOption}>
        <span className={styles.toggleLabelText}>{label}</span>
        <div className={styles.toggleSwitch}>
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleChange}
            className={styles.toggleInput}
          />
          <span className={styles.toggleSlider}>
            <span className={styles.toggleCircle}></span>
          </span>
        </div>
      </label>
    );
  };

  const OptionButton = ({ icon: Icon, label, action }: { icon: React.ElementType, label: string, action: () => void }) => (
    <button onClick={action} className={styles.optionButton}>
      <div className={styles.optionIconWrapper}>
        <Icon className={styles.optionIcon} />
        <span className={styles.optionLabel}>{label}</span>
      </div>
      <ArrowLeftRight className={styles.optionArrow} />
    </button>
  );

  const ThemeOption = ({ label, theme, currentTheme, onClick }: { label: string, theme: string, currentTheme: string, onClick: () => void }) => (
    <div className={styles.themeOption} onClick={onClick}>
      <div className={`${styles.themeBox} ${currentTheme === theme ? styles.themeActive : ''}`}>
        {theme === 'light' ? (
          <div className={styles.themeIconLight}>
            <Sun size={24} color="#333" />
          </div>
        ) : (
          <div className={styles.themeIconDark}>
            <Moon size={24} color="#fff" />
          </div>
        )}
      </div>
      <span className={styles.themeLabel}>{label}</span>
    </div>
  );

  const ProfilePictureUploader = () => {
    const [imageUrl, setImageUrl] = useState(
      "https://placehold.co/128x128/550d08/ffffff?text=User"
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const newUrl = URL.createObjectURL(file);
        setImageUrl(newUrl);
        alertMessage("Nova foto selecionada: " + file.name);
      }
    };

    return (
      <div className={styles.profileUploader}>
        <img
          src={imageUrl}
          alt="Foto de Perfil"
          className={styles.profileImage}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              "https://placehold.co/128x128/999999/ffffff?text=Err";
          }}
        />

        <div className={styles.uploadControls}>
          <h3 className={styles.uploadTitle}>Sua Foto</h3>
          <p className={styles.uploadSubtitle}>
            Arquivos JPG, PNG ou GIF. Tamanho máximo de 5MB.
          </p>
          <label className={styles.uploadLabel}>
            Trocar Foto
            <input
              type="file"
              accept="image/png, image/jpeg, image/gif"
              className={styles.fileInput}
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>
    );
  };

  const AccountSettings = () => (
    <>
      <SettingsCard
        title="Informações do Perfil"
        description="Atualize seu nome de usuário, email e foto de perfil."
      >
        <ProfilePictureUploader />

        <div className={styles.formSection}>
          <InputGroup
            label="Nome de Usuário"
            defaultValue="usuario_minimalista"
          />
          <InputGroup
            label="Email"
            defaultValue="minimal@app.com"
            type="email"
          />
          <button
            className={styles.saveButton}
            onClick={() => alertMessage("Informações salvas!")}
          >
            Salvar Informações
          </button>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Gerenciamento de Dados"
        description="Opções para gerenciar seus dados no aplicativo, como a exportação."
      >
        <div className={styles.optionList}>
          <OptionButton
            icon={Download}
            label="Exportar Meus Dados"
            action={() =>
              alertMessage(
                "Solicitação de exportação de dados enviada. Você receberá um e-mail em breve."
              )
            }
          />
        </div>
      </SettingsCard>
    </>
  );

  const AppearanceSettings = () => {
    const [currentTheme, setCurrentTheme] = useState("light");

    return (
      <>
        <SettingsCard
          title="Tema da Interface"
          description="Personalize a aparência do seu aplicativo."
        >
          <div className={styles.themeOptions}>
            <ThemeOption
              label="Claro"
              theme="light"
              currentTheme={currentTheme}
              onClick={() => {
                setCurrentTheme("light");
                alertMessage("Tema alterado para: Claro");
              }}
            />
            <ThemeOption
              label="Escuro"
              theme="dark"
              currentTheme={currentTheme}
              onClick={() => {
                setCurrentTheme("dark");
                alertMessage("Tema alterado para: Escuro");
              }}
            />
          </div>
        </SettingsCard>

        <SettingsCard
          title="Tamanho da Fonte"
          description="Ajuste o tamanho do texto para melhor leitura."
        >
          <div className={styles.fontSizeControl}>
            <span className={styles.fontSizeLabelSmall}>Pequena</span>
            <input
              type="range"
              min="1"
              max="3"
              defaultValue="2"
              className={styles.rangeInput}
              onChange={(e) =>
                alertMessage(
                  `Tamanho da fonte ajustado para nível ${e.target.value}`
                )
              }
            />
            <span className={styles.fontSizeLabelLarge}>Grande</span>
          </div>
        </SettingsCard>
      </>
    );
  };

  const NotificationsSettings = () => (
    <>
      <SettingsCard
        title="Notificações por Email"
        description="Gerencie quais alertas você deseja receber por email."
      >
        <div className={styles.optionList}>
          <ToggleOption
            label="Novos Recursos"
            checked={true}
            action={(c) =>
              alertMessage(`Novos Recursos: ${c ? "ativado" : "desativado"}`)
            }
          />
          <ToggleOption
            label="Atualizações de Segurança"
            checked={true}
            action={(c) =>
              alertMessage(
                `Atualizações de Segurança: ${c ? "ativado" : "desativado"}`
              )
            }
          />
          <ToggleOption
            label="Notícias da Comunidade"
            checked={false}
            action={(c) =>
              alertMessage(
                `Notícias da Comunidade: ${c ? "ativado" : "desativado"}`
              )
            }
          />
        </div>
      </SettingsCard>
    </>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "account":
        return <AccountSettings />;
      case "appearance":
        return <AppearanceSettings />;
      case "notifications":
        return <NotificationsSettings />;
      case "security":
        return (
          <SettingsCard
            title="Configurações de Segurança"
            description="Gerencie a autenticação de dois fatores e sessões ativas."
          >
            <div className={styles.formSection}>
              <ToggleOption
                label="Autenticação de Dois Fatores (2FA)"
                checked={false}
                action={(c) =>
                  alertMessage(`2FA: ${c ? "ativado" : "desativado"}`)
                }
              />
              <p className={styles.errorText}>
                Recomendamos ativar o 2FA para maior segurança.
              </p>
              <button
                className={`${styles.optionButton} ${styles.marginTopAuto}`}
                onClick={() =>
                  alertMessage(
                    "Tela de Gerenciamento de Sessões Ativas aberta."
                  )
                }
              >
                Gerenciar Sessões Ativas
              </button>
            </div>
          </SettingsCard>
        );
      case "integrations":
        return (
          <SettingsCard
            title="Integrações de Serviços"
            description="Conecte seu aplicativo a serviços externos."
          >
            <p className={styles.subtitle}>
              Nenhuma integração ativa no momento.
            </p>
          </SettingsCard>
        );
      default:
        return <AccountSettings />;
    }
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
            className={`${styles.navItem} ${styles.navActive}`}
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

      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          <header className={styles.header}>
            <h1 className={styles.title}>Configurações</h1>
            <p className={styles.subtitle}>
              Ajuste e gerencie todas as suas preferências de aplicativo em um
              só lugar.
            </p>

            <nav className={styles.navTabs}>
              {SettingsTabs.map((tab) => {
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSection(tab.id)}
                    className={`${styles.navTabButton} ${
                      activeSection === tab.id ? styles.tabActive : ""
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </header>

          <div className={styles.contentBody}>{renderContent()}</div>
        </div>
      </main>
    </div>
  );
};

export default Configuracoes;