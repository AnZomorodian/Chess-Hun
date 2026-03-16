import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-8xl font-display font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-6">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        The square you are looking for does not exist on this board.
      </p>
      <Link href="/" className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:-translate-y-1 transition-transform">
        Return to Base
      </Link>
    </div>
  );
}
