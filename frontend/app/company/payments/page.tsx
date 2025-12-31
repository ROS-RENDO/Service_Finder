"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, CreditCard, ArrowUpRight, Download, CheckCircle, Clock, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const stats = [
  { label: "Total Revenue", value: "$12,450", change: "+12.5%", icon: DollarSign },
  { label: "Pending Payments", value: "$1,280", change: "4 pending", icon: Clock },
  { label: "This Month", value: "$4,850", change: "+8.2%", icon: TrendingUp },
];

const transactions = [
  { id: "TXN-001", customer: "Sarah Johnson", service: "Deep Clean", date: "Dec 31, 2025", amount: "$180", status: "completed", method: "Credit Card" },
  { id: "TXN-002", customer: "Mike Chen", service: "Regular Clean", date: "Dec 30, 2025", amount: "$95", status: "pending", method: "PayPal" },
  { id: "TXN-003", customer: "Emily Davis", service: "Move-out Clean", date: "Dec 29, 2025", amount: "$320", status: "completed", method: "Credit Card" },
  { id: "TXN-004", customer: "James Wilson", service: "Office Clean", date: "Dec 28, 2025", amount: "$250", status: "completed", method: "Bank Transfer" },
  { id: "TXN-005", customer: "Lisa Brown", service: "Regular Clean", date: "Dec 27, 2025", amount: "$95", status: "failed", method: "Credit Card" },
];

const statusConfig = {
  completed: { label: "Completed", icon: CheckCircle, color: "text-green-600 bg-green-100" },
  pending: { label: "Pending", icon: Clock, color: "text-yellow-600 bg-yellow-100" },
  failed: { label: "Failed", icon: XCircle, color: "text-red-600 bg-red-100" },
};

export default function Payments() {
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

        {/* Stats */}
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

        {/* Transactions */}
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
                  {transactions.map((tx) => {
                    const status = statusConfig[tx.status as keyof typeof statusConfig];
                    return (
                      <tr key={tx.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="p-4">
                          <p className="font-medium">{tx.id}</p>
                          <p className="text-sm text-muted-foreground">{tx.date}</p>
                        </td>
                        <td className="p-4">{tx.customer}</td>
                        <td className="p-4 text-muted-foreground">{tx.service}</td>
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
                        <td className="p-4 text-right font-medium">{tx.amount}</td>
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
