import Link from "next/link";
import { CornerDownLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="font-display text-8xl md:text-9xl text-gold/20">404</h1>
          <p className="font-display text-4xl text-gold-gradient">Offside!</p>
          <p className="text-xl text-blue-border">The page you're looking for is out of bounds</p>
        </div>

        <Link href="/" className="btn-gold px-8 py-4 inline-flex items-center gap-2">
          <CornerDownLeft size={20} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
