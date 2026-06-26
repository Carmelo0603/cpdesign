import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const AdminLayout = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/login"); // Dopo il logout ti rimbalzo fuori
  };

  return (
    <div className="min-h-screen bg-light text-dark font-body selection:bg-neon selection:text-dark flex flex-col md:flex-row w-full">
      {/* Sidebar Brutalista */}
      <aside className="w-full md:w-72 border-b-8 md:border-b-0 md:border-r-8 border-dark bg-dark text-light flex flex-col justify-between p-6 md:p-8 shrink-0">
        <div>
          <h2 className="font-heading font-black text-4xl uppercase tracking-tighter text-neon mb-12 border-b-4 border-neon pb-4 inline-block">
            CP&lt;ADMIN&gt;
          </h2>
          <nav className="flex flex-col gap-6 font-heading font-black text-2xl uppercase">
            <Link to="/admin" className="hover:text-neon hover:translate-x-2 transition-transform">
              &rarr; Progetti
            </Link>
            {/* Se in futuro vorrai aggiungere un gestore per le tue skill, lo metterai qui */}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="bg-light text-dark font-heading font-black text-xl uppercase py-4 border-4 border-dark hover:bg-neon hover:translate-x-1 hover:translate-y-1 transition-all mt-12 w-full"
        >
          Disconnessione
        </button>
      </aside>

      {/* Area di Lavoro Principale (Qui viene renderizzato l'Outlet) */}
      <main className="flex-grow p-6 md:p-12 overflow-y-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
