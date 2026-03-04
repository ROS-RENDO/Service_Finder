"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingCard } from "@/components/common/LoadingCard";

export default function NewBookingPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/customer/services");
  }, [router]);

  return <LoadingCard message="Redirecting to booking flow..." />;
}
