import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { Link, type LinkProps } from "react-router-dom";
import Icon, { type IconName } from "./Icon";

/** primary: sand pill on night. light: sand pill on a colour field. outline / outlineLight: secondary actions. */
type Variant = "primary" | "light" | "outline" | "outlineLight" | "ghost" | "danger";
type Size = "md" | "lg";

const base =
  "group/btn inline-flex items-center justify-center gap-3 rounded-full font-semibold whitespace-nowrap select-none transition-[background-color,color,border-color,transform] duration-200 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-45";

const variants: Record<Variant, string> = {
  primary: "bg-sand text-night hover:bg-coral",
  light: "bg-sand text-night hover:bg-peach",
  outline: "border-2 border-ink/35 text-ink hover:border-ink hover:bg-ink hover:text-paper",
  outlineLight: "border-2 border-sand/60 text-sand hover:border-sand hover:bg-sand hover:text-night",
  ghost: "rounded-none text-ink underline-offset-4 hover:underline",
  danger: "bg-danger text-night hover:bg-ink",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-14 px-7 text-base",
};

const buttonClass = (variant: Variant = "primary", size: Size = "md", extra = "") =>
  `${extra.includes("justify-") ? base.replace("justify-center", "") : base} ${variants[variant]} ${variant === "ghost" ? "h-auto px-0" : sizes[size]} ${extra}`;

const Trail = ({ icon }: { icon?: IconName }) =>
  icon ? (
    <Icon
      name={icon}
      size={18}
      className={icon === "arrowRight" ? "transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover/btn:translate-x-1" : ""}
    />
  ) : null;

interface Common {
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  children: ReactNode;
  className?: string;
}

export const Button = ({ variant, size, icon, children, className, ...rest }: Common & ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className={buttonClass(variant, size, className)} {...rest}>
    {children}
    <Trail icon={icon} />
  </button>
);

export const ButtonLink = ({ variant, size, icon, children, className, ...rest }: Common & LinkProps) => (
  <Link className={buttonClass(variant, size, className)} {...rest}>
    {children}
    <Trail icon={icon} />
  </Link>
);

export const ButtonAnchor = ({ variant, size, icon, children, className, ...rest }: Common & AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <a className={buttonClass(variant, size, className)} {...rest}>
    {children}
    <Trail icon={icon} />
  </a>
);
