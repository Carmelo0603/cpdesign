import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import PublicLayout from "./components/layout/PublicLayout";
import Hero from "./components/sections/Hero";
import Projects from "./components/sections/Projects";
import ProjectsPage from "./pages/ProjectsPage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import AdminLayout from "./components/layout/AdminLayout";
import DashboardPage from "./pages/admin/DashboardPage";
import NewProjectPage from "./pages/admin/NewProjectPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import EditProjectPage from "./pages/admin/EditProjectPage";
import {type JSX} from "react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { session } = useAuth();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rotte Pubbliche */}
          <Route path="/" element={<PublicLayout />}>
            <Route
              index
              element={
                <>
                  <Hero />
                  <Projects />
                </>
              }
            />
            <Route path="progetti" element={<ProjectsPage />} />
            <Route path="chisono" element={<AboutPage />} />
            <Route path="progetti/:id" element={<ProjectDetailPage />} />
          </Route>

          {/* Rotta di Login (Senza Header e Footer) */}
          <Route path="/login" element={<LoginPage />} />

          {/* Rotte Private (Area Admin) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {/* L'indice dell'area admin è la Dashboard */}
            <Route index element={<DashboardPage />} />
            {/* Inseriremo qui la rotta per creare/modificare i progetti */}
            <Route path="progetti/modifica/:id" element={<EditProjectPage />} />
            <Route path="progetti/nuovo" element={<NewProjectPage />} /> <Route path="progetti/:id" element={<ProjectDetailPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
