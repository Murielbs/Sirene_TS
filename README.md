# SIRENE - Sistema de Registro de Ocorrências 

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## Fase 1: Painel Administrativo Web

---

## 📝 Descrição do Projeto

O *SIRENE* é uma interface administrativa estratégica, desenvolvida especificamente para atender às necessidades operacionais do *Corpo de Bombeiros de Pernambuco*. Esta plataforma fornece aos comandantes, oficiais e equipes de gestão as ferramentas essenciais para monitorar, analisar e coordenar todas as ocorrências emergenciais em tempo real.

---

## ✨ Funcionalidades (Features)

As funcionalidades do Painel Web estão categorizadas por:

### Módulo 1 (Core)

| ID | Funcionalidade | Descrição e Critério de Aceitação |
| :--- | :--- | :--- |
| *W-01* | *Login & Perfis* | *Gerenciamento de Acesso:* Implementação de perfis distintos (admin, analista, chefe) para limitar o acesso a dados e funcionalidades específicas do sistema. |
| *W-02* | *Lista & Filtros de Ocorrências* | *Busca Avançada:* Permite a visualização da lista de todas as ocorrências com filtros por período, tipo, região, e status. Deve suportar paginação eficiente. |
| *W-03* | *Visualização de Detalhe* | *Inspeção Completa:* Exibição de todos os campos da ocorrência, mídias anexadas (fotos/vídeos), localização (mapa), e a timeline (histórico de ações). Permite o download dos anexos originais. |
| *W-04* | *Relatórios Básicos & Exportação* | *Análise Offline:* Capacidade de gerar e exportar relatórios com métricas selecionadas pelos usuários nos formatos populares (CSV e PDF). |
| *W-05* | *Gestão de Usuários* | *Controle Administrativo:* Funcionalidades de CRUD (Criar, Ler, Atualizar, Deletar) para usuários, ferramenta de redefinição de senha e vinculação/desvinculação de perfis de acesso. |
| *W-06* | *Auditoria & Logs* | *Transparência e Segurança:* Registro detalhado (trilhas) de quem realizou qual ação, o quê foi alterado e quando. Inclui filtros por tipo de evento. |
| *W-07* | *Dashboard Operacional (KPI simples)* | *Monitoramento em Tempo Real:* Tela inicial com cards e gráficos (KPIs) simples para uma visão rápida das ocorrências por tipo, região e turno. |
| *W-08* | *Catálogo/Form Builder* | *Flexibilidade do Formulário:* Ferramenta low-code para criar, alterar ou reordenar campos do formulário de registro de ocorrências *sem a necessidade de reempacotar ou fazer deploy do aplicativo mobile/web*. |

---

## 🛠️ Tecnologias Utilizadas

* *Frontend:* React em vite
* *Backend (API):* Node.js (Express) / TypeScript
* *Banco de Dados:* MongoDB

## 🚀 Como Executar o Projeto Localmente

### Instalação

1.  Clone o repositório:
    bash
    git clone [https://github.com/Murielbs/Sirene_TS.git](https://github.com/Murielbs/Sirene_TS.git)
    cd Sirene_TS
    

2.  Instale as dependências:
    bash
    npm install
    

3.  Configure as variáveis de ambiente:
    Crie um arquivo .env na raiz e adicione as configurações de banco de dados e chaves de segurança (consulte o arquivo .env.example).

4.  Inicie o servidor:
    bash
    npm run watch
    npm run dev
    

O Painel estará acessível aqui: [https://sirene-corpodebombeiro.netlify.app/](https://sirene-corpodebombeiro.netlify.app/)


## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---
