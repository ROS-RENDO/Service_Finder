"use client"

import { useStaffServiceRequests } from '@/lib/hooks/useStaff';
import { CheckCircle, XCircle, Clock, User, MapPin, Calendar } from 'lucide-react';
import { useState } from 'react';

interface PendingServiceItem {
  id: string | number;
  service?: { name?: string; description?: string };
  customer?: { fullName?: string };
  serviceAddress?: string;
  requestedDate?: string;
  requestedTime?: string;
  bookingDate?: string;
  startTime?: string;
}

export default function StaffServicesPage() {
    const { pendingServices, loading, approveService, rejectService } = useStaffServiceRequests();
    const [processingId, setProcessingId] = useState<string | number | null>(null);

    const handleApprove = async (id: string | number) => {
        setProcessingId(id);
        const result = await approveService(id);
        setProcessingId(null);
        if (result.success) {
            // Success feedback handled by hook
        }
    };

    const handleReject = async (id: string | number) => {
        const reason = prompt('Please provide a reason for rejection (optional):');
        setProcessingId(id);
        const result = await rejectService(id, reason || undefined);
        setProcessingId(null);
        if (result.success) {
            // Success feedback handled by hook
        }
    };

    if (loading && !pendingServices.length) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Clock className="w-12 h-12 animate-spin mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Loading service requests...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 pt-12 lg:pt-0">
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Service Order Requests</h1>
                <p className="text-muted-foreground mt-1">Review and manage pending service order requests</p>
            </div>

            {pendingServices.length === 0 ? (
                <div className="bg-card rounded-xl border border-border p-12 text-center">
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">All Caught Up!</h3>
                    <p className="text-muted-foreground">No pending service order requests at the moment.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {pendingServices.map((service: PendingServiceItem) => {
                        const dateVal = service.requestedDate || service.bookingDate;
                        const timeVal = service.requestedTime || service.startTime;
                        return (
                        <div key={service.id} className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-foreground mb-2">
                                        {service.service?.name || 'Service Request'}
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                        {service.customer && (
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <User className="w-4 h-4" />
                                                <span>{service.customer.fullName}</span>
                                            </div>
                                        )}

                                        {service.serviceAddress && (
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <MapPin className="w-4 h-4" />
                                                <span className="line-clamp-1">{service.serviceAddress}</span>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Calendar className="w-4 h-4" />
                                            <span>
                                                {dateVal ? new Date(dateVal).toLocaleDateString() : 'Date not specified'}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Clock className="w-4 h-4" />
                                            <span>
                                                {timeVal ? new Date(timeVal).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Time not specified'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 ml-4">
                                    <button
                                        onClick={() => handleApprove(service.id)}
                                        disabled={processingId === service.id}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        Approve
                                    </button>

                                    <button
                                        onClick={() => handleReject(service.id)}
                                        disabled={processingId === service.id}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        Reject
                                    </button>
                                </div>
                            </div>

                            {service.service?.description && (
                                <p className="text-sm text-muted-foreground border-t border-border pt-3 mt-3">
                                    {service.service.description}
                                </p>
                            )}
                        </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
