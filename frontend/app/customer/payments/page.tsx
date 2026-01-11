"use client"
import { useState } from 'react';
import Link from 'next/link';
import { CreditCard, Calendar, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge, StatusType } from '@/components/common/StatusBadge';
import { EmptyState } from '@/components/common/EmptyState';
import { usePayments } from '@/lib/hooks/usePayments';
import { LoadingCard } from '@/components/common/LoadingCard';
import { ErrorMessage } from '@/components/common/ErrorMessage';

type PaymentFilter = 'all' | 'paid' | 'pending' | 'failed';

export default function PaymentsPage() {
  const [filterStatus, setFilterStatus] = useState<PaymentFilter>('all');
    const [page, setPage] = useState(1)
    const {
    payments,
    loading,
    error,
    pagination,
  } = usePayments({
    status: filterStatus === 'all' ? undefined : filterStatus,
    page,
    limit: 10,
  })

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Payment History"
        description="View all your transactions and payment details"
      />

      {/* Filters */}
      <div className="mb-6 flex items-center gap-4">
        <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as PaymentFilter)}>
          <SelectTrigger className="w-40 bg-card">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading && <LoadingCard/>}
      {error && <ErrorMessage message={error}/>}

      {/* Payments Table */}
      {!loading && payments.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No payments found"
          description="Your payment history will appear here once you make bookings."
        />
      ) : (
        <Card className="glass-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Booking / Service</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment, index) => (
                <TableRow 
                  key={payment.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <TableCell className="font-medium">{payment.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{payment.booking.service.name}</p>
                      <p className="text-sm text-muted-foreground">{payment.booking.id}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-primary">
                    ${payment.amount}
                  </TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      {new Date(payment.paidAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={payment.status as StatusType} />
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/customer/payments/${payment.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
