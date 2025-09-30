# Sirene_TS

Projeto TypeScript configurado com todas as ferramentas de desenvolvimento necessárias.

## 🚀 Configuração do Ambiente

Este projeto está totalmente configurado para desenvolvimento em TypeScript com:

- **TypeScript** - Compilador e tipagem estática
- **ts-node** - Execução direta de arquivos TypeScript
- **nodemon** - Hot reload durante desenvolvimento
- **@types/node** - Tipagens do Node.js

## 📦 Scripts Disponíveis

```bash
# Desenvolvimento - executa diretamente com ts-node
npm run dev

# Desenvolvimento com hot reload
npm run watch

# Compilar para JavaScript
npm run build

# Executar código compilado
npm start

# Limpar pasta de build
npm run clean

# Compilar em modo watch
npm run build:watch
```

## 🏗️ Estrutura do Projeto

```
src/
├── index.ts          # Arquivo principal
└── examples/
    └── advanced-types.ts  # Exemplos de tipos avançados
dist/                 # Código compilado (gerado automaticamente)
```

## 🔧 Configurações

- **tsconfig.json** - Configuração do TypeScript com strict mode ativado
- **nodemon.json** - Configuração do nodemon para hot reload
- **package.json** - Dependências e scripts do projeto

## 📝 Exemplos de Uso

### Exemplo Básico
```typescript
function greet(name: string): string {
    return `Olá, ${name}!`;
}

console.log(greet('TypeScript'));
```

### Classes e Interfaces
```typescript
interface User {
    id: number;
    name: string;
    email: string;
}

class UserService {
    private users: User[] = [];
    
    addUser(user: User): void {
        this.users.push(user);
    }
}
```

## 🚀 Começando

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Execute em modo desenvolvimento: `npm run dev`
4. Edite os arquivos em `src/` e veja as mudanças em tempo real!