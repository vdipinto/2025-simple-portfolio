export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-400px)] flex-col items-center justify-center gap-4 p-4 max-w-[400px] text-center mx-auto">
      <h1 className="text-6xl font-bold text-foreground">404</h1>
      <p className="text-lg text-muted-foreground animate-fade-in">
        The page you are looking for does not exist.
      </p>
      <p className="text-muted-foreground animate-fade-in text-xs text-balance mb-8">
        If this is something egregiously bad, please drop a message to{" "}
        <a className="underline" href="mailto:jono@robotostudio.com">
          jono@robotostudio.com
        </a>
      </p>
      <a
        aria-label="Return Home"
        href="/"
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all duration-200 ease-in-out animate-fade-in-up"
      >
        Return Home
      </a>
    </div>
  );
}
