"use client";

import { PRODUCT_CATEGORIES } from "@/config";
import { useCart, CartProduct } from "@/hooks/useCart";
import { formatCurrency } from "@/lib/utils";
import { ImageIcon, X } from "lucide-react";
import Image from "next/image";

const CartItem = ({ product }: { product: CartProduct }) => {
  const { removeItem } = useCart();
  const firstImage = product.images?.[0];

  const label = PRODUCT_CATEGORIES.find(
    ({ value }) => value === product.category
  )?.label;

  return (
    <div className="space-y-3 py-2">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative aspect-square h-16 w-16 min-w-fit overflow-hidden rounded">
            {firstImage?.url ? (
              <Image
                src={firstImage.url}
                alt={product.title}
                fill
                className="absolute object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-secondary">
                <ImageIcon aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </div>

          <div className="flex flex-col self-start">
            <span className="line-clamp-1 text-sm font-medium mb-1">
              {product.title}
            </span>
            <span className="line-clamp-1 text-xs capitalize text-muted-foreground">
              {label}
            </span>
            <div className="mt-4 text-xs text-muted-foreground">
              <button
                onClick={() => removeItem(product.id)}
                className="flex items-center gap-0.5"
              >
                <X className="w-3 h-4" />
                Удалить
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-1 font-medium">
          <span className="ml-auto line-clamp-1 text-sm">
            {formatCurrency(product.priceCents)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
