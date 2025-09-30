// Exemplos avançados de TypeScript

// 1. Tipos Union e Intersection
type Status = 'pending' | 'completed' | 'failed';
type Priority = 'low' | 'medium' | 'high';

interface Task {
    id: string;
    title: string;
    status: Status;
    priority: Priority;
    createdAt: Date;
}

// 2. Generics
class Repository<T extends { id: string }> {
    private items: T[] = [];

    add(item: T): void {
        this.items.push(item);
    }

    findById(id: string): T | undefined {
        return this.items.find(item => item.id === id);
    }

    getAll(): T[] {
        return [...this.items];
    }

    update(id: string, updates: Partial<T>): T | undefined {
        const index = this.items.findIndex(item => item.id === id);
        if (index !== -1) {
            this.items[index] = { ...this.items[index], ...updates } as T;
            return this.items[index];
        }
        return undefined;
    }
}

// 3. Tipos condicionais e mapped types
type ApiResponse<T> = {
    data: T;
    success: boolean;
    message: string;
};

type UserInput = {
    name: string;
    email: string;
    age: number;
};

// Torna todas as propriedades opcionais para update
type UpdateUserInput = Partial<UserInput>;

// 4. Exemplo de uso
const taskRepository = new Repository<Task>();

taskRepository.add({
    id: '1',
    title: 'Aprender TypeScript',
    status: 'pending',
    priority: 'high',
    createdAt: new Date()
});

taskRepository.add({
    id: '2',
    title: 'Configurar projeto',
    status: 'completed',
    priority: 'medium',
    createdAt: new Date()
});

// 5. Função com tipos utilitários
function processApiResponse<T>(response: ApiResponse<T>): T | null {
    if (response.success) {
        console.log(`✅ ${response.message}`);
        return response.data;
    } else {
        console.error(`❌ ${response.message}`);
        return null;
    }
}

// 6. Exemplo de uso das funções
console.log('\n=== Exemplos Avançados TypeScript ===');
console.log('Tarefas no repositório:', taskRepository.getAll());

const mockApiResponse: ApiResponse<Task[]> = {
    data: taskRepository.getAll(),
    success: true,
    message: 'Tarefas carregadas com sucesso'
};

const tasks = processApiResponse(mockApiResponse);
console.log('Tarefas processadas:', tasks);

// 7. Atualização de tarefa
taskRepository.update('1', { status: 'completed' });
console.log('Tarefa atualizada:', taskRepository.findById('1'));