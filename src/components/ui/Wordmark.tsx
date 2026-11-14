/** CPDESIGN set as a masthead: the initials in the serif voice, the rest in the grotesk. */
const Wordmark = ({ className = "" }: { className?: string }) => (
  <span className={`inline-flex items-baseline text-[1.375rem] leading-none ${className}`}>
    <span className="voice text-[1.6875rem] tracking-[-0.02em]">cp</span>
    <span className="font-extrabold tracking-[-0.03em] [font-stretch:85%]">design</span>
  </span>
);

export default Wordmark;
