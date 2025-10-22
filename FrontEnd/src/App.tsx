import { BrowserRouter, Routes, Route } from "react-router-dom";
import ConfirmarSenha from "./Pages/ConfirmarSenha/ConfirmarSenha.tsx";
import GestaoUsuarios from "./Pages/GestaoUsuario/GestaoUsuario.tsx";
import RecuperarSenha from "./Pages/RecuperarSenha/RecuperarSenha.tsx";
import Ocorrencias from "./Pages/Ocorrencias/Ocorrencias.tsx";
import Visualizacao from "./Pages/Visualizacao/visualizacao.tsx";
import Inicial from "./Pages/Inicial/Inicial.tsx";
import Dashboard from "./Pages/Dashboard/Dashboard.tsx";
import AuditoriaLogs from "./Pages/Auditoria/Auditoria.tsx";
import Configuracoes from "./Pages/Configuracoes/Configuracoes.tsx";
import Login from "./Pages/Login/Login.tsx";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/RecuperarSenha" element={<RecuperarSenha />} />

        <Route path="/ConfirmarSenha" element={<ConfirmarSenha />} />

        <Route path="/GestaoUsuario" element={<GestaoUsuarios />} />

        <Route path="/Ocorrencias" element={<Ocorrencias />} />

        <Route path="/Inicial" element={<Inicial />} />

        <Route path="/Visualizacao/:id" element={<Visualizacao />} />

        <Route path="/Dashboard" element={<Dashboard />} />

        <Route path="/Auditoria" element={<AuditoriaLogs />} />

        <Route path="/Configuracoes" element={<Configuracoes />} />

        <Route path="*" element={<div>404 - Página Não Encontrada</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
