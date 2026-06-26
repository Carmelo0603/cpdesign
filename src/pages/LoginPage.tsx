import { useState, type FormEvent } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { supabase } from "../config/supabase";
import { useAuth } from "../contexts/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { session } = useAuth();

  // Se sei già loggato, questa pagina ti rimbalza direttamente nell'admin
  if (session) {
    return <Navigate to="/admin" replace />;
  }

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Se va a buon fine, il router ti sposta sull'admin
      navigate("/admin");
    } catch (err: any) {
      setError(err.message || "Credenziali non valide.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light flex flex-col justify-center items-center p-6 selection:bg-neon selection:text-dark">
      <div className="w-full max-w-md border-8 border-dark bg-light shadow-brutal p-8 md:p-12">
        <h1 className="font-heading font-black text-5xl uppercase tracking-tighter text-dark mb-8 leading-none">
          Accesso
          <br />
          Riservato
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-heading font-black text-xl uppercase text-dark">Identificativo</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-4 border-dark p-4 font-heading font-black text-xl bg-light placeholder:text-dark/30 focus:outline-none focus:bg-neon focus:shadow-brutal transition-all"
              placeholder="ADMIN@CPDESIGN.IT"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-heading font-black text-xl uppercase text-dark">Codice</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-4 border-dark p-4 font-heading font-black text-xl bg-light placeholder:text-dark/30 focus:outline-none focus:bg-neon focus:shadow-brutal transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && <div className="bg-red-500 text-dark font-heading font-black uppercase p-4 border-4 border-dark">[ERRORE] {error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            className={`font-heading font-black text-2xl uppercase p-6 border-4 border-dark mt-4 transition-all ${
              isLoading
                ? "bg-gray-400 text-dark cursor-not-allowed"
                : "bg-dark text-neon shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            }`}
          >
            {isLoading ? "Verifica..." : "Entra →"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
