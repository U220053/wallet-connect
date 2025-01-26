interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
}

export function Button({
  children,
  className = "",
  isLoading = false,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`w-full max-w-xs mx-auto block bg-[#7C65C1] text-white py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#7C65C1] hover:bg-[#6952A3] ${className}`}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
        </div>
      ) : (
        children
      )}
    </button>
  );
}
// import * as React from "react";
// import { Slot } from "@radix-ui/react-slot";
// import { cva } from "class-variance-authority";
// import { cn } from "../../lib/utils";

// interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
//   children: React.ReactNode;
//   isLoading?: boolean;
//   variant?:
//     | "default"
//     | "destructive"
//     | "outline"
//     | "secondary"
//     | "ghost"
//     | "link";
//   size?: "default" | "sm" | "lg" | "icon";
//   asChild?: boolean;
// }

// const buttonVariants = cva(
//   "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
//   {
//     variants: {
//       variant: {
//         default: "bg-primary text-primary-foreground hover:bg-primary/90",
//         destructive:
//           "bg-destructive text-destructive-foreground hover:bg-destructive/90",
//         outline:
//           "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
//         secondary:
//           "bg-secondary text-secondary-foreground hover:bg-secondary/80",
//         ghost: "hover:bg-accent hover:text-accent-foreground",
//         link: "text-primary underline-offset-4 hover:underline",
//       },
//       size: {
//         default: "h-10 px-4 py-2",
//         sm: "h-9 rounded-md px-3",
//         lg: "h-11 rounded-md px-8",
//         icon: "h-10 w-10",
//       },
//     },
//     defaultVariants: {
//       variant: "default",
//       size: "default",
//     },
//   }
// );

// const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
//   (
//     {
//       className,
//       variant = "default",
//       size = "default",
//       asChild = false,
//       isLoading = false,
//       children,
//       ...props
//     },
//     ref
//   ) => {
//     const Comp = asChild ? Slot : "button";
//     return (
//       <Comp
//         className={cn(buttonVariants({ variant, size, className }))}
//         ref={ref}
//         {...props}
//         disabled={isLoading || props.disabled}
//       >
//         {isLoading ? (
//           <div className="flex items-center justify-center">
//             <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
//           </div>
//         ) : (
//           children
//         )}
//       </Comp>
//     );
//   }
// );

// Button.displayName = "Button";

// export { Button, buttonVariants };
