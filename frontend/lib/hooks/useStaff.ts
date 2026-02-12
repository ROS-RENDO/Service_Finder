import { useState, useEffect } from "react";
import { Booking } from "@/types/booking.types";

// 🔹 Types
interface AvailabilitySlot {
  id: string | number;
  companyId: string | number;
  staffId: string | number;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

interface UseStaffAvailabilityOptions {
  autoFetch?: boolean;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface UseStaffBookingsOptions {
  autoFetch?: boolean;
  status?: string;
  page?: number;
  limit?: number;
}

interface ServiceRequest {
  id: string | number;
  status: string;
  // extend with more fields as needed from backend
  [key: string]: any;
}

interface UseStaffServiceRequestsOptions {
  autoFetch?: boolean;
}

// 1️⃣ Staff Availability Hook
export function useStaffAvailability(options: UseStaffAvailabilityOptions = {}) {
  const { autoFetch = true } = options;

  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (autoFetch) {
      fetchAvailability();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFetch]);

  const fetchAvailability = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/staff/availability/me`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        setError("Failed to fetch availability");
        return;
      }

      const data = await response.json();
      setAvailability(data.availability || []);
    } catch (err) {
      setError("An error occurred while fetching availability");
    } finally {
      setLoading(false);
    }
  };

  const createAvailability = async (payload: {
    date: string;
    startTime: string;
    endTime: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/staff/availability`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errData.error || "Failed to create availability",
        };
      }

      await fetchAvailability();
      return { success: true };
    } catch (err) {
      return { success: false, error: "An error occurred" };
    } finally {
      setLoading(false);
    }
  };

  const updateAvailability = async (
    id: string | number,
    payload: Partial<{ date: string; startTime: string; endTime: string }>
  ) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/staff/availability/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errData.error || "Failed to update availability",
        };
      }

      await fetchAvailability();
      return { success: true };
    } catch (err) {
      return { success: false, error: "An error occurred" };
    } finally {
      setLoading(false);
    }
  };

  const deleteAvailability = async (id: string | number) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/staff/availability/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errData.error || "Failed to delete availability",
        };
      }

      await fetchAvailability();
      return { success: true };
    } catch (err) {
      return { success: false, error: "An error occurred" };
    } finally {
      setLoading(false);
    }
  };

  return {
    availability,
    loading,
    error,
    fetchAvailability,
    createAvailability,
    updateAvailability,
    deleteAvailability,
  };
}

// 2️⃣ Staff Bookings Hook
export function useStaffBookings(options: UseStaffBookingsOptions = {}) {
  const { autoFetch = true, status, page = 1, limit = 10 } = options;

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });

  useEffect(() => {
    if (autoFetch) {
      fetchBookings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, page, limit, autoFetch]);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      if (status) params.append("status", status);
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/staff/bookings?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        setError("Failed to fetch staff bookings");
        return;
      }

      const data = await response.json();
      setBookings(data.bookings || []);
      setPagination(data.pagination || pagination);
    } catch (err) {
      setError("An error occurred while fetching bookings");
    } finally {
      setLoading(false);
    }
  };

  const getBookingById = async (id: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/staff/bookings/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        return { success: false, error: "Booking not found" };
      }

      const data = await response.json();
      return { success: true, booking: data.booking };
    } catch (err) {
      return { success: false, error: "An error occurred" };
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id: string, newStatus: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/staff/bookings/${id}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errData.error || "Failed to update booking status",
        };
      }

      await fetchBookings();
      return { success: true };
    } catch (err) {
      return { success: false, error: "An error occurred" };
    } finally {
      setLoading(false);
    }
  };

  return {
    bookings,
    loading,
    error,
    pagination,
    fetchBookings,
    getBookingById,
    updateBookingStatus,
  };
}

// 3️⃣ Staff Service Requests Hook (Pending Services)
export function useStaffServiceRequests(
  options: UseStaffServiceRequestsOptions = {}
) {
  const { autoFetch = true } = options;

  const [pendingServices, setPendingServices] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (autoFetch) {
      fetchPendingServices();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFetch]);

  const fetchPendingServices = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/staff/services/pending`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        setError("Failed to fetch pending services");
        return;
      }

      const data = await response.json();
      setPendingServices(data.pendingBookings || []);
    } catch (err) {
      setError("An error occurred while fetching pending services");
    } finally {
      setLoading(false);
    }
  };

  const approveService = async (id: string | number) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/staff/services/${id}/approve`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errData.error || "Failed to approve service",
        };
      }

      await fetchPendingServices();
      return { success: true };
    } catch (err) {
      return { success: false, error: "An error occurred" };
    } finally {
      setLoading(false);
    }
  };

  const rejectService = async (id: string | number, reason?: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/staff/services/${id}/reject`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ reason }),
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errData.error || "Failed to reject service",
        };
      }

      await fetchPendingServices();
      return { success: true };
    } catch (err) {
      return { success: false, error: "An error occurred" };
    } finally {
      setLoading(false);
    }
  };

  return {
    pendingServices,
    loading,
    error,
    fetchPendingServices,
    approveService,
    rejectService,
  };
}

