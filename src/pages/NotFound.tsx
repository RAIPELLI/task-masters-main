import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="glass-card rounded-2xl p-12 text-center w-full max-w-md">
        <h1 className="mb-4 text-6xl font-extrabold text-transparent bg-clip-text gradient-primary animate-pulse-subtle">404</h1>
        <p className="mb-8 text-xl text-slate-600 font-medium">{t('notFound.title')}</p>
        <Link to="/" className="inline-flex items-center justify-center px-6 py-3 rounded-full gradient-hero text-white font-semibold hover:shadow-lg hover:shadow-violet-500/30 transition-all duration-300">
          {t('notFound.returnHome')}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
