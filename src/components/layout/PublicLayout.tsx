import { Outlet, ScrollRestoration } from "react-router-dom";
import Header from "./Header";
import ContactSection from "../sections/ContactSection";
import Footer from "./Footer";
import Ambient from "../atmosphere/Ambient";
import Cursor from "../atmosphere/Cursor";
import SmoothScroll from "../atmosphere/SmoothScroll";

const PublicLayout = () => (
  <div id="top" className="relative isolate flex min-h-dvh flex-col text-ink">
    <Ambient />
    <SmoothScroll />
    <Header />
    <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
      <Outlet />
    </main>
    <ContactSection />
    <Footer />
    <Cursor />
    <ScrollRestoration />
  </div>
);

export default PublicLayout;
