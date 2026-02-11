import Link from "next/link";
import { Shield, ArrowRight, Zap, Lock, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/20 blur-[120px] rounded-full -z-10 opacity-30"></div>

        <nav className="container mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="text-primary" size={28} />
            <span className="font-bold text-2xl tracking-tight">Vanguard</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">Log in</Link>
            <Link href="/signup" className="primary text-sm flex items-center gap-2">
              Sign up
              <ArrowRight size={16} />
            </Link>
          </div>
        </nav>

        <main className="container mx-auto px-6 pt-20 pb-32 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-8 animate-fade-in">
            <Zap size={14} />
            Enterprise Ready Dashboard
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight animate-fade-in">
            The Secure <span className="gradient-text">Command Center</span><br />
            for Modern Teams
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in [animation-delay:200ms]">
            Manage users, permissions, and data with an intuitive, role-based dashboard built for speed and security.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in [animation-delay:400ms]">
            <Link href="/signup" className="primary px-8 py-4 text-lg flex items-center gap-2">
              Get Started for Free
              <ArrowRight size={20} />
            </Link>
            <Link href="/login" className="secondary px-8 py-4 text-lg">
              View Demo
            </Link>
          </div>
        </main>
      </div>

      {/* Features */}
      <section className="container mx-auto px-6 py-24 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col gap-4">
            <div className="p-3 bg-primary/10 w-fit rounded-xl">
              <Lock className="text-primary" size={24} />
            </div>
            <h3 className="text-xl font-bold">Secure Access</h3>
            <p className="text-muted-foreground">Advanced authentication with role-based access control and admin approvals.</p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="p-3 bg-primary/10 w-fit rounded-xl">
              <Users className="text-primary" size={24} />
            </div>
            <h3 className="text-xl font-bold">User Management</h3>
            <p className="text-muted-foreground">Full control over who can access your dashboard with a dedicated admin console.</p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="p-3 bg-primary/10 w-fit rounded-xl">
              <Zap className="text-primary" size={24} />
            </div>
            <h3 className="text-xl font-bold">Lightning Fast</h3>
            <p className="text-muted-foreground">Built on Next.js and Neon Serverless for sub-100ms response times globally.</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-6 text-center text-muted-foreground text-sm">
          <p>© 2026 Vanguard Systems. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
