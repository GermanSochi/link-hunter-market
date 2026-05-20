export type AICategory = "text" | "image" | "video" | "code";
export type RFPStatus = "ru_ok" | "vpn_required";
export type PaymentStatus = "ru_cards" | "foreign_only";
export type PowerLabel = "Супер-интеллект" | "Продвинутый" | "Базовый";
export type AISource = "api" | "hardcoded";

export interface AIItem {
  id: string;
  name: string;
  slug: string;
  category: AICategory;
  hasFreeTier: boolean;

  officialPriceUSD: number;
  monthlyPriceRUB: number;

  tokenPriceRUB: number | null;

  rfpStatus: RFPStatus;
  paymentStatus: PaymentStatus;

  powerScore: number;
  powerLabel: PowerLabel;

  bestFor: string;
  tooltip: string;

  features: string[];
  pros: string[];
  cons: string[];

  logoUrl: string;
  affiliateUrl?: string;

  isPopular?: boolean;
  isBestChoice?: boolean;
  isRussian?: boolean;

  source: AISource;
  updatedAt: string;
}

export interface CompareFilters {
  mode: "user" | "dev";
  category: AICategory | "all";
  freeOnly: boolean;
  rfOnly: boolean;
}

export interface CompareApiResponse {
  items: AIItem[];
  usdRate: number;
  updatedAt: string;
  error?: string;
}
