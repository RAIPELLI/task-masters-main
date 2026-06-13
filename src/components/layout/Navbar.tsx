import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Briefcase, LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '@/components/LanguageSelector';
import { VoiceSearch } from '@/components/voice/VoiceSearch';

export function Navbar() {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dashboardPath = user?.role === 'worker' ? '/worker/dashboard' : '/master/dashboard';

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getLinkClasses = (path: string) => {
    if (isActive(path)) {
      return "px-5 py-2 text-sm font-semibold text-white gradient-hero rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all";
    }
    return "px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
            WorkHub
          </span>
        </Link>

        {/* Center Pill Navigation (Desktop) */}
        <div className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2 bg-white border border-slate-100 shadow-sm rounded-full px-2 py-1.5 gap-1">
          {isAuthenticated ? (
            <>
              <Link
                to={dashboardPath}
                className={getLinkClasses(dashboardPath)}
              >
                {t('nav.dashboard')}
              </Link>
              {user?.role === 'master' && (
                <Link
                  to="/workers"
                  className={getLinkClasses('/workers')}
                >
                  {t('nav.findWorkers')}
                </Link>
              )}
              <Link
                to="/bookings"
                className={getLinkClasses('/bookings')}
              >
                {t('nav.myBookings')}
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/workers"
                className={getLinkClasses('/workers')}
              >
                {t('nav.findWorkers')}
              </Link>
              <Link
                to="/auth?mode=login"
                className={isActive('/auth') && new URLSearchParams(location.search).get('mode') === 'login'
                  ? "px-5 py-2 text-sm font-semibold text-white gradient-hero rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                  : "px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all"}
              >
                {t('nav.signIn')}
              </Link>
              <Link
                to="/auth?mode=signup"
                className={isActive('/auth') && new URLSearchParams(location.search).get('mode') === 'signup'
                  ? "px-5 py-2 text-sm font-semibold text-white gradient-hero rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                  : "px-5 py-2 text-sm font-semibold text-white gradient-hero rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"}
              >
                {t('nav.getStarted')}
              </Link>
            </>
          )}
        </div>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {/* Voice AI Assistant */}
              <div className="mr-2">
                <VoiceSearch className="w-10 h-10" />
              </div>

              <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </button>

              <div className="flex items-center gap-2 pl-2">
                <LanguageSelector />
                <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-full p-1 pr-4 shadow-sm hover:shadow-md transition-all cursor-pointer group" onClick={handleLogout}>
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white font-semibold text-sm group-hover:scale-105 transition-transform">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-700">{user?.name?.split(' ')[0]}</span>
                    <LogOut className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-500 transition-colors" />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <LanguageSelector />
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100 p-4 space-y-2 animate-slide-up shadow-xl absolute w-full left-0">
          {isAuthenticated ? (
            <>
              <Link
                to={user?.role === 'worker' ? '/worker/dashboard' : '/master/dashboard'}
                className="flex items-center gap-3 p-3 text-slate-700 font-medium hover:bg-slate-50 rounded-xl"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.dashboard')}
              </Link>
              
              {/* Voice AI Assistant (Mobile) */}
              <div className="flex items-center justify-between p-3 bg-primary/5 rounded-xl border border-primary/10">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-primary">Voice Assistant</span>
                  <span className="text-[10px] text-muted-foreground">Tap to book instantly</span>
                </div>
                <VoiceSearch className="w-12 h-12" />
              </div>

              {user?.role === 'master' && (
                <Link
                  to="/workers"
                  className="flex items-center gap-3 p-3 text-slate-700 font-medium hover:bg-slate-50 rounded-xl"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('nav.findWorkers')}
                </Link>
              )}
              <Link
                to="/bookings"
                className="flex items-center gap-3 p-3 text-slate-700 font-medium hover:bg-slate-50 rounded-xl"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.myBookings')}
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 text-red-600 font-medium hover:bg-red-50 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
                {t('nav.signOut')}
              </button>
            </>
          ) : (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between px-2">
                <span className="text-sm font-medium text-slate-500">Language / భాష</span>
                <LanguageSelector />
              </div>
              <Link to="/workers" onClick={() => setIsMobileMenuOpen(false)} className="block">
                <Button variant="ghost" className="w-full justify-start">{t('nav.findWorkers')}</Button>
              </Link>
              <div className="grid grid-cols-2 gap-3">
                <Link to="/auth?mode=login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">{t('nav.signIn')}</Button>
                </Link>
                <Link to="/auth?mode=signup" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="hero" className="w-full">{t('nav.getStarted')}</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
