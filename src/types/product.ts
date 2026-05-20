export type ProductItem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  priceCents: number;
  type: "PAID" | "FREE";
  status: string;
  images: { url: string; alt?: string }[];
  rating: number;
  trialUrl?: string | null;
  aiModel?: string | null;
  seller: {
    id: string;
    name: string | null;
    rating: number;
  };
};
