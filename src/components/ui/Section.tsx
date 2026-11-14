import type { ReactNode } from "react";

export const Container = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10 ${className}`}>{children}</div>
);

/** Section opener: a large headline, an optional serif lead, and an optional action on the right. */
export const SectionHead = ({ id, title, lead, action }: { id: string; title: string; lead?: string; action?: ReactNode }) => (
  <div className="grid grid-cols-1 gap-6 pb-12 md:grid-cols-12 md:items-end md:gap-8 md:pb-16">
    <div className="md:col-span-8">
      <h2 id={id} className="text-headline font-bold">
        {title}
      </h2>
      {lead && <p className="voice mt-4 max-w-[34ch] text-[1.5rem] leading-snug text-ink-2 md:text-[1.75rem]">{lead}</p>}
    </div>
    {action && <div className="md:col-span-4 md:justify-self-end">{action}</div>}
  </div>
);

export const StatusBlock = ({ children, action }: { children: ReactNode; action?: ReactNode }) => (
  <div className="flex flex-col items-start gap-5 border-t border-ink py-10">
    <p className="max-w-[52ch] text-lg text-ink-2">{children}</p>
    {action}
  </div>
);
