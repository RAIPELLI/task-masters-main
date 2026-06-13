import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole, SPECIALTIES } from '@/types';
import { Briefcase, User, Wrench, Mail, Lock, Phone, ArrowRight, CheckCircle, ShieldCheck, BriefcaseBusiness, Users, Sparkles, HardHat, Hammer, Paintbrush, Pipette as Pipe } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const DISPLAY_WORKERS = [
  { name: "Vikram Singh", role: "Expert Plumber", match: "98%", avatar: "VS", color: "bg-blue-100 text-blue-600" },
  { name: "Arjun Nair", role: "Electrician", match: "94%", avatar: "AN", color: "bg-yellow-100 text-yellow-700" },
  { name: "Sneha Patel", role: "Home Cleaner", match: "91%", avatar: "SP", color: "bg-emerald-100 text-emerald-600" },
  { name: "Rahul Verma", role: "Carpenter", match: "88%", avatar: "RV", color: "bg-orange-100 text-orange-600" },
  { name: "Ananya Reddy", role: "House Painter", match: "94%", avatar: "AR", color: "bg-purple-100 text-purple-600" },
  { name: "Karan Johar", role: "AC Technician", match: "85%", avatar: "KJ", color: "bg-cyan-100 text-cyan-600" },
  { name: "Monica Geller", role: "Professional Cook", match: "99%", avatar: "MG", color: "bg-rose-100 text-rose-600" },
  { name: "Priya Sharma", role: "Yoga Instructor", match: "95%", avatar: "PS", color: "bg-violet-100 text-violet-600" },
];

export default function Auth() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, signup, isAuthenticated, user } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>(
    (searchParams.get('mode') as 'login' | 'signup') || 'login'
  );
  const [role, setRole] = useState<UserRole | null>(
    (searchParams.get('role') as UserRole) || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(!!role);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    age: '',
    hourlyRate: '',
    location: '',
    specialties: [] as string[],
    avatar: '',
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'worker' ? '/worker/dashboard' : '/master/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    setIsLoading(true);

    try {
      let authUser;
      if (mode === 'login') {
        authUser = await login(formData.email, formData.password, role);
        toast.success('Welcome back!');
      } else {
        authUser = await signup({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
          role,
          ...(role === 'worker' ? {
            age: parseInt(formData.age),
            hourlyRate: parseFloat(formData.hourlyRate),
            location: formData.location,
            specialties: formData.specialties,
            avatar: formData.avatar
          } : {})
        });
        toast.success('Account created successfully!');
      }
      const dashboardPath = authUser.role === 'worker' ? '/worker/dashboard' : '/master/dashboard';
      navigate(dashboardPath);
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden flex items-center justify-center p-4">

      {/* --- SCROLLING BACKGROUND (SERVICE WORKERS) --- */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30 select-none">
        <div className="flex flex-col gap-10 py-20 -rotate-12 scale-125 origin-center">
          <div className="flex animate-marquee gap-10">
            {[...DISPLAY_WORKERS, ...DISPLAY_WORKERS].map((w, i) => (
              <div key={i} className="min-w-[300px] bg-white rounded-3xl p-5 shadow-xl shadow-slate-200/50 flex items-center gap-4 border border-slate-100/50">
                <div className={`w-14 h-14 rounded-2xl ${w.color} flex items-center justify-center font-bold text-lg shadow-inner`}>{w.avatar}</div>
                <div>
                  <div className="font-extrabold text-slate-900 tracking-tight">{w.name}</div>
                  <div className="text-sm text-slate-500 font-semibold">{w.role}</div>
                </div>
                <div className="ml-auto text-emerald-500 font-black text-sm">{w.match} match</div>
              </div>
            ))}
          </div>
          <div className="flex animate-marquee-reverse gap-10 ml-[-400px]">
            {[...DISPLAY_WORKERS.reverse(), ...DISPLAY_WORKERS].map((w, i) => (
              <div key={i} className="min-w-[300px] bg-white rounded-3xl p-5 shadow-xl shadow-slate-200/50 flex items-center gap-4 border border-slate-100/50">
                <div className={`w-14 h-14 rounded-2xl ${w.color} flex items-center justify-center font-bold text-lg shadow-inner`}>{w.avatar}</div>
                <div>
                  <div className="font-extrabold text-slate-900 tracking-tight">{w.name}</div>
                  <div className="text-sm text-slate-500 font-semibold">{w.role}</div>
                </div>
                <div className="ml-auto text-blue-500 font-black text-sm">{w.match} match</div>
              </div>
            ))}
          </div>
          <div className="flex animate-marquee gap-10 ml-[-200px]">
            {[...DISPLAY_WORKERS, ...DISPLAY_WORKERS].map((w, i) => (
              <div key={i} className="min-w-[300px] bg-white rounded-3xl p-5 shadow-xl shadow-slate-200/50 flex items-center gap-4 border border-slate-100/50">
                <div className={`w-14 h-14 rounded-2xl ${w.color} flex items-center justify-center font-bold text-lg shadow-inner`}>{w.avatar}</div>
                <div>
                  <div className="font-extrabold text-slate-900 tracking-tight">{w.name}</div>
                  <div className="text-sm text-slate-500 font-semibold">{w.role}</div>
                </div>
                <div className="ml-auto text-violet-500 font-black text-sm">{w.match} match</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10 grid lg:grid-cols-2 gap-16 items-center">

        {/* --- LEFT CONTENT (TASK MASTERS THEMED) --- */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hidden lg:block space-y-10"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-emerald-50/90 backdrop-blur-md text-emerald-600 text-sm font-black border border-emerald-100 shadow-sm">
            <Sparkles className="w-4 h-4 fill-emerald-500" />
            AI-Powered Service Matcher
          </div>

          <h1 className="text-[5.5rem] font-black text-slate-950 leading-[0.95] tracking-tighter">
            <span className="text-emerald-500">Book</span> Smart,<br />
            <span className="text-indigo-600">Work</span> Smart
          </h1>

          <p className="text-2xl text-slate-600 max-w-xl leading-relaxed font-medium">
            Project TaskMasters uses intelligent AI dispatching to connect local service experts with busy homeowners in seconds.
          </p>

          <div className="flex items-center gap-16 pt-6">
            <div className="relative group">
              <div className="text-4xl font-black text-slate-950 mb-1">50K+</div>
              <div className="text-xs text-slate-400 font-black uppercase tracking-[0.2em]">Services Completed</div>
              <div className="absolute -left-4 top-0 w-1 h-full bg-emerald-500 rounded-full scale-y-0 group-hover:scale-y-100 transition-transform" />
            </div>
            <div className="relative group">
              <div className="text-4xl font-black text-slate-950 mb-1">100+</div>
              <div className="text-xs text-slate-400 font-black uppercase tracking-[0.2em]">Expert Categories</div>
              <div className="absolute -left-4 top-0 w-1 h-full bg-indigo-600 rounded-full scale-y-0 group-hover:scale-y-100 transition-transform" />
            </div>
            <div className="relative group">
              <div className="text-4xl font-black text-slate-950 mb-1">4.9/5</div>
              <div className="text-xs text-slate-400 font-black uppercase tracking-[0.2em]">Customer Rating</div>
              <div className="absolute -left-4 top-0 w-1 h-full bg-blue-500 rounded-full scale-y-0 group-hover:scale-y-100 transition-transform" />
            </div>
          </div>
        </motion.div>

        {/* --- RIGHT CONTENT (ROLE SELECTION) --- */}
        <div className="flex justify-center lg:justify-end w-full">
          <AnimatePresence mode="wait">
            {!showForm ? (
              <motion.div
                key="selection"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.5, ease: "backOut" }}
                className="w-full max-w-[460px] bg-white/90 backdrop-blur-2xl rounded-[3rem] shadow-[0_32px_96px_-12px_rgba(0,0,0,0.12)] p-12 border border-white relative overflow-hidden"
              >
                <div className="text-center mb-12">
                  <div className="w-20 h-20 bg-slate-950 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                    <BriefcaseBusiness className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-4xl font-black text-slate-950 tracking-tight">{t('auth.welcome')}</h2>
                  <p className="text-slate-500 font-bold mt-3 text-lg">{t('auth.choosePortal')}</p>
                  <div className="w-16 h-1.5 bg-indigo-600 mx-auto mt-8 rounded-full shadow-lg shadow-indigo-200" />
                </div>

                <div className="space-y-5">
                  <button
                    onClick={() => handleRoleSelect('master')}
                    className="w-full group p-7 rounded-[2.5rem] border-2 border-slate-50 bg-white hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 flex items-center gap-5 text-left active:scale-[0.98]"
                  >
                    <div className="w-14 h-14 rounded-3xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-inner">
                      <Users className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <div className="font-black text-slate-950 uppercase text-xs tracking-[0.15em] mb-1.5">{t('auth.customer.title')}</div>
                      <div className="text-sm text-slate-500 font-bold leading-tight group-hover:text-slate-950 transition-colors">{t('auth.customer.desc')}</div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-soft">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </button>

                  <button
                    onClick={() => handleRoleSelect('worker')}
                    className="w-full group p-7 rounded-[2.5rem] border-2 border-slate-50 bg-white hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-100 transition-all duration-500 flex items-center gap-5 text-left active:scale-[0.98]"
                  >
                    <div className="w-14 h-14 rounded-3xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 shadow-inner">
                      <Wrench className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <div className="font-black text-slate-950 uppercase text-xs tracking-[0.15em] mb-1.5">{t('auth.worker.title')}</div>
                      <div className="text-sm text-slate-500 font-bold leading-tight group-hover:text-slate-950 transition-colors">{t('auth.worker.desc')}</div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 shadow-soft">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </button>
                </div>

                <div className="text-center mt-10">
                  <p className="text-sm text-slate-400 font-bold">
                    Looking for something else? {' '}
                    <button onClick={() => { setMode('login'); setShowForm(true); setRole('master'); }} className="text-indigo-600 font-black hover:underline underline-offset-4 decoration-2">Sign In Directly</button>
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, rotateY: 90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: -90 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                className="w-full max-w-[500px] bg-white/95 backdrop-blur-3xl rounded-[3.5rem] shadow-[0_48px_128px_-24px_rgba(0,0,0,0.15)] p-10 border border-white overflow-y-auto max-h-[95vh] custom-scrollbar selection:bg-indigo-100"
              >
                <div className="flex items-center justify-between mb-10">
                  <button
                    onClick={() => setShowForm(false)}
                    className="flex items-center gap-2.5 text-xs font-black text-slate-400 hover:text-indigo-600 transition-all uppercase tracking-widest group"
                  >
                    <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                    {t('auth.back')}
                  </button>
                  <Link to="/" className="w-10 h-10 rounded-2xl bg-slate-950 flex items-center justify-center shadow-lg shadow-slate-200">
                    <Briefcase className="w-5 h-5 text-white" />
                  </Link>
                </div>

                <div className="mb-10">
                  <h2 className="text-4xl font-black text-slate-950 mb-3 tracking-tighter">
                    {mode === 'login' ? t('auth.signIn') : t('auth.register')}
                  </h2>
                  <p className="text-slate-500 font-bold text-lg">
                    {mode === 'login' ? 'Access your dashboard' : `Joining as a ${role}`}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {mode === 'signup' && (
                    <>
                      <div className="space-y-2">
                        <Label className="font-black text-slate-950 text-xs uppercase tracking-widest ml-1">{t('auth.fullName')}</Label>
                        <Input
                          placeholder="Your official name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-100 font-bold placeholder:text-slate-300"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-black text-slate-950 text-xs uppercase tracking-widest ml-1">{t('auth.phone')}</Label>
                        <Input
                          placeholder="+91 00000 00000"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-100 font-bold placeholder:text-slate-300"
                        />
                      </div>

                      {role === 'worker' && (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="font-black text-slate-950 text-xs uppercase tracking-widest ml-1">Age</Label>
                              <Input
                                type="number"
                                placeholder="Yr"
                                value={formData.age}
                                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-100 font-bold placeholder:text-slate-300"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="font-black text-slate-950 text-xs uppercase tracking-widest ml-1">Rate (₹/hr)</Label>
                              <Input
                                type="number"
                                placeholder="Qty"
                                value={formData.hourlyRate}
                                onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                                className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-100 font-bold placeholder:text-slate-300"
                                required
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="font-black text-slate-950 text-xs uppercase tracking-widest ml-1">Work Location</Label>
                            <Input
                              placeholder="City / Area"
                              value={formData.location}
                              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                              className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-100 font-bold placeholder:text-slate-300"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="font-black text-slate-950 text-xs uppercase tracking-widest ml-1">Specialties</Label>
                            <div className="flex flex-wrap gap-2 p-4 border rounded-[2rem] border-slate-100 bg-slate-50/50 max-h-40 overflow-y-auto shadow-inner">
                              {SPECIALTIES.map((s) => {
                                const isSelected = formData.specialties.includes(s);
                                return (
                                  <button
                                    key={s}
                                    type="button"
                                    onClick={() => {
                                      setFormData({
                                        ...formData,
                                        specialties: isSelected
                                          ? formData.specialties.filter(item => item !== s)
                                          : [...formData.specialties, s]
                                      });
                                    }}
                                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${isSelected ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105' : 'bg-white text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
                                  >
                                    {s}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}

                  <div className="space-y-2">
                    <Label className="font-black text-slate-950 text-xs uppercase tracking-widest ml-1">{t('auth.email')}</Label>
                    <Input
                      type="email"
                      placeholder="hello@taskmasters.io"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-100 font-bold placeholder:text-slate-300"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="font-black text-slate-950 text-xs uppercase tracking-widest ml-1">{t('auth.password')}</Label>
                      {mode === 'login' && <button type="button" className="text-xs font-bold text-indigo-600 hover:underline">Forgot?</button>}
                    </div>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-100 font-bold placeholder:text-slate-300"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    className="w-full h-16 rounded-[2rem] text-xl font-black shadow-2xl shadow-indigo-400/30 mt-8 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    disabled={isLoading}
                  >
                    {isLoading ? t('processing') : mode === 'login' ? t('auth.enterDashboard') : t('auth.completeSetup')}
                  </Button>

                  <div className="text-center pt-8">
                    <p className="text-sm font-bold text-slate-400">
                      {mode === 'login' ? "New to the platform?" : "Joined us before?"} {' '}
                      <button
                        type="button"
                        onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                        className="text-indigo-600 font-black hover:underline underline-offset-4 decoration-2"
                      >
                        {mode === 'login' ? 'Create Account' : 'Sign In Now'}
                      </button>
                    </p>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-10 left-10 flex items-center gap-4 group">
        <div className="w-10 h-10 rounded-2xl bg-slate-950 flex items-center justify-center text-white text-sm font-black shadow-2xl group-hover:rotate-12 transition-transform duration-500">TM</div>
        <div className="flex flex-col">
          <span className="text-slate-950 text-xs font-black uppercase tracking-[0.3em]">Task Masters</span>
          <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-0.5">Core Engine v2.0</span>
        </div>
      </div>
    </div>
  );
}
