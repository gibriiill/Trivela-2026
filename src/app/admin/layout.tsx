import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { Shield, Home } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div>
      <div className="bg-gold text-blue-deep py-4 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield size={24} />
            <span className="font-heading font-bold text-lg">Admin Panel</span>
          </div>
          <div className="text-sm font-heading font-bold">
            Signed in as: {session.user.username}
          </div>
          <Link href="/" className="flex items-center gap-1 text-sm font-heading font-bold hover:opacity-80">
            <Home size={16} /> Back to Site
          </Link>
        </div>
      </div>

      <div className="bg-blue-mid border-b border-blue-border sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {[
            { href: "/admin", label: "Dashboard" },
            { href: "/admin/matches", label: "Matches" },
            { href: "/admin/results", label: "Results" },
            { href: "/admin/users", label: "Users" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-3 font-heading font-bold text-sm border-b-2 border-transparent hover:border-gold transition-colors whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <main className="bg-blue-deep">{children}</main>
    </div>
  );
}
