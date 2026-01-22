import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavigationLoader from "./components/NavigationLoader";
import ProtectedRoute from "./components/ProtectedRoute";
//prueba 
// páginas…

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import { Login } from './pages/Login';
import MiCuenta from './pages/MiCuenta';
import Principios from './pages/Principios';
import Mision from './pages/Mision';
import Vision from './pages/Vision';
import Circuitos from './pages/Circuitos';
import JuntaDirectiva from './pages/JuntaDirectiva';
import IglesiasCRUD from './pages/IglesiasCRUD';
import EventosCRUD from './pages/eventosCRUD';
import InventarioCRUD from './pages/InventarioCURD';
import DocumentosCRUD from './pages/DocumentosCRUD';
import UsuariosCRUD from './pages/UserCRUD'
import ReportesEventosCRUD from './pages/ReportesEventosCRUD';
import Bitacora from './pages/Bitacora';
import IglesiasPublicas from "./pages/IglesiasPublicas";
import EventosPublicos from "./pages/EventosPublicos";
import HistorialParticipacion from "./pages/HistorialParticipacion";
import EstadisticasEventos from "./pages/EstadisticasEventos";


function App() {
  return (
    <BrowserRouter>
      <NavigationLoader>
        <Routes>
          {/* Páginas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/principios" element={<Principios />} />
          <Route path="/mision" element={<Mision />} />
          <Route path="/vision" element={<Vision />} />
          <Route path="/circuitos" element={<Circuitos />} />
          <Route path="/juntadirectiva" element={<JuntaDirectiva />} />
          <Route path="/iglesias-publicas" element={<IglesiasPublicas />} />
          <Route path="/eventos-publicos" element={<EventosPublicos />} />

          {/* Protegidas */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/micuenta"
            element={
              <ProtectedRoute>
                <MiCuenta />
              </ProtectedRoute>
            }
          />

          <Route
            path="/iglesiascrud"
            element={
              <ProtectedRoute
                allowedRoles={["presidente regional", "admin_sistema"]}
              >
                <IglesiasCRUD />
              </ProtectedRoute>
            }
          />

          <Route
            path="/eventoscrud"
            element={
              <ProtectedRoute
                allowedRoles={["presidente regional", "admin_sistema"]}
              >
                <EventosCRUD />
              </ProtectedRoute>
            }
          />

          <Route
            path="/inventariocrud"
            element={
              <ProtectedRoute
                allowedRoles={["presidente regional", "admin_sistema"]}
              >
                <InventarioCRUD />
              </ProtectedRoute>
            }
          />

          <Route
            path="/documentoscrud"
            element={
              <ProtectedRoute
                allowedRoles={["presidente regional", "admin_sistema"]}
              >
                <DocumentosCRUD />
              </ProtectedRoute>
            }
          />


          <Route 
            path="/usuarioscrud"
            element={
              <ProtectedRoute allowedRoles={["presidente regional","admin_sistema"]}>
                <UsuariosCRUD />
              </ProtectedRoute>
            }
          />

          

          <Route
            path="/bitacora"
            element={
              <ProtectedRoute
                allowedRoles={["admin_sistema", "presidente regional"]}
              >
                <Bitacora />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reporteseventoscrud"
            element={
              <ProtectedRoute
                allowedRoles={["admin_sistema", "presidente regional"]}
              >
                <ReportesEventosCRUD />
              </ProtectedRoute>
            }
          />

           <Route
            path="/historialparticipacion"
            element={
              <ProtectedRoute
                allowedRoles={["admin_sistema", "presidente regional"]}
              >
                <HistorialParticipacion />
              </ProtectedRoute>
            }
          />
          <Route
            path="/estadisticaseventos"
            element={
              <ProtectedRoute
                allowedRoles={["admin_sistema", "presidente regional"]}
              >
                <EstadisticasEventos />
              </ProtectedRoute>
            }
          />

        </Routes>
      </NavigationLoader>
    </BrowserRouter>
  );
}

export default App;
