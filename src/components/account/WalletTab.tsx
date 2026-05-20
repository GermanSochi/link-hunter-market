"use client";

import { useState } from "react";
import { Wallet, ArrowDownLeft, ArrowUpRight, X, Send } from "lucide-react";

export type TxItem = {
  id: string;
  type: string;
  amountCoins: number;
  balanceAfter: number;
  createdAt: string;
  meta?: Record<string, unknown> | null;
};

const TYPE_LABEL: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  DEPOSIT:        { label: "Пополнение",   color: "text-green-600",  icon: <ArrowDownLeft className="h-4 w-4" /> },
  WITHDRAWAL:     { label: "Вывод",        color: "text-red-500",    icon: <ArrowUpRight className="h-4 w-4" /> },
  PURCHASE:       { label: "Покупка",      color: "text-red-500",    icon: <ArrowUpRight className="h-4 w-4" /> },
  SALE:           { label: "Продажа",      color: "text-green-600",  icon: <ArrowDownLeft className="h-4 w-4" /> },
  ESCROW_FREEZE:  { label: "Заморозка",    color: "text-amber-500",  icon: <ArrowUpRight className="h-4 w-4" /> },
  ESCROW_RELEASE: { label: "Разморозка",   color: "text-green-600",  icon: <ArrowDownLeft className="h-4 w-4" /> },
  COMMISSION:     { label: "Комиссия",     color: "text-red-400",    icon: <ArrowUpRight className="h-4 w-4" /> },
  REFUND:         { label: "Возврат",      color: "text-green-600",  icon: <ArrowDownLeft className="h-4 w-4" /> },
};

function DepositModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>
        <Wallet className="h-10 w-10 text-[#005BFF] mb-3" />
        <h3 className="text-lg font-bold text-[#242424] mb-1">Пополнение баланса</h3>
        <p className="text-sm text-gray-500 mb-5">
          Пополнение временно доступно через Telegram Wallet. Нажмите кнопку ниже — бот выставит счёт.
        </p>
        <a
          href={`https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ?? "aimarket_bot"}?start=deposit`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#2AABEE] text-white font-medium rounded-xl hover:bg-[#229ED9] transition-colors"
        >
          <Send className="h-4 w-4" />
          Перейти в бота
        </a>
      </div>
    </div>
  );
}

export default function WalletTab({ balance, transactions }: { balance: number; transactions: TxItem[] }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {showModal && <DepositModal onClose={() => setShowModal(false)} />}

      {/* Карточка баланса */}
      <div className="flex items-center justify-between p-5 bg-gradient-to-r from-[#005BFF] to-[#3b82f6] rounded-2xl text-white mb-5">
        <div>
          <p className="text-sm opacity-80">Доступный баланс</p>
          <p className="text-3xl font-bold mt-1">{balance.toLocaleString("ru-RU")} ₽</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-white text-[#005BFF] font-semibold text-sm rounded-xl hover:bg-blue-50 transition-colors"
        >
          + Пополнить
        </button>
      </div>

      {/* История транзакций */}
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">История операций</p>

      {transactions.length === 0 ? (
        <p className="text-sm text-gray-400 py-8 text-center">Транзакций пока нет</p>
      ) : (
        <div className="space-y-1">
          {transactions.map((tx) => {
            const meta = TYPE_LABEL[tx.type] ?? { label: tx.type, color: "text-gray-600", icon: null };
            const sign = tx.amountCoins >= 0 ? "+" : "";
            return (
              <div key={tx.id} className="flex items-center gap-3 px-3 py-2.5 bg-white border border-gray-100 rounded-xl hover:border-gray-200 transition-colors">
                <span className={`${meta.color} opacity-70`}>{meta.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#242424]">{meta.label}</p>
                  <p className="text-[11px] text-gray-400">
                    {new Date(tx.createdAt).toLocaleDateString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-sm font-bold ${tx.amountCoins >= 0 ? "text-green-600" : "text-red-500"}`}>
                    {sign}{tx.amountCoins.toLocaleString("ru-RU")} ₽
                  </p>
                  <p className="text-[11px] text-gray-400">{tx.balanceAfter.toLocaleString("ru-RU")} ₽</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
