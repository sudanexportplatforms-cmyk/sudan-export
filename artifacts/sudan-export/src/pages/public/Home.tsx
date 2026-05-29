import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.svg" alt="Sudan Export" className="h-10" />
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href="/products" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Products</Link>
              <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">About Us</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Sign In</Link>
            <Button asChild>
              <Link href="/sign-up">Start Trading</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-5" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent font-medium text-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Sudan's Premier B2B Trade Platform
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-8 leading-[1.1]">
              The secure gateway to <span className="text-primary">global agricultural trade</span>.
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl leading-relaxed">
              Connect directly with verified Sudanese exporters. Source premium sesame, gum arabic, groundnuts, hibiscus, and cotton with transparent RFQ workflows and secure communication.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="h-14 px-8 text-lg" asChild>
                <Link href="/sign-up">Source Products Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-gray-200" asChild>
                <Link href="/products">View Commodities</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-y border-gray-100 bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm font-medium text-gray-400 mb-8 tracking-widest uppercase">Trusted by international buyers across 40+ countries</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 items-center opacity-60 grayscale">
            {/* Placeholder logos, could use real icons or SVGs */}
            <div className="h-8 bg-gray-300 rounded w-32 mx-auto"></div>
            <div className="h-8 bg-gray-300 rounded w-28 mx-auto"></div>
            <div className="h-8 bg-gray-300 rounded w-36 mx-auto"></div>
            <div className="h-8 bg-gray-300 rounded w-24 mx-auto"></div>
            <div className="h-8 bg-gray-300 rounded w-32 mx-auto hidden lg:block"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
