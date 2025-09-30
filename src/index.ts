console.log('Hello, TypeScript!');

// Exemplo de função com tipagem
function greet(name: string): string {
    return `Olá, ${name}! Bem-vindo ao TypeScript!`;
}

// Exemplo de interface
interface User {
    id: number;
    name: string;
    email: string;
}

// Exemplo de classe
class UserService {
    private users: User[] = [];

    addUser(user: User): void {
        this.users.push(user);
        console.log(`Usuário ${user.name} adicionado com sucesso!`);
    }

    getUser(id: number): User | undefined {
        return this.users.find(user => user.id === id);
    }

    getAllUsers(): User[] {
        return [...this.users];
    }
}

// Uso das funções e classes
const message = greet('Desenvolvedor');
console.log(message);

const userService = new UserService();
userService.addUser({
    id: 1,
    name: 'João Silva',
    email: 'joao@email.com'
});

console.log('Todos os usuários:', userService.getAllUsers());