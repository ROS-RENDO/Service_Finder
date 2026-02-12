"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, CreditCard, ArrowUpRight, Download, CheckCircle, Clock, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { usePayments } from "@/lib/hooks/usePayments";

const statusConfig = {
  paid: { label: "Paid", icon: CheckCircle, color: "text-green-600 bg-green-100" },
  pending: { label: "Pending", icon: Clock, color: "text-yellow-600 bg-yellow-100" },
  failed: { label: "Failed", icon: XCircle, color: "text-red-600 bg-red-100" },
  refunded: { label: "Refunded", icon: XCircle, color: "text-muted-foreground bg-muted" },
};

export default function Payments() {
  const { payments, loading, error, fetchPayments } = usePayments({ autoFetch: true });

  const totalRevenue = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + Number(p.amount), 0);
  const pendingTotal = payments
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const stats = [
    { label: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, change: "", icon: DollarSign },
    { label: "Pending Payments", value: `$${pendingTotal.toFixed(2)}`, change: "", icon: Clock },
    { label: "Total Payments", value: String(payments.length), change: "", icon: TrendingUp },
  ];

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Payments</h1>
            <p className="text-muted-foreground mt-1">Track revenue and transactions</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="stat-card">
              <CardContent className="p-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                      <ArrowUpRight className="h-4 w-4" />
                      <span>{stat.change}</span>
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-accent-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium text-muted-foreground">Transaction</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Customer</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Service</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Method</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td className="p-4 text-sm text-muted-foreground" colSpan={6}>
                        Loading payments...
                      </td>
                    </tr>
                  )}
                  {error && !loading && (
                    <tr>
                      <td className="p-4 text-sm text-destructive" colSpan={6}>
                        Failed to load payments.{" "}
                        <button
                          type="button"
                          className="underline underline-offset-2"
                          onClick={fetchPayments}
                        >
                          Retry
                        </button>
                      </td>
                    </tr>
                  )}
                  {!loading &&
                    !error &&
                    payments.map((tx) => {
                      const status = statusConfig[tx.status as keyof typeof statusConfig];
                      const bookingDate = new Date(tx.booking.bookingDate);
                      return (
                        <tr
                          key={tx.id}
                          className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                        >
                          <td className="p-4">
                            <p className="font-medium">{tx.id}</p>
                            <p className="text-sm text-muted-foreground">
                              {bookingDate.toLocaleDateString()}
                            </p>
                          </td>
                          <td className="p-4">{tx.user.fullName}</td>
                          <td className="p-4 text-muted-foreground">{tx.booking.service.name}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{tx.method}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline" className={`gap-1 ${status.color}`}>
                              <status.icon className="h-3 w-3" />
                              {status.label}
                            </Badge>
                          </td>
                          <td className="p-4 text-right font-medium">
                            ${Number(tx.amount).toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}
