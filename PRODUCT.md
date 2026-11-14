# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Primary: anyone who wants to see Carmelo Provenzani's work — studios, clients, peers, and also recruiters who arrive from his CV or LinkedIn. They come to look at projects and understand how he thinks; they decide quickly whether to open a project, download the CV or get in touch.

Secondary: Carmelo himself, using the private admin area to add, edit and delete projects.

## Product Purpose
A personal portfolio that shows Carmelo's work. It is a showcase, not a job ad: the site never says he is looking for work. Success: a visitor understands within seconds who he is (graphic designer turned front-end developer), sees real projects, and can download the CV or write to him.

## Positioning
A front-end developer with a full Graphic Design degree (Accademia di Belle Arti, Catania, 108/110) plus an IT master (Epicode): someone who can both design an interface properly and build it in React/TypeScript. The site itself is the proof of that dual skill.

## Operating Context
Visitors read on desktop first, mobile second. The site is bilingual (Italian default, English). Projects live in Supabase and are managed through the admin area; the contact form sends through EmailJS. Hosted on Vercel.

## Capabilities and Constraints
- Stack: React 19, TypeScript, Vite, Tailwind CSS 4, React Router 7, i18next, Supabase (DB, auth, storage), EmailJS.
- Project record: title/category/description (IT + EN), tags, multiple images/files, labelled links (IT + EN).
- Public routes: home, projects archive, project detail, about. Private: login, admin dashboard, new/edit project.
- No backend beyond Supabase; admin security relies on Supabase RLS policies.

## Brand Commitments
- Name/mark: "CPDESIGN".
- The user chose to replace the previous brutalist visual world (thick black borders, #CCFF00 neon, hard offset shadows, all-caps) with a new one.

## Evidence on Hand
- Real projects in the Supabase `projects` table, with cover images.
- Education timeline: Graphic Design degree (Sep 2022 – Feb 2026), Epicode IT master (Nov 2025 – Jun 2026), web app project (May – Jun 2026).
- Skills: React, TypeScript, Redux, JavaScript, Tailwind, SASS; Figma, Illustrator, wireframing, prototyping; back-end with Java, Spring Boot, MySQL (being deepened; never call it "basics").
- CV as PDF (to be supplied by the user; currently a .zip on Supabase storage).
- Links: LinkedIn, GitHub (Carmelo0603), email.
- Absent: testimonials, client logos, metrics, a personal photo. Do not fabricate.

## Product Principles
1. Work first: every page leads to a project; the CV and contact are there, never pushed as a job request.
2. The site is the portfolio piece: design and code quality are themselves the evidence.
3. Clarity over attitude: copy is direct and professional, never gimmicky.
4. Projects lead; the interface stays out of their way.

## Accessibility & Inclusion
WCAG 2.2 AA: keyboard navigation with visible focus, sufficient contrast, reduced-motion support, correct heading structure, bilingual `lang`.
