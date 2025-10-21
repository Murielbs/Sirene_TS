import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, User, Bell, Lock, LogOut, ArrowLeftRight, Download, 
  Home, ListChecks, LayoutDashboard, Users, ClipboardList
} from 'lucide-react';

import styles from './Configuracoes.module.css'; 

const App = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('account');
  const [activeSidebarItem, setActiveSidebarItem] = useState('settings'); 

  const alertMessage = (message) => {
      console.log("MENSAGEM AO USUÁRIO:", message);
      alert(message);
  };

  const userSidebarItems = [
    { id: 'home', icon: Home, label: 'Pagina inicial', path: '/inicial' },
    { id: 'occurrences', icon: ListChecks, label: 'Lista de ocorrências', path: '/Ocorrencias' },
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/Dashboard' },
    { id: 'user_management', icon: Users, label: 'Gestão de usuários', path: '/GestaoUsuario' },
    { id: 'audit', icon: ClipboardList, label: 'Auditoria e logs', path: '/Auditoria' },
    { id: 'settings', icon: Settings, label: 'Configuração', path: '/configuracao' }, 
  ];

  const handleSidebarClick = (item) => {
    setActiveSidebarItem(item.id);

    if (item.id === 'settings') {
        setActiveSection('account');
        navigate(item.path);
    } 
    else {
        navigate(item.path);
    }
  };


  const SettingsCard = ({ title, description, children }) => (
    <div className={styles.settingsCard}>
      <h2 className={styles.cardTitle}>{title}</h2>
      <p className={styles.cardDescription}>{description}</p>
      {children}
    </div>
  );

  const ProfilePictureUploader = () => {
    const [imageUrl, setImageUrl] = useState("https://placehold.co/128x128/550d08/ffffff?text=User");

    const handleFileChange = (e) => {
        const file = e.target.files[0];
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
                    e.target.onerror = null; 
                    e.target.src="https://placehold.co/128x128/999999/ffffff?text=Err";
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
  
  const OptionButton = ({ icon: Icon, label, action }) => (
    <button 
      onClick={action}
      className={styles.optionButton}
    >
      <div className={styles.optionIconWrapper}>
        <Icon className={styles.optionIcon} />
        <span className={styles.optionLabel}>{label}</span>
      </div>
      <ArrowLeftRight className={styles.optionArrow} />
    </button>
  );


  const AccountSettings = () => (
    <>
      <SettingsCard title="Informações do Perfil" description="Atualize seu nome de usuário, email e foto de perfil.">
        <ProfilePictureUploader />

        <div className={styles.formSection}>
          <InputGroup label="Nome de Usuário" defaultValue="usuario_minimalista" />
          <InputGroup label="Email" defaultValue="minimal@app.com" type="email" />
          <button className={styles.saveButton} onClick={() => alertMessage("Informações salvas!")}>Salvar Informações</button>
        </div>
      </SettingsCard>
      
      <SettingsCard title="Gerenciamento de Dados" description="Opções para gerenciar seus dados no aplicativo, como a exportação.">
        <div className={styles.optionList}>
            <OptionButton 
                icon={Download} 
                label="Exportar Meus Dados" 
                action={() => alertMessage("Solicitação de exportação de dados enviada. Você receberá um e-mail em breve.")} 
            />
        </div>
      </SettingsCard>
    </>
  );

  const AppearanceSettings = () => {
    const [currentTheme, setCurrentTheme] = useState('light'); 

    return (
      <>
        <SettingsCard title="Tema da Interface" description="Personalize a aparência do seu aplicativo.">
          <div className={styles.themeOptions}>
            <ThemeOption label="Claro" theme="light" currentTheme={currentTheme} onClick={() => { setCurrentTheme('light'); alertMessage("Tema alterado para: Claro"); }} />
            <ThemeOption label="Escuro" theme="dark" currentTheme={currentTheme} onClick={() => { setCurrentTheme('dark'); alertMessage("Tema alterado para: Escuro"); }} />
          </div>
        </SettingsCard>

        <SettingsCard title="Tamanho da Fonte" description="Ajuste o tamanho do texto para melhor leitura.">
          <div className={styles.fontSizeControl}>
              <span className={styles.fontSizeLabelSmall}>Pequena</span>
              <input 
                type="range" 
                min="1" 
                max="3" 
                defaultValue="2" 
                className={styles.rangeInput} 
                onChange={(e) => alertMessage(`Tamanho da fonte ajustado para nível ${e.target.value}`)}
              />
              <span className={styles.fontSizeLabelLarge}>Grande</span>
          </div>
        </SettingsCard>
      </>
    );
  };

  const NotificationsSettings = () => (
    <>
      <SettingsCard title="Notificações por Email" description="Gerencie quais alertas você deseja receber por email.">
        <div className={styles.optionList}>
          <ToggleOption label="Novos Recursos" checked={true} action={(c) => alertMessage(`Novos Recursos: ${c ? 'ativado' : 'desativado'}`)} />
          <ToggleOption label="Atualizações de Segurança" checked={true} action={(c) => alertMessage(`Atualizações de Segurança: ${c ? 'ativado' : 'desativado'}`)} />
          <ToggleOption label="Notícias da Comunidade" checked={false} action={(c) => alertMessage(`Notícias da Comunidade: ${c ? 'ativado' : 'desativado'}`)} />
        </div>
      </SettingsCard>
    </>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'account':
        return <AccountSettings />;
      case 'appearance':
        return <AppearanceSettings />;
      case 'notifications':
        return <NotificationsSettings />;
      case 'security':
        return <SettingsCard title="Configurações de Segurança" description="Gerencie a autenticação de dois fatores e sessões ativas.">
            <div className={styles.formSection}>
                <ToggleOption label="Autenticação de Dois Fatores (2FA)" checked={false} action={(c) => alertMessage(`2FA: ${c ? 'ativado' : 'desativado'}`)}/>
                <p className={styles.errorText}>Recomendamos ativar o 2FA para maior segurança.</p>
                <button 
                    className={`${styles.optionButton} ${styles.marginTopAuto}`}
                    onClick={() => alertMessage("Tela de Gerenciamento de Sessões Ativas aberta.")}
                >
                    Gerenciar Sessões Ativas
                </button>
            </div>
          </SettingsCard>;
      case 'integrations':
        return <SettingsCard title="Integrações de Serviços" description="Conecte seu aplicativo a serviços externos.">
          <p className={styles.subtitle}>Nenhuma integração ativa no momento.</p>
        </SettingsCard>;
      default:
        return <AccountSettings />;
    }
  };

  const InputGroup = ({ label, type = 'text', defaultValue = '' }) => (
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

  const ToggleOption = ({ label, checked, action }) => {
    const [isChecked, setIsChecked] = useState(checked);
    
    const handleChange = (e) => {
        const newChecked = e.target.checked;
        setIsChecked(newChecked);
        if (action) action(newChecked);
    };

    return (
        <div className={styles.toggleOption}>
        <span className={styles.toggleLabelText}>{label}</span>
        <label className={styles.toggleSwitch}>
            <input 
                type="checkbox" 
                checked={isChecked} 
                className={styles.toggleInput} 
                onChange={handleChange}
            />
            <div className={styles.toggleSlider}>
                <span className={styles.toggleCircle}></span>
            </div>
        </label>
        </div>
    );
  };

  const ThemeOption = ({ label, theme, currentTheme, onClick }) => (
    <div className={styles.themeOption} onClick={onClick}>
      <div className={`${styles.themeBox} ${currentTheme === theme ? styles.themeActive : ''}`}>
        {theme === 'light' ? (
            <div className={styles.themeIconLight}>☀️</div>
        ) : (
            <div className={styles.themeIconDark}>🌙</div>
        )}
      </div>
      <p className={styles.themeLabel}>{label}</p>
    </div>
  );

  return (
    <div className={styles.appContainer}>
      
      <aside className={styles.sidebar}>
        
        <div className={styles.logoSection}>
            <span className={styles.logoText}>
                <User className={styles.logoIcon} />
                <span>SIRENE</span> 
            </span>
        </div>

        <nav className={styles.navMenu}>
          {userSidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSidebarClick(item)}
              className={`${styles.navItem} ${item.id === activeSidebarItem ? styles.navActive : ''}`}
            >
              <item.icon className={styles.navItemIcon} />
              <span className={styles.navText}>{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className={styles.logoutSection}>
             <button
              className={styles.logoutButton}
              onClick={() => alertMessage("Usuário deslogado.")}
            >
              <LogOut className={styles.navItemIcon} />
              <span className={styles.navText}>Sair</span>
            </button>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          <header className={styles.header}>
            <h1 className={styles.title}>
                Configurações
            </h1>
            <p className={styles.subtitle}>Ajuste e gerencie todas as suas preferências de aplicativo em um só lugar.</p>
            
            <nav className={styles.navTabs}>
                {['Minha Conta', 'Aparência', 'Notificações', 'Segurança', 'Integrações'].map((label) => {
                    const id = label.toLowerCase().replace(/á|ã/g, 'a').replace(/\s/g, '');
                    return (
                        <button
                            key={id}
                            onClick={() => setActiveSection(id)}
                            className={`${styles.navTabButton} ${activeSection === id ? styles.tabActive : ''}`}
                        >
                            {label}
                        </button>
                    );
                })}
            </nav>
          </header>
          
          <div className={styles.contentBody}>
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;