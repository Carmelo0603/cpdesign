import { Outlet } from "react-router-dom";
import Header from "./Header";
import ContactSection from "../sections/ContactSection";
import Footer from "./Footer";

const PublicLayout = () => {
  return (
    <div className="font-body bg-light text-dark min-h-screen selection:bg-neon selection:text-dark flex flex-col items-center">
      <Header />

      <main className="flex flex-col w-full flex-grow">
        <Outlet />
      </main>

      <ContactSection />
      <Footer />
    </div>
  );
};

export default PublicLayout;
