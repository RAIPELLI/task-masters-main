import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Booking, BookingStatus } from '@/types';
import { BookingCard } from '@/components/bookings/BookingCard';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Calendar, Filter, Loader2 } from 'lucide-react';

// Removed mock bookings

export default function Bookings() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isWorker = user?.role === 'worker';

  const statusFilters: { value: BookingStatus | 'all'; label: string }[] = [
    { value: 'all', label: t('statuses.all') },
    { value: 'pending', label: t('statuses.pending') },
    { value: 'accepted', label: t('statuses.accepted') },
    { value: 'quoted', label: t('statuses.quoted') },
    { value: 'confirmed', label: t('statuses.confirmed') },
    { value: 'completed', label: t('statuses.completed') },
    { value: 'cancelled', label: t('statuses.cancelled') },
  ];

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await api.bookings.list();
        setBookings(data);
      } catch (error) {
        // toast.error('Failed to load bookings'); // Silent error for polling
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

  const filteredBookings = statusFilter === 'all'
    ? bookings
    : bookings.filter(b => b.status === statusFilter);

  const handleAccept = async (bookingId: string) => {
    try {
      await api.bookings.update(parseInt(bookingId), { status: 'accepted' });
      setBookings(prev =>
        prev.map(b => (b.id === bookingId ? { ...b, status: 'accepted' as const } : b))
      );
      toast.success('Booking accepted!');
    } catch (error) {
      toast.error('Failed to accept booking');
    }
  };

  const handleReject = async (bookingId: string) => {
    try {
      await api.bookings.update(parseInt(bookingId), { status: 'cancelled' });
      setBookings(prev =>
        prev.map(b => (b.id === bookingId ? { ...b, status: 'cancelled' as const } : b))
      );
      toast.info('Booking rejected');
    } catch (error) {
      toast.error('Failed to reject booking');
    }
  };

  const handleQuote = async (bookingId: string, price: number) => {
    try {
      await api.bookings.update(parseInt(bookingId), { status: 'quoted', quoted_price: price });
      setBookings(prev =>
        prev.map(b =>
          b.id === bookingId ? { ...b, status: 'quoted' as const, quotedPrice: price } : b
        )
      );
      toast.success('Quote sent!');
    } catch (error) {
      toast.error('Failed to send quote');
    }
  };

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
        window.location.reload();
      }
      toast.info('Booking cancelled');
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  const handleComplete = async (bookingId: string, otp?: string) => {
    try {
      const updatePayload: any = { status: 'completed' };
      if (otp) {
        updatePayload.completion_otp = otp;
      }

      const updatedBooking = await api.bookings.update(parseInt(bookingId), updatePayload);

      // If status didn't change to completed, it means OTP was sent
      if (updatedBooking.status !== 'completed' && !otp) {
        toast.info('OTP sent to customer. Please enter it to verify.');
        return updatedBooking.status;
      }

      setBookings(prev =>
        prev.map(b => (b.id === bookingId ? { ...b, status: 'completed' as const } : b))
      );
      toast.success('Work marked as completed!');
      return 'completed';
    } catch (error) {
      toast.error('Failed to update booking status');
      return undefined;
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
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{t('bookings.title')}</h1>
          <p className="text-muted-foreground">
            {isWorker ? t('bookings.workerSubtitle') : t('bookings.customerSubtitle')}
          </p>
        </div>

        {/* Filters */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-semibold text-foreground uppercase tracking-wide">{t('bookings.filterBy')}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((filter) => (
              <Button
                key={filter.value}
                variant={statusFilter === filter.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(filter.value)}
                className={`rounded-full ${statusFilter === filter.value ? 'shadow-lg shadow-violet-500/25' : 'bg-white/50 border-slate-200 hover:bg-white hover:text-violet-600'}`}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                userRole={isWorker ? 'worker' : 'master'}
                onAccept={() => handleAccept(booking.id)}
                onReject={() => handleReject(booking.id)}
                onQuote={(price) => handleQuote(booking.id, price)}
                onConfirm={() => handleConfirm(booking.id)}
                onCancel={(reason) => handleCancel(booking.id, reason)}
                onComplete={(otp) => handleComplete(booking.id, otp)}
                onRate={(rating, review) => handleRate(booking.id, rating, review)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 glass-card rounded-2xl border border-dashed border-slate-300">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-medium text-foreground mb-2">{t('bookings.noBookings')}</h3>
            <p className="text-muted-foreground">
              {statusFilter === 'all'
                ? t('bookings.empty')
                : t('bookings.noFilterMatch', { status: t(`statuses.${statusFilter}`) })}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
