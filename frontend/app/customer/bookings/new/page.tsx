"use client"
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User, FileText, DollarSign, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader } from '@/components/common/PageHeader';
import { companies } from '@/data/mockData';
import { useToast } from '@/lib/hooks/use-toast';
import { ChangeEvent } from 'react';


export default function NewBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  

  const preselectedServiceId = searchParams.get('serviceId');
  const preselectedCompanyId = searchParams.get('companyId');

  const [selectedCompanyId, setSelectedCompanyId] = useState(preselectedCompanyId || '');
  const [selectedServiceId, setSelectedServiceId] = useState(preselectedServiceId || '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [staffName, setStaffName] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedCompany = companies.find((c) => c.id === selectedCompanyId);
  const availableServices = selectedCompany?.services || [];
  const selectedService = availableServices.find((s) => s.id === selectedServiceId);

  // Reset service when company changes
  useEffect(() => {
  if (!preselectedServiceId && selectedCompanyId) {
    const id = setTimeout(() => setSelectedServiceId(''), 0);
    return () => clearTimeout(id);
  }
}, [selectedCompanyId, preselectedServiceId]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCompanyId || !selectedServiceId || !date || !time) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'Booking Confirmed!',
        description: 'Your booking has been successfully created.',
      });
      router.push('/customer/bookings');
    }, 1000);
  };

  const timeSlots = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
    '04:00 PM', '05:00 PM'
  ];

  const staffMembers = ['Any Available', 'Maria Rodriguez', 'John Smith', 'Sarah Wilson'];

  return (
    <div className="animate-fade-in">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/customer/bookings">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Bookings
        </Link>
      </Button>

      <PageHeader
        title="Create New Booking"
        description="Book a service with one of our trusted providers"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Booking Form */}
        <Card className="glass-card p-6 lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Selection */}
            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Select 
                value={selectedCompanyId} 
                onValueChange={setSelectedCompanyId}
                disabled={!!preselectedCompanyId}
              >
                <SelectTrigger id="company" className="bg-background">
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name} - {company.category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Service Selection */}
            <div className="space-y-2">
              <Label htmlFor="service">Service *</Label>
              <Select 
                value={selectedServiceId} 
                onValueChange={setSelectedServiceId}
                disabled={!selectedCompanyId}
              >
                <SelectTrigger id="service" className="bg-background">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {availableServices.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} - ${service.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date & Time */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="pl-10 bg-background"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Select value={time} onValueChange={setTime}>
                  <SelectTrigger id="time" className="bg-background">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Staff Selection */}
            <div className="space-y-2">
              <Label htmlFor="staff">Preferred Staff (Optional)</Label>
              <Select value={staffName} onValueChange={setStaffName}>
                <SelectTrigger id="staff" className="bg-background">
                  <User className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Any available staff" />
                </SelectTrigger>
                <SelectContent>
                  {staffMembers.map((staff) => (
                    <SelectItem key={staff} value={staff}>
                      {staff}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Special Instructions (Optional)</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
                  placeholder="Any special requests or notes for the service provider..."
                  className="min-h-24 pl-10 bg-background"
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                'Creating Booking...'
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Confirm Booking
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Summary */}
        <Card className="glass-card p-6 h-fit">
          <h3 className="mb-4 font-display text-lg font-semibold">Booking Summary</h3>
          
          {selectedService ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Company</p>
                <p className="font-medium">{selectedCompany?.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Service</p>
                <p className="font-medium">{selectedService.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">{selectedService.duration}</p>
              </div>
              {date && time && (
                <div>
                  <p className="text-sm text-muted-foreground">Date & Time</p>
                  <p className="font-medium">
                    {new Date(date).toLocaleDateString()} at {time}
                  </p>
                </div>
              )}
              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="flex items-center text-2xl font-bold text-primary">
                    <DollarSign className="h-6 w-6" />
                    {selectedService.price}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Select a company and service to see the summary.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
