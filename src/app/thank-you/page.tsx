import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { PRODUCT_CATEGORIES } from "@/config";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import PaymentStatus from "@/components/PaymentStatus";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

interface IThankYouPage {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const ThankYouPage = async ({ searchParams }: IThankYouPage) => {
  const params = await searchParams;
  const orderId = params.orderId as string | undefined;
  if (!orderId) return notFound();

  const user = await getSessionUser();
  if (!user) {
    return redirect(`/sign-in?origin=thank-you?orderId=${orderId}`);
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      product: { include: { files: { take: 1 } } },
      client: { select: { id: true, email: true } },
    },
  });

  if (!order) return notFound();
  if (order.clientId !== user.id) {
    return redirect(`/sign-in?origin=thank-you?orderId=${orderId}`);
  }

  const isPaid = ["FUNDED", "IN_PROGRESS", "REVIEW", "COMPLETED"].includes(order.status);
  const product = order.product;
  const images = product ? (product.images as { url: string; alt?: string }[]) : [];
  const firstImage = images[0];
  const label = product
    ? PRODUCT_CATEGORIES.find(({ value }) => value === product.category)?.label
    : null;
  const downloadUrl = product?.files?.[0]?.url;

  return (
    <main className="relative lg:min-h-full">
      <div className="hidden lg:block h-80 overflow-hidden lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12">
        <Image
          fill
          src="/checkout-thank-you.jpg"
          className="h-full w-full object-cover object-center"
          alt="Спасибо за заказ"
        />
      </div>

      <div>
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24">
          <div className="lg:col-start-2">
            <p className="text-sm font-medium text-blue-600">Заказ оформлен</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Спасибо за покупку!
            </h1>

            {isPaid ? (
              <p className="mt-2 text-base text-muted-foreground">
                Ваш заказ обработан. Квитанция отправлена на{" "}
                <span className="font-medium text-gray-900">{order.client.email}</span>.
              </p>
            ) : (
              <p className="mt-2 text-base text-muted-foreground">
                Мы обрабатываем ваш заказ. Скоро придёт подтверждение.
              </p>
            )}

            <div className="mt-16 text-sm font-medium">
              <div className="text-muted-foreground">Номер заказа</div>
              <div className="mt-2 text-gray-900">{order.id}</div>

              {product && (
                <ul className="mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-muted-foreground">
                  <li className="flex space-x-6 py-6">
                    {firstImage?.url && (
                      <div className="relative h-24 w-24">
                        <Image
                          fill
                          src={firstImage.url}
                          alt={product.title}
                          className="flex-none rounded-md bg-gray-100 object-cover object-center"
                        />
                      </div>
                    )}

                    <div className="flex-auto flex flex-col justify-between">
                      <div className="space-y-1">
                        <h3 className="text-gray-900">{product.title}</h3>
                        {label && <p className="my-1">Категория: {label}</p>}
                      </div>
                      {isPaid && downloadUrl && (
                        <a
                          href={downloadUrl}
                          download={product.title}
                          className="text-blue-600 hover:underline underline-offset-2"
                        >
                          Скачать файл
                        </a>
                      )}
                    </div>

                    <p className="flex-none font-medium text-gray-900">
                      {formatCurrency(order.amountCoins)}
                    </p>
                  </li>
                </ul>
              )}

              <div className="space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-muted-foreground">
                <div className="flex justify-between">
                  <p>Сумма</p>
                  <p className="text-gray-900">{formatCurrency(order.amountCoins)}</p>
                </div>
                <div className="flex justify-between">
                  <p>Комиссия платформы (5%)</p>
                  <p className="text-gray-900">{formatCurrency(order.commissionCoins)}</p>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900">
                  <p className="text-base">Итого</p>
                  <p className="text-base">
                    {formatCurrency(order.amountCoins + order.commissionCoins)}
                  </p>
                </div>
              </div>

              <PaymentStatus
                isPaid={isPaid}
                orderEmail={order.client.email}
                orderId={order.id}
              />

              <div className="mt-16 border-t border-gray-200 py-6 text-right">
                <Link
                  href="/products"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Продолжить покупки &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ThankYouPage;
