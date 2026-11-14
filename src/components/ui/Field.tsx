import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

export const inputClass =
  "w-full border-2 border-rule bg-paper px-3.5 py-3 text-base text-ink placeholder:text-ink-3/70 transition-[border-color,background-color] duration-150 hover:border-ink-3 focus:border-ink focus:bg-paper focus:outline-none";

export const Field = ({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) => (
  <label className="flex flex-col gap-2">
    <span className="text-sm font-semibold">{label}</span>
    {children}
    {hint && <span className="text-sm text-ink-3">{hint}</span>}
  </label>
);

export const TextInput = ({ className = "", ...rest }: InputHTMLAttributes<HTMLInputElement>) => (
  <input className={`${inputClass} ${className}`} {...rest} />
);

export const TextArea = ({ className = "", ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea className={`${inputClass} min-h-40 resize-y leading-relaxed ${className}`} {...rest} />
);

export const ErrorNote = ({ children }: { children: ReactNode }) => (
  <p role="alert" className="flex items-start gap-3 border-l-0 bg-danger/10 px-4 py-3 text-[0.9375rem] text-ink">
    <span aria-hidden="true" className="mt-1.5 size-2.5 shrink-0 rounded-full bg-danger" />
    {children}
  </p>
);
