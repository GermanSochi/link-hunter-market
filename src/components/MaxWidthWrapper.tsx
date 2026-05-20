import { cn } from "@/lib/utils";
import { ReactNode } from "react";

function MaxWidthWrapper({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1280px] px-3 md:px-4", className)}>
      {children}
    </div>
  );
}

export default MaxWidthWrapper;
