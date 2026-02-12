import { Service } from "./service.types";
import { Payment } from "./payment.type";
import { Company } from "./company.types";
import { User } from "./user.types";
export type BookingStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface BookingStatusLog {
  id: string;
  bookingId: string;
  oldStatus: BookingStatus | null;
  newStatus: BookingStatus;
  changedBy: string;
  changedAt: string;
}

export interface Booking {
  id: string;
  customerId: string;
  companyId: string;
  serviceId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  serviceAddress: string;
  latitude: number | null;
  longitude: number | null;
  status: BookingStatus;
  totalPrice: string;
  platformFee: string | number;
  companyEarnings: string | number;
  createdAt: string;
  updatedAt: string;
  customer: Pick<User, "id" | "fullName" | "email" | "phone">;
  company: Pick<Company, "id" | "name" | "phone" | "email">;
  service: Service;
  payment: Payment | null;
  review: any | null;
  cancellation: any | null;
  statusLogs: BookingStatusLog[];
}

// full API response
export interface BookingResponse {
  success: boolean;
  booking: Booking;
}
