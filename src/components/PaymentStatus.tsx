"use client";

import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface IPaymentStatusProps {
  orderEmail: string;
  orderId: string;
  isPaid: boolean;
}

const PaymentStatus = ({ orderEmail, orderId, isPaid }: IPaymentStatusProps) => {
  const router = useRouter();

  const { data } = trpc.payment.pullOrderStatus.useQuery(
    { orderId },
    {
      enabled: !isPaid,
      refetchInterval: (query) => (query.state.data?.isPaid ? false : 2000),
    }
  );

  useEffect(() => {
    if (data?.isPaid) router.refresh();
  }, [data?.isPaid, router]);

  return (
    <div className="mt-16 grid grid-cols-2 gap-x-4 text-sm text-gray-600">
      <div>
        <p className="font-medium text-gray-900">Email покупателя</p>
        <p>{orderEmail}</p>
      </div>
      <div>
        <p className="font-medium text-gray-900">Статус заказа</p>
        <p>{isPaid ? "Оплачен" : "Ожидает подтверждения"}</p>
      </div>
    </div>
  );
};

export default PaymentStatus;
