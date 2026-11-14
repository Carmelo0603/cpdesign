import { useEffect, useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/Button";
import { ErrorNote, Field, TextInput } from "../components/ui/Field";
import Wordmark from "../components/ui/Wordmark";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    document.title = "Accesso — CPDESIGN";
  }, []);

  if (session) return <Navigate to="/admin" replace />;

  const login = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) {
      setError(authError.message === "Invalid login credentials" ? "Email o password non corrette." : authError.message);
      return;
    }
    navigate("/admin", { replace: true });
  };

  return (
    <div className="flex min-h-dvh flex-col bg-paper text-ink">
      <header className="border-b border-rule bg-paper-2 text-ink">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center px-4 sm:px-6 lg:px-10">
          <Link to="/" className="-m-2 p-2" aria-label="Torna al sito">
            <Wordmark />
          </Link>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm border-t-4 border-ink pt-8">
          <h1 className="text-headline font-bold">Accesso</h1>
          <p className="mt-3 text-ink-2">Area riservata per gestire i progetti del portfolio.</p>
          <form onSubmit={login} className="mt-10 flex flex-col gap-5">
            <Field label="Email">
              <TextInput type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
            <Field label="Password">
              <TextInput type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </Field>
            {error && <ErrorNote>{error}</ErrorNote>}
            <Button type="submit" size="lg" icon={loading ? undefined : "arrowRight"} disabled={loading} className="mt-2 w-full">
              {loading ? "Verifica…" : "Entra"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
