import * as React from "react";
import { cn } from "~/lib/utils";

const RadioGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} role="radiogroup" className={cn("grid gap-2", className)} {...props} />
  )
);
RadioGroup.displayName = "RadioGroup";

const RadioGroupItem = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      type="radio"
      ref={ref}
      className={cn("aspect-square h-4 w-4 rounded-full border border-text-main text-accent focus:outline-none focus:ring-2 focus:ring-ring", className)}
      {...props}
    />
  )
);
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
