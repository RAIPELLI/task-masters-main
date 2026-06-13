import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Booking } from '@/types';
import { BookingCard } from '@/components/bookings/BookingCard';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import {
  Search,
  Calendar,
  CheckCircle,
  Clock,
  Plus,
  IndianRupee,
} from 'lucide-react';

export default function MasterDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await api.bookings.list();
        setBookings(data);
      } catch (error) {
        console.error('Failed to load bookings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchBookings();
      const interval = setInterval(fetchBookings, 5000); // Poll every 5s
      return () => clearInterval(interval);
    }
  }, [user]);

  const stats = [
    { icon: Calendar, label: t('dashboard.stats.total'), value: bookings.length, color: 'gradient-hero', bgColor: 'bg-violet-500/10 border-violet-200/50' },
    { icon: Clock, label: t('dashboard.stats.pending'), value: bookings.filter(b => b.status === 'pending').length, color: 'bg-amber-500', bgColor: 'bg-amber-500/10 border-amber-200/50' },
    { icon: CheckCircle, label: t('dashboard.stats.completed'), value: bookings.filter(b => b.status === 'completed').length, color: 'bg-emerald-500', bgColor: 'bg-emerald-500/10 border-emerald-200/50' },
    { icon: IndianRupee, label: t('dashboard.stats.penalty'), value: `₹${user?.penaltyAmount || 0}`, color: 'bg-rose-500', bgColor: 'bg-rose-500/10 border-rose-200/50' },
  ];

  const handleConfirm = async (bookingId: string) => {
    try {
      await api.bookings.update(parseInt(bookingId), { status: 'confirmed' });
      setBookings(prev =>
        prev.map(b => (b.id === bookingId ? { ...b, status: 'confirmed' as const } : b))
      );
      toast.success('Booking confirmed!');
    } catch (error) {
      toast.error('Failed to confirm booking');
    }
  };

  const handleCancel = async (bookingId: string, reason?: string) => {
    try {
      await api.bookings.update(parseInt(bookingId), { status: 'cancelled', cancellation_reason: reason });
      setBookings(prev =>
        prev.map(b => (b.id === bookingId ? { ...b, status: 'cancelled' as const } : b))
      );
      if (reason) {
        // If reason implies confirmed booking cancellation (penalty apply), reload page or user to get new balance?
        // For simplicity, just toast.
        toast.info('Booking cancelled (with penalty if applicable)');
        // Reload user data to update penalty? Ideally we update context.
        window.location.reload();
      } else {
        toast.info('Booking cancelled');
      }
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  const handleRate = async (bookingId: string, rating: number, review: string) => {
    try {
      await api.bookings.update(parseInt(bookingId), { rating, review });
      setBookings(prev =>
        prev.map(b => (b.id === bookingId ? { ...b, rating, review } : b))
      );
      toast.success('Thank you for your feedback!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit rating');
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">{t('dashboard.loading')}</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {t('dashboard.welcome', { name: user?.name?.split(' ')[0] })}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t('dashboard.manage')}
            </p>
          </div>

          <Link to="/workers">
            <Button variant="hero" size="lg">
              <Search className="w-4 h-4 mr-2" />
              {t('nav.findWorkers')}
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`rounded-2xl p-6 relative overflow-hidden group backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 border ${stat.bgColor || 'bg-white/60 border-white/50'}`}
            >
              <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
                <stat.icon className="w-16 h-16" />
              </div>
              <div className="flex items-center gap-3 mb-3 relative z-10">
                <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground mb-1 relative z-10">{stat.value}</div>
              <div className="text-sm text-muted-foreground relative z-10">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="glass-card rounded-2xl p-8 mb-8">
          <h2 className="text-xl font-bold text-foreground mb-6">{t('dashboard.quickActions')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/workers?specialty=Electrician">
              <Button variant="outline" className="w-full h-auto py-6 flex flex-col gap-3 hover:border-primary/50 hover:bg-primary/5 border-dashed border-2">
                <span className="text-3xl bg-blue-100 p-2 rounded-full">⚡</span>
                <span className="font-semibold">Electrician</span>
              </Button>
            </Link>
            <Link to="/workers?specialty=Plumber">
              <Button variant="outline" className="w-full h-auto py-6 flex flex-col gap-3 hover:border-primary/50 hover:bg-primary/5 border-dashed border-2">
                <span className="text-3xl bg-cyan-100 p-2 rounded-full">🔧</span>
                <span className="font-semibold">Plumber</span>
              </Button>
            </Link>
            <Link to="/workers?specialty=Cleaner">
              <Button variant="outline" className="w-full h-auto py-6 flex flex-col gap-3 hover:border-primary/50 hover:bg-primary/5 border-dashed border-2">
                <span className="text-3xl bg-green-100 p-2 rounded-full">🧹</span>
                <span className="font-semibold">Cleaner</span>
              </Button>
            </Link>
            <Link to="/workers?specialty=Carpenter">
              <Button variant="outline" className="w-full h-auto py-6 flex flex-col gap-3 hover:border-primary/50 hover:bg-primary/5 border-dashed border-2">
                <span className="text-3xl bg-amber-100 p-2 rounded-full">🪚</span>
                <span className="font-semibold">Carpenter</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* My Bookings */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">{t('dashboard.myBookings')}</h2>
            <Link to="/bookings">
              <Button variant="outline" size="sm">
                {t('dashboard.viewAll')}
              </Button>
            </Link>
          </div>

          {bookings.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.slice(0, 6).map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  userRole="master"
                  onConfirm={() => handleConfirm(booking.id)}
                  onCancel={(reason) => handleCancel(booking.id, reason)}
                  onRate={(rating, review) => handleRate(booking.id, rating, review)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 glass-card rounded-2xl border border-dashed border-slate-300">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <h3 className="text-lg font-bold text-foreground mb-2">{t('dashboard.noBookings')}</h3>
              <p className="text-muted-foreground mb-4">{t('dashboard.findWorkers')}</p>
              <Link to="/workers">
                <Button variant="hero">
                  <Plus className="w-4 h-4 mr-2" />
                  {t('dashboard.bookWorker')}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
