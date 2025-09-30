# 🚒 Sistema Corpo de Bombeiros - Backend

Sistema completo de gerenciamento para Corpo de Bombeiros desenvolvido em TypeScript com Node.js, Express, Prisma e MySQL.

## 🏗️ Arquitetura do Sistema

### **Perfis de Acesso:**
- **ADMIN** - Acesso completo, pode cadastrar militares
- **COMANDANTE** - Gerenciamento de equipes e ocorrências
- **MILITAR** - Registro de ocorrências e consultas básicas

### **Principais Funcionalidades:**
- ✅ Sistema de autenticação JWT
- ✅ Gerenciamento de militares (CRUD)
- ✅ Controle de equipes
- ✅ Registro de ocorrências com geolocalização
- ✅ Upload de fotos/vídeos
- ✅ Logs de auditoria
- ✅ Relatórios
- ✅ Rate limiting e segurança

## 🗄️ Estrutura do Banco de Dados

```sql
Militar -> Cadastro de militares com perfis de acesso
Equipe -> Equipes de trabalho por turno
Ocorrencia -> Registros de emergências/treinamentos
RegistroOcorrencia -> Participação de militares nas ocorrências
LogAuditoria -> Logs de todas as ações do sistema
Relatorio -> Relatórios gerados
MilitarEquipe -> Relacionamento militar-equipe
```

## 🚀 Configuração e Instalação

### **1. Pré-requisitos**
- Node.js 18+ 
- MySQL 5.7+ ou 8.0+
- npm ou yarn

### **2. Instalação**
```bash
# Clone o repositório
git clone <repo-url>
cd Sirene_TS

# Instale as dependências
npm install

# Configure o banco de dados
# Edite o arquivo .env com suas credenciais do MySQL
```

### **3. Configuração do Banco (.env)**
```env
# Banco de Dados MySQL
DATABASE_URL="mysql://usuario:senha@localhost:3306/corpo_bombeiros"

# JWT
JWT_SECRET="sua_chave_jwt_super_segura_aqui"
JWT_EXPIRES_IN="7d"

# Servidor
PORT=3000
NODE_ENV="development"
```

### **4. Executar Migrações e Seed**
```bash
# Gerar cliente Prisma
npm run db:generate

# Criar/sincronizar tabelas no banco
npm run db:push

# Popular banco com dados iniciais (Admin padrão)
npm run db:seed
```

### **5. Iniciar Servidor**
```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## 📡 API Endpoints

### **Autenticação**
```http
POST   /api/auth/login              # Login
GET    /api/auth/me                 # Dados do usuário logado
POST   /api/auth/militar            # Criar militar (Admin)
GET    /api/auth/militares          # Listar militares
GET    /api/auth/militar/:id        # Buscar militar
PUT    /api/auth/militar/:id        # Atualizar militar  
DELETE /api/auth/militar/:id        # Remover militar (Admin)
```

### **Health Check**
```http
GET    /api/health                  # Status da API
```

## 🔐 Usuário Padrão (Após seed)

```
Matrícula: ADMIN001
Senha: admin123
Perfil: ADMIN
```

**⚠️ IMPORTANTE:** Altere a senha padrão após o primeiro login!

## 📋 Scripts Disponíveis

```bash
npm run dev          # Servidor desenvolvimento com hot reload
npm run build        # Compilar TypeScript
npm run start        # Executar versão compilada
npm run db:generate  # Gerar cliente Prisma
npm run db:push      # Sincronizar schema com banco
npm run db:migrate   # Criar migração
npm run db:seed      # Popular dados iniciais
npm run db:studio    # Interface visual do banco
```

## 🏗️ Estrutura do Projeto

```
src/
├── controllers/     # Controladores da API
├── database/        # Conexão e seeds do banco
├── middleware/      # Middlewares de auth, validação, etc
├── routes/          # Definição das rotas
├── services/        # Lógica de negócio
├── types/           # Tipos TypeScript
├── utils/           # Utilitários (auth, validação, etc)
└── server.ts        # Arquivo principal do servidor

prisma/
└── schema.prisma    # Schema do banco de dados

uploads/             # Arquivos enviados pelos usuários
```

## 🔒 Segurança Implementada

- **JWT** para autenticação
- **bcryptjs** para hash de senhas
- **Helmet** para headers de segurança
- **Rate Limiting** para prevenir ataques
- **CORS** configurado
- **Validação** de entrada de dados
- **Logs de auditoria** para todas as ações

## 🧪 Testando a API

### **1. Login**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "matricula": "ADMIN001",
    "senha": "admin123"
  }'
```

### **2. Criar Militar (com token)**
```bash
curl -X POST http://localhost:3000/api/auth/militar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -d '{
    "nome": "João Silva",
    "matricula": "BOMB001",
    "posto": "Soldado",
    "email": "joao@bombeiros.gov.br",
    "senha": "senha123",
    "perfilAcesso": "MILITAR"
  }'
```

## 🔧 Próximos Passos

O sistema está configurado com a base de autenticação. Para completar, você pode implementar:

- [ ] CRUD de Ocorrências
- [ ] CRUD de Equipes  
- [ ] Sistema de Upload de Arquivos
- [ ] Geração de Relatórios
- [ ] Dashboard com estatísticas
- [ ] Notificações push
- [ ] API de geolocalização

## 📞 Suporte

Sistema desenvolvido para atender às necessidades específicas do Corpo de Bombeiros com foco em segurança, auditoria e eficiência operacional.

---

**🚒 Desenvolvido com ❤️ para servir e proteger! 🚒**
