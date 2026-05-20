"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search, Ban, CheckCircle, Package, Users, MessageSquare,
  Trash2, Star, Shield, Crown,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  username: string | null;
  role: string;
  isBanned: boolean;
  isReadOnly: boolean;
  isGoldSeller: boolean;
  karma: number;
  rating: number;
  balanceCoins: number;
  createdAt: string;
}

interface AdminProduct {
  id: string;
  title: string;
  status: string;
  priceCents: number;
  createdAt: string;
  seller: {
    id: string;
    name: string | null;
    username: string | null;
    email: string;
    karma: number;
    rating: number;
    isGoldSeller: boolean;
  };
}

interface AdminChatMessage {
  id: string;
  text: string;
  createdAt: string;
  deletedAt: string | null;
  author: {
    id: string;
    name: string | null;
    username: string | null;
    email: string;
    isGoldSeller: boolean;
  };
}

type Tab = "products" | "users" | "chat";

export default function AdminDashboard({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  const [tab, setTab] = useState<Tab>("products");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [chatMessages, setChatMessages] = useState<AdminChatMessage[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const showMsg = (txt: string) => { setMessage(txt); setTimeout(() => setMessage(""), 3000); };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/users?search=${encodeURIComponent(search)}`);
    const data = await res.json();
    setUsers(data.users ?? []);
    setLoading(false);
  }, [search]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/products?status=PENDING_MODERATION");
    const data = await res.json();
    setProducts(data.products ?? []);
    setLoading(false);
  }, []);

  const fetchChat = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/chat");
    const data = await res.json();
    setChatMessages(data.messages ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (tab === "users") fetchUsers();
    else if (tab === "products") fetchProducts();
    else fetchChat();
  }, [tab, fetchUsers, fetchProducts, fetchChat]);

  const userAction = async (userId: string, action: string, reason?: string) => {
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, action, reason }),
    });
    if (res.ok) { showMsg(`Действие ${action} выполнено`); fetchUsers(); }
  };

  const productAction = async (productId: string, status: string) => {
    const res = await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, status }),
    });
    if (res.ok) {
      showMsg(`Продукт ${status === "APPROVED" ? "одобрен" : "отклонён"}`);
      fetchProducts();
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm("Удалить сообщение?")) return;
    const res = await fetch("/api/admin/chat", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageId }),
    });
    if (res.ok) {
      showMsg("Сообщение удалено");
      setChatMessages((prev) =>
        prev.map((m) => m.id === messageId ? { ...m, deletedAt: new Date().toISOString() } : m)
      );
    }
  };

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "products", label: "Модерация",    icon: <Package size={15} /> },
    { id: "users",    label: "Пользователи", icon: <Users size={15} /> },
    { id: "chat",     label: "Чат",          icon: <MessageSquare size={15} /> },
  ];

  return (
    <div>
      {message && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200">
          {message}
        </div>
      )}

      {/* Табы */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === t.id ? "border-[#005BFF] text-[#005BFF]" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === "users" && (
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск по email, имени..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#005BFF]/30"
            />
          </div>
          <button
            type="button"
            onClick={fetchUsers}
            className="bg-[#005BFF] text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Найти
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-gray-400 text-sm py-8 text-center">Загрузка...</div>
      ) : tab === "products" ? (
        <ProductsTable products={products} onAction={productAction} />
      ) : tab === "users" ? (
        <UsersTable users={users} onAction={userAction} isSuperAdmin={isSuperAdmin} />
      ) : (
        <ChatTable messages={chatMessages} onDelete={deleteMessage} />
      )}
    </div>
  );
}

function ProductsTable({
  products,
  onAction,
}: {
  products: AdminProduct[];
  onAction: (id: string, status: string) => void;
}) {
  if (products.length === 0) {
    return <div className="text-center py-12 text-gray-400">Нет продуктов на модерации</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500 text-left">
            <th className="py-2 pr-3 font-medium">Продукт</th>
            <th className="py-2 pr-3 font-medium">Продавец</th>
            <th className="py-2 pr-3 font-medium">Карма / Рейтинг</th>
            <th className="py-2 pr-3 font-medium">Цена</th>
            <th className="py-2 font-medium">Действия</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 pr-3 font-medium text-gray-900 max-w-[180px] truncate">{p.title}</td>
              <td className="py-3 pr-3">
                <div className="flex items-center gap-1">
                  {p.seller.isGoldSeller && <Star size={12} className="text-yellow-500 fill-yellow-400 shrink-0" />}
                  <div>
                    <p className="text-gray-700 font-medium">{p.seller.username ?? p.seller.name ?? "—"}</p>
                    <p className="text-xs text-gray-400">{p.seller.email}</p>
                  </div>
                </div>
              </td>
              <td className="py-3 pr-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className={`px-1.5 py-0.5 rounded font-medium ${p.seller.karma >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    K: {p.seller.karma > 0 ? "+" : ""}{p.seller.karma}
                  </span>
                  <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-medium">
                    ★ {p.seller.rating.toFixed(1)}
                  </span>
                </div>
              </td>
              <td className="py-3 pr-3 text-gray-500">
                {p.priceCents === 0 ? "Бесплатно" : `${(p.priceCents / 100).toFixed(0)} ₽`}
              </td>
              <td className="py-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onAction(p.id, "APPROVED")}
                    className="flex items-center gap-1 bg-green-500 text-white text-xs px-3 py-1 rounded hover:bg-green-600"
                  >
                    <CheckCircle size={12} /> Одобрить
                  </button>
                  <button
                    type="button"
                    onClick={() => onAction(p.id, "REJECTED")}
                    className="flex items-center gap-1 bg-red-500 text-white text-xs px-3 py-1 rounded hover:bg-red-600"
                  >
                    <Ban size={12} /> Отклонить
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UsersTable({
  users,
  onAction,
  isSuperAdmin,
}: {
  users: AdminUser[];
  onAction: (id: string, action: string, reason?: string) => void;
  isSuperAdmin: boolean;
}) {
  if (users.length === 0) {
    return <div className="text-center py-12 text-gray-400">Пользователи не найдены</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500 text-left">
            <th className="py-2 pr-3 font-medium">Пользователь</th>
            <th className="py-2 pr-3 font-medium">Роль</th>
            <th className="py-2 pr-3 font-medium">Карма / Рейтинг</th>
            <th className="py-2 pr-3 font-medium">Статус</th>
            <th className="py-2 pr-3 font-medium">Зарегистрирован</th>
            <th className="py-2 font-medium">Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className={`border-b border-gray-100 hover:bg-gray-50 ${u.isBanned ? "bg-red-50/50" : ""}`}>
              <td className="py-3 pr-3">
                <div className="flex items-center gap-1.5">
                  {u.isGoldSeller && <Star size={12} className="text-yellow-500 fill-yellow-400 shrink-0" />}
                  <div>
                    <div className="font-medium text-gray-900">{u.username ?? u.name ?? "—"}</div>
                    <div className="text-xs text-gray-400">{u.email}</div>
                  </div>
                </div>
              </td>
              <td className="py-3 pr-3">
                <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                  u.role === "SUPERADMIN" ? "bg-purple-100 text-purple-700" :
                  u.role === "ADMIN" ? "bg-blue-100 text-blue-700" :
                  u.role === "MODERATOR" ? "bg-yellow-100 text-yellow-700" :
                  u.role === "SELLER" ? "bg-green-100 text-green-700" :
                  "bg-gray-100 text-gray-600"
                }`}>
                  {u.role}
                </span>
              </td>
              <td className="py-3 pr-3">
                <div className="flex items-center gap-1.5 text-xs">
                  <span className={`px-1.5 py-0.5 rounded font-medium ${u.karma >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    K: {u.karma > 0 ? "+" : ""}{u.karma}
                  </span>
                  <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-medium">
                    ★ {u.rating.toFixed(1)}
                  </span>
                </div>
              </td>
              <td className="py-3 pr-3">
                {u.isBanned ? (
                  <span className="text-xs text-red-600 font-medium">Заблокирован</span>
                ) : u.isReadOnly ? (
                  <span className="text-xs text-orange-600 font-medium">Только чтение</span>
                ) : (
                  <span className="text-xs text-green-600">Активен</span>
                )}
              </td>
              <td className="py-3 pr-3 text-xs text-gray-400">
                {formatDistanceToNow(new Date(u.createdAt), { locale: ru, addSuffix: true })}
              </td>
              <td className="py-3">
                <div className="flex gap-1.5 flex-wrap">
                  {!u.isBanned ? (
                    <button
                      type="button"
                      onClick={() => onAction(u.id, "ban")}
                      className="flex items-center gap-1 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
                    >
                      <Ban size={11} /> Бан
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onAction(u.id, "unban")}
                      className="flex items-center gap-1 bg-green-500 text-white text-xs px-2 py-1 rounded hover:bg-green-600"
                    >
                      <CheckCircle size={11} /> Разбан
                    </button>
                  )}
                  {!u.isGoldSeller && (
                    <button
                      type="button"
                      onClick={() => onAction(u.id, "setGold")}
                      className="flex items-center gap-1 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded hover:bg-yellow-500"
                    >
                      <Star size={11} /> Gold
                    </button>
                  )}
                  {isSuperAdmin && u.role !== "SUPERADMIN" && (
                    <select
                      aria-label="Изменить роль пользователя"
                      onChange={(e) => { if (e.target.value) { onAction(u.id, "setRole", e.target.value); e.target.value = ""; } }}
                      className="text-xs border border-gray-200 rounded px-1 py-1 text-gray-600"
                    >
                      <option value="">Роль...</option>
                      <option value="USER">USER</option>
                      <option value="SELLER">SELLER</option>
                      <option value="MODERATOR">MODERATOR</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  )}
                  {isSuperAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        const delta = prompt("Изменить карму (например +5 или -10):");
                        if (delta) onAction(u.id, "setKarma", delta);
                      }}
                      className="flex items-center gap-1 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded hover:bg-gray-200"
                    >
                      <Shield size={11} /> Карма
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ChatTable({
  messages,
  onDelete,
}: {
  messages: AdminChatMessage[];
  onDelete: (id: string) => void;
}) {
  if (messages.length === 0) {
    return <div className="text-center py-12 text-gray-400">Сообщений нет</div>;
  }

  return (
    <div className="space-y-2">
      {messages.map((m) => (
        <div
          key={m.id}
          className={`flex items-start gap-3 p-3 rounded-xl border ${
            m.deletedAt ? "border-red-100 bg-red-50/50 opacity-60" : "border-gray-100 bg-white hover:bg-gray-50"
          }`}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              {m.author.isGoldSeller && <Crown size={11} className="text-yellow-500 shrink-0" />}
              <span className="text-xs font-semibold text-gray-700">
                {m.author.username ?? m.author.name ?? "Аноним"}
              </span>
              <span className="text-xs text-gray-400">{m.author.email}</span>
              <span className="text-xs text-gray-300">
                {formatDistanceToNow(new Date(m.createdAt), { locale: ru, addSuffix: true })}
              </span>
              {m.deletedAt && (
                <span className="text-xs text-red-500 font-medium">удалено</span>
              )}
            </div>
            <p className="text-sm text-gray-800 break-words">{m.text}</p>
          </div>
          {!m.deletedAt && (
            <button
              type="button"
              onClick={() => onDelete(m.id)}
              className="shrink-0 flex items-center gap-1 text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition-colors"
            >
              <Trash2 size={12} /> Удалить
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
