import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { api } from '@/lib/api';
import {
  Briefcase,
  Search,
  Shield,
  Star,
  Users,
  Zap,
  ArrowRight,
  CheckCircle,
  MapPin,
  UserPlus,
  Wrench,
  User
} from 'lucide-react';

const features = [
  {
    icon: Search,
    title: 'Find Skilled Workers',
    description: 'Browse verified professionals across 15+ service categories in your area.',
  },
  {
    icon: Shield,
    title: 'Trusted & Verified',
    description: 'All workers are background-verified with ratings and reviews from real customers.',
  },
  {
    icon: Zap,
    title: 'Quick Booking',
    description: 'Send booking requests and get quotes within minutes, not hours.',
  },
  {
    icon: Star,
    title: 'Quality Guaranteed',
    description: 'Satisfaction guaranteed with our rating system and dispute resolution.',
  },
];

const popularServices = [
  'Electrician', 'Plumber', 'Carpenter', 'Painter', 'Cleaner', 'AC Repair'
];

export default function Index() {
  const { t } = useTranslation();
  const [statsData, setStatsData] = useState({
    workerCount: 0,
    jobCount: 0,
    avgRating: 0,
    cityCount: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.stats();
        setStatsData(data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { value: `${statsData.workerCount}+`, label: t('stats.skilledWorkers') },
    { value: `${statsData.jobCount}+`, label: t('stats.jobsCompleted') },
    { value: statsData.avgRating.toFixed(1), label: t('stats.averageRating') },
    { value: `${statsData.cityCount}+`, label: t('stats.citiesCovered') },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 gradient-hero opacity-5" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
                <Zap className="w-4 h-4" />
                <span>{t('hero.trustedBy', { count: statsData.cityCount })}</span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight mb-6 animate-slide-up">
                {t('hero.title')}
                <br />
                <span className="gradient-text">{t('hero.nearYou')}</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                {t('hero.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row items-center sm:items-start lg:items-center justify-start gap-4 mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <Link to="/workers">
                  <Button variant="hero" size="xl" className="group shadow-glow">
                    {t('cta.findWorkers')}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/auth?mode=signup&role=worker">
                  <Button variant="outline" size="xl">
                    {t('cta.joinAsWorker')}
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <span className="text-sm text-muted-foreground mr-2">{t('popular')}</span>
                {popularServices.map((service) => (
                  <Link
                    key={service}
                    to={`/workers?specialty=${service}`}
                    className="px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {service}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right mockup card */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="w-full max-w-md rounded-3xl glass-card p-6 md:p-8 shadow-glow animate-scale-in">
                <div className="w-16 h-16 rounded-xl gradient-hero flex items-center justify-center mb-4">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-1">Welcome</h3>
                <p className="text-sm text-muted-foreground mb-6">Choose your portal</p>

                <div className="space-y-3">
                  <Link to="/auth?mode=signup&role=customer" className="block">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/60 dark:bg-black/30 border border-white/30 hover:translate-x-1 transition-transform cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold">Customer</div>
                          <div className="text-xs text-muted-foreground">I need to hire help for tasks</div>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </Link>

                  <Link to="/auth?mode=signup&role=worker" className="block">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/60 dark:bg-black/30 border border-white/30 hover:translate-x-1 transition-transform cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                          <Wrench className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold">Worker</div>
                          <div className="text-xs text-muted-foreground">I want to offer my services</div>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </Link>
                </div>

                <div className="text-xs text-muted-foreground text-center mt-4">
                  Looking for something else? <Link to="/auth" className="text-primary font-medium">Sign In</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 glass border-y border-white/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600 mb-1 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {t('whyChoose.title')}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
              {t('whyChoose.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Search, title: t('features.search.title'), desc: t('features.search.desc') },
              { icon: Shield, title: t('features.verify.title'), desc: t('features.verify.desc') },
              { icon: Zap, title: t('features.quick.title'), desc: t('features.quick.desc') },
              { icon: Star, title: t('features.quality.title'), desc: t('features.quality.desc') },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-8 rounded-3xl glass-card group hover:-translate-y-2 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl gradient-hero flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-violet-500/30">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('howItWorks.title')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('howItWorks.subtitle')}
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: '1', title: t('howItWorks.step1.title'), desc: t('howItWorks.step1.desc') },
                { step: '2', title: t('howItWorks.step2.title'), desc: t('howItWorks.step2.desc') },
                { step: '3', title: t('howItWorks.step3.title'), desc: t('howItWorks.step3.desc') },
              ].map((item, index) => (
                <div key={index} className="relative text-center">
                  <div className="w-16 h-16 rounded-full gradient-hero text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto mb-4 shadow-glow">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-border" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto rounded-3xl gradient-hero p-8 md:p-12 text-center shadow-glow">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              {t('ready.title')}
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              {t('ready.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth?mode=signup">
                <Button variant="glass" size="lg" className="text-primary-foreground">
                  {t('cta.signUpFree')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/workers">
                <Button variant="glass" size="lg" className="text-primary-foreground">
                  {t('cta.browseWorkers')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 glass border-t border-white/20 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center shadow-lg shadow-violet-500/20">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                Work<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">Hub</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 font-medium">
              © 2024 WorkHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
