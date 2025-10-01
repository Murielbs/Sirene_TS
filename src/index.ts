import app from './server';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚒 Sistema Corpo de Bombeiros iniciado!`);
  console.log(`🌐 Servidor rodando na porta: ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📚 Ambiente: ${process.env.NODE_ENV || 'development'}`);

  if (process.env.NODE_ENV === 'development') {
    console.log(`\n📋 Rotas disponíveis:`);
    console.log(`   POST /api/auth/login - Login`);
    console.log(`   GET  /api/auth/me - Dados do usuário logado`);
    console.log(`   POST /api/auth/militar - Criar militar (Admin)`);
    console.log(`   GET  /api/auth/militares - Listar militares`);
    console.log(`   GET  /api/auth/militar/:id - Buscar militar`);
    console.log(`   PUT  /api/auth/militar/:id - Atualizar militar`);
    console.log(`   DELETE /api/auth/militar/:id - Remover militar (Admin)`);
  }
});
