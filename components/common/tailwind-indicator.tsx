export function TailwindIndicator() {
  if (process.env.NODE_ENV === "production") return null;

  return (
    <div className="fixed bottom-2 left-2 z-[100] flex size-7 items-center justify-center rounded-full bg-foreground font-mono text-xs font-bold text-background">
      <div className="block xs:hidden">2x</div>
      <div className="hidden xs:block sm:hidden">xs</div>
      <div className="hidden sm:block md:hidden">sm</div>
      <div className="hidden md:block lg:hidden">md</div>
      <div className="hidden lg:block xl:hidden">lg</div>
      <div className="hidden xl:block 2xl:hidden">xl</div>
      <div className="hidden 2xl:block">2xl</div>
    </div>
  );
}
