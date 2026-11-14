const Tag = ({ label, tone = "light" }: { label: string; tone?: "light" | "dark" }) => (
  <li
    className={`inline-flex items-center rounded-full border px-3 py-1 text-[0.8125rem] font-medium ${
      tone === "dark" ? "border-sand/45 text-sand" : "border-ink/25 text-ink-2"
    }`}
  >
    {label}
  </li>
);

export default Tag;
