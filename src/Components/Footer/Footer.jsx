import "./Footer.css";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      className="site-footer bg-slate-900 text-slate-300 dark:bg-black dark:text-slate-400"
      role="contentinfo"
    >
      <div className="footer-inner container mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center place-items-center">
        <div className="col about">
          <h4 className="ft-title font-bold text-lg mb-3">Sobre Noticias UDLA</h4>
          <p className="ft-about text-slate-400">
            Noticias UDLA ofrece cobertura ágil y confiable de la actualidad en
            todo el mundo.
          </p>
        </div>
        <div className="col contact">
          <h4 className="ft-title font-bold text-lg mb-3">Contacto</h4>
          <ul className="ft-links space-y-2">
            <li>
              <a
                href="mailto:contacto@noticiasua.com"
                className="hover:underline underline-offset-4 transition-all"
              >
                contacto@noticiasudla.com
              </a>
            </li>
            <li>
              <a
                href="tel:+573001234567"
                className="hover:underline underline-offset-4 transition-all"
              >
                +57 123 456 7890
              </a>
            </li>
          </ul>
        </div>

        <div className="col social">
          <h4 className="ft-title font-bold text-lg mb-3">Redes</h4>
          <div className="ft-social inline-flex gap-3 justify-center">
            <a
              className="social-btn rounded-full hover:bg-[#1E3A8A] hover:text-white transition-all duration-200 ease-in-out hover:scale-105"
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X / Twitter"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="M18.9 3H22l-7.7 8.8L23.5 21H17l-5-6.1L6 21H2.9l8.3-9.5L1.5 3H8l4.6 5.6L18.9 3Z" />
              </svg>
            </a>
            <a
              className="social-btn rounded-full hover:bg-[#1E3A8A] hover:text-white transition-all duration-200 ease-in-out hover:scale-105"
              href="https://facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="M22 12.06C22 6.48 17.52 2 11.94 2S1.88 6.48 1.88 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.42V9.94c0-2.4 1.43-3.73 3.62-3.73 1.05 0 2.16.19 2.16.19v2.37h-1.22c-1.2 0-1.58.75-1.58 1.52v1.82h2.69l-.43 2.9h-2.26V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
              </svg>
            </a>
            <a
              className="social-btn rounded-full hover:bg-[#1E3A8A] hover:text-white transition-all duration-200 ease-in-out hover:scale-105"
              href="https://instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" />
                <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="footer-legal border-t border-white/10 mt-8 pt-4">
        <p className="text-center text-sm text-slate-500">
          © {year} Noticias UDLA — Todos los derechos reservados
        </p>
      </div>
    </footer>
  );
};

export default Footer;
