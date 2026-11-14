import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Wordmark from "../ui/Wordmark";
import Icon from "../ui/Icon";
import { Container } from "../ui/Section";

const AdminLayout = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-dvh flex-col bg-paper text-ink">
      <header className="sticky top-0 z-40 border-b border-rule bg-paper-2 text-ink">
        <Container className="flex h-16 items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Link to="/admin" className="-m-2 p-2" aria-label="Dashboard">
              <Wordmark />
            </Link>
            <span className="hidden text-sm font-semibold text-band-muted sm:inline">Area riservata</span>
          </div>
          <nav aria-label="Admin" className="flex items-center gap-5 text-sm font-medium sm:gap-7">
            <NavLink to="/admin" end className={({ isActive }) => (isActive ? "text-ink" : "text-band-soft hover:text-ink")}>
              Progetti
            </NavLink>
            <a href="/" target="_blank" rel="noreferrer" className="hidden items-center gap-1.5 text-band-soft hover:text-ink sm:inline-flex">
              Vedi il sito <Icon name="arrowUpRight" size={14} />
            </a>
            <button type="button" onClick={logout} className="text-band-soft hover:text-ink">
              Esci
            </button>
          </nav>
        </Container>
      </header>
      <main className="flex-1 py-10 md:py-14">
        <Container>
          <Outlet />
        </Container>
      </main>
    </div>
  );
};

export default AdminLayout;
