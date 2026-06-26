const Footer = () => {
  return (
    <footer className="bg-dark text-light border-t-8 border-dark w-full">
      <div className="p-6 md:p-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="font-heading font-black text-xl md:text-2xl uppercase tracking-tighter">2026 CPDESIGN TUTTI I DIRITTI RISERVATI</div>

        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://linkedin.com/in/carmelo-provenzani-78022a371"
            target="_blank"
            rel="noreferrer"
            className="border-4 border-light px-4 py-2 font-heading font-black text-xl uppercase hover:bg-light hover:text-dark transition-colors"
          >
            [LINKEDIN]
          </a>
          <a
            href="https://github.com/Carmelo0603"
            target="_blank"
            rel="noreferrer"
            className="border-4 border-light px-4 py-2 font-heading font-black text-xl uppercase hover:bg-light hover:text-dark transition-colors"
          >
            [GITHUB]
          </a>
          <a
            href="mailto:carmeloprovenzanil@gmail.com"
            className="border-4 border-light px-4 py-2 font-heading font-black text-xl uppercase hover:bg-light hover:text-dark transition-colors"
          >
            [EMAIL]
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
