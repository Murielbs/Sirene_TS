/*import prisma from './prisma';
import { AuthUtils } from '../utils/auth';
import { PerfilAcesso } from '../types';

async function seed() {
  console.log(' Iniciando seed do banco de dados...');

  try {
    // Verifica se já existe um admin
    const adminExistente = await prisma.militar.findFirst({
      where: { perfilAcesso: PerfilAcesso.ADMIN },
    });

    if (adminExistente) {
      console.log(' Administrador já existe no sistema');
      return;
    }

    // Cria o primeiro administrador
    const senhaHash = await AuthUtils.hashPassword('admin123');
    
    const admin = await prisma.militar.create({
      data: {
        nome: 'Muriel',
        matricula: 'ADMIN001',
        posto: 'Comandante Geral',
        email: 'admin@bombeiros.gov.br',
        senhaHash,
        perfilAcesso: PerfilAcesso.ADMIN,
      },
    });

    console.log(' Administrador criado com sucesso!');
    console.log(`   ID: ${admin.id}`);
    console.log(`   Nome: ${admin.nome}`);
    console.log(`   Matrícula: ${admin.matricula}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Senha: admin123`);

    // Criar algumas equipes de exemplo
    const equipe1 = await prisma.equipe.create({
      data: {
        nomeEquipe: 'Equipe Alpha',
        turno: 'Manhã',
        idMilitarLider: admin.id,
      },
    });

    const equipe2 = await prisma.equipe.create({
      data: {
        nomeEquipe: 'Equipe Bravo',
        turno: 'Tarde',
      },
    });

    const equipe3 = await prisma.equipe.create({
      data: {
        nomeEquipe: 'Equipe Charlie',
        turno: 'Noite',
      },
    });

    console.log(' Equipes de exemplo criadas:');
    console.log(`   - ${equipe1.nomeEquipe} (${equipe1.turno})`);
    console.log(`   - ${equipe2.nomeEquipe} (${equipe2.turno})`);
    console.log(`   - ${equipe3.nomeEquipe} (${equipe3.turno})`);

    // Adicionar o admin à primeira equipe
    await prisma.militarEquipe.create({
      data: {
        idMilitar: admin.id,
        idEquipe: equipe1.id,
      },
    });

    console.log('Administrador adicionado à Equipe Alpha');

    console.log(' Para fazer login use:');
    console.log('   Matrícula: ADMIN001');
    console.log('   Senha: admin123');
    console.log('  IMPORTANTE: Altere a senha padrão após o primeiro login!');
    
  } catch (error) {
    console.error(' Erro durante o seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar seed se chamado diretamente
if (require.main === module) {
  seed()
    .then(() => {
      console.log(' Seed concluído com sucesso!');
      process.exit(0);
    })
    .catch((error) => {
      console.error(' Erro no seed:', error);
      process.exit(1);
    });
}

export default seed; */