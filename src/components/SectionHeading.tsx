export const SectionHeading = ({ eyebrow, title, accent }: { eyebrow: string; title: string; accent?: string }) => (
  <div className="text-center mb-20 md:mb-24">
    <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass text-xs font-medium text-muted-foreground tracking-widest mb-6 uppercase">
      <span className="w-1.5 h-1.5 rounded-full bg-gradient-accent" />
      {eyebrow}
    </span>
    <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight">
      {title} {accent && <span className="text-gradient">{accent}</span>}
    </h2>
  </div>
);
