import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from "react-router-dom";
import PublicLayout from "./components/layout/PublicLayout";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import AboutPage from "./pages/AboutPage";
import NotFoundPage from "./pages/NotFoundPage";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// The private area is split out of the public bundle.
const LoginPage = lazy(() => import("./pages/LoginPage"));
const AdminLayout = lazy(() => import("./components/layout/AdminLayout"));
const DashboardPage = lazy(() => import("./pages/admin/DashboardPage"));
const ProjectFormPage = lazy(() => import("./pages/admin/ProjectFormPage"));

const Fallback = () => <div className="min-h-dvh bg-paper" aria-busy="true" />;

const AuthArea = () => (
  <AuthProvider>
    <Suspense fallback={<Fallback />}>
      <Outlet />
    </Suspense>
  </AuthProvider>
);

const Protected = ({ children }: { children: ReactNode }) => {
  const { session } = useAuth();
  return session ? children : <Navigate to="/login" replace />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "progetti", element: <ProjectsPage /> },
      { path: "progetti/:id", element: <ProjectDetailPage /> },
      { path: "chisono", element: <AboutPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    element: <AuthArea />,
    children: [
      { path: "/login", element: <LoginPage /> },
      {
        path: "/admin",
        element: (
          <Protected>
            <AdminLayout />
          </Protected>
        ),
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "progetti/nuovo", element: <ProjectFormPage /> },
          { path: "progetti/modifica/:id", element: <ProjectFormPage /> },
        ],
      },
    ],
  },
]);

const App = () => <RouterProvider router={router} />;

export default App;
