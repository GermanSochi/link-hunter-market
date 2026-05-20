import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminDashboard from "./AdminDashboard";

export const metadata = { title: "Админ-панель — AI-маркет" };

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || !["SUPERADMIN", "ADMIN", "MODERATOR"].includes(user.role)) {
    redirect("/");
  }

  const [totalUsers, totalProducts, pendingProducts, totalOrders] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.product.count({ where: { status: "PENDING_MODERATION" } }),
    prisma.order.count(),
  ]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Админ-панель</h1>
        <p className="text-sm text-gray-500 mt-1">
          Роль: <span className="font-medium text-[#005BFF]">{user.role}</span>
        </p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Пользователи" value={totalUsers} />
        <StatCard label="Продукты" value={totalProducts} />
        <StatCard label="На модерации" value={pendingProducts} highlight={pendingProducts > 0} />
        <StatCard label="Заказы" value={totalOrders} />
      </div>

      <AdminDashboard isSuperAdmin={user.role === "SUPERADMIN"} />
    </main>
  );
}

function StatCard({ label, value, highlight = false }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${highlight ? "border-orange-300 bg-orange-50" : "border-gray-200 bg-white"}`}>
      <div className={`text-2xl font-bold ${highlight ? "text-orange-600" : "text-gray-900"}`}>{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
}
