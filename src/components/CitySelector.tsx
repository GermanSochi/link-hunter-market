"use client";

import { MapPin, ChevronDown } from "lucide-react";
import { useState } from "react";

const CITIES = ["Москва", "Санкт-Петербург", "Новосибирск", "Екатеринбург", "Краснодар", "Казань", "Нижний Новгород", "Весь мир"];

export default function CitySelector() {
  const [city, setCity] = useState("Москва");
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary
          transition-colors duration-150 whitespace-nowrap"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <MapPin className="h-3.5 w-3.5 shrink-0" />
        <span className="max-w-[90px] truncate">{city}</span>
        <ChevronDown className={`h-3 w-3 shrink-0 transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          {/* Оверлей для закрытия */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <ul
            role="listbox"
            aria-label="Выбор города"
            className="absolute top-full mt-1 left-0 z-50 bg-white rounded-lg shadow-lg border border-gray-100
              py-1 min-w-[180px] text-sm"
          >
            {CITIES.map((c) => (
              <li key={c}>
                <button
                  role="option"
                  aria-selected={c === city}
                  onClick={() => { setCity(c); setOpen(false); }}
                  className={`w-full text-left px-4 py-2 hover:bg-primary/5 transition-colors
                    ${c === city ? "text-primary font-medium" : "text-gray-700"}`}
                >
                  {c}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
