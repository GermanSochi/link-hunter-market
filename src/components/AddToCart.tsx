"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useCart, CartProduct } from "@/hooks/useCart";

const AddToCart = ({ product }: { product: CartProduct }) => {
  const { addItem } = useCart();
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsSuccess(false), 2000);
    return () => clearTimeout(timeout);
  }, [isSuccess]);

  return (
    <Button
      onClick={() => {
        addItem(product);
        setIsSuccess(true);
      }}
      size="lg"
      className="w-full"
    >
      {isSuccess ? "Добавлено в корзину ✓" : "Добавить в корзину"}
    </Button>
  );
};

export default AddToCart;
