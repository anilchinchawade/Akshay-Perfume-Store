import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & {
  variant?: "primary" | "secondary" | "text";
};

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const styles = {
    primary: "bg-ink text-white hover:bg-gold",
    secondary: "border border-ink/20 text-ink hover:border-gold hover:text-gold",
    text: "text-ink underline-offset-4 hover:underline"
  };

  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
