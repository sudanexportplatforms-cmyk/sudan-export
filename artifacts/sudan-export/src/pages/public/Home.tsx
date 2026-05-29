import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Globe2, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useListProducts } from "@workspace/api-client-react";
import PublicLayout from "@/components/layout/PublicLayout";

const features = [
  {
    icon: ShieldCheck,
    title: "Verified Suppliers",
    description:
      "Every supplier is identity-checked and document-verified before they can access the platform.",
  },
  {
    icon: Globe2,
    title: "Global Buyer Network",
    description:
      "Connect with pre-qualified buyers from 40+ countries actively sourcing Sudanese commodities.",
  },
  {
    icon: Zap,
    title: "Structured RFQ Workflow",
    description:
      "Post requests, receive competing quotations, compare offers, and award deals — all in one place.",
  },
];

const howItWorks = [
  {
    step: "01",
    role: "Buyer",
    title: "Post an RFQ",
    description:
      "Describe your commodity requirements, quantity, and delivery terms. Publish to the supplier network.",
  },
  {
    step: "02",
    role: "Supplier",
    title: "Submit a Quotation",
    description:
      "Verified Sudanese exporters respond with competitive bids, pricing, and delivery timelines.",
  },
  {
    step: "03",
    role: "Buyer",
    title: "Compare & Award",
    description:
      "Review all quotations side by side and award the deal to the best offer with one click.",
  },
  {
    step: "04",
    role: "Both",
    title: "Trade & Grow",
    description:
      "Communicate directly through the platform, manage documents, and build lasting trade relationships.",
  },
];

const stats = [
  { value: "5", label: "Core Commodities" },
  { value: "40+", label: "Buyer Countries" },
  { value: "100%", label: "Verified Suppliers" },
  { value: "24h", label: "Avg. Quote Turnaround" },
];

export default function Home() {
  const { data: products = [] } = useListProducts({ active: true });

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-28 bg-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.04]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop')",
          }}
        />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-[#96762B] font-medium text-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Sudan's Premier B2B Trade Platform
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-8 leading-[1.08]">
              The secure gateway to{" "}
              <span className="text-primary">global agricultural trade.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl leading-relaxed">
              Connect directly with verified Sudanese exporters. Source premium sesame, gum arabic,
              groundnuts, hibiscus, and cotton with transparent RFQ workflows and secure
              communication.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="h-14 px-8 text-base bg-primary hover:bg-primary/90 shadow-md" asChild>
                <Link href="/sign-up">
                  Start Sourcing <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-base border-gray-200"
                asChild
              >
                <Link href="/products">View Commodities</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-100 bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-black text-primary">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commodities */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Core Commodities</h2>
              <p className="text-gray-500 mt-2">Sudan's five flagship agricultural export products.</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/products">
                View All <ArrowRight className="ml-1.5 w-4 h-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {(products.length > 0 ? products : defaultProducts).slice(0, 5).map((product) => (
              <Link
                key={product.name}
                href={`/products/${encodeURIComponent(product.name.toLowerCase().replace(/\s+/g, "-"))}`}
                className="group"
              >
                <Card className="border-none shadow-sm hover:shadow-md transition-all group-hover:-translate-y-0.5 overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center overflow-hidden">
                    {(product as any).imageUrl ? (
                      <img
                        src={(product as any).imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-4xl">
                        {productEmoji(product.name)}
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 capitalize">
                      {(product as any).category || "Agricultural"}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="text-gray-500 mt-3">
              From RFQ to awarded deal in four steps — built for serious B2B trade.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step) => (
              <div key={step.step} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl font-black text-primary/10">{step.step}</span>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      step.role === "Buyer"
                        ? "bg-green-100 text-green-700"
                        : step.role === "Supplier"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {step.role}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Built for Serious Trade</h2>
            <p className="text-gray-500 mt-3">
              Every feature is designed around the needs of professional B2B commodity trade.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="p-6 rounded-xl border border-gray-100 bg-white shadow-sm">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to start trading?
          </h2>
          <p className="text-green-200 mb-8 text-lg">
            Join verified buyers and suppliers already transacting on Sudan Export Platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              asChild
              className="bg-[#C9A24A] hover:bg-[#b88e3a] text-white border-0 h-12 px-8"
            >
              <Link href="/become-buyer">
                Start as a Buyer <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              asChild
              variant="outline"
              className="border-white text-white hover:bg-white/10 h-12 px-8"
            >
              <Link href="/become-supplier">Become a Supplier</Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

function productEmoji(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("sesame")) return "🌿";
  if (n.includes("gum")) return "🌳";
  if (n.includes("ground") || n.includes("peanut")) return "🥜";
  if (n.includes("hibiscus") || n.includes("karkadeh")) return "🌺";
  if (n.includes("cotton")) return "🌸";
  return "🌾";
}

const defaultProducts = [
  { name: "Sesame Seeds", category: "oilseed" },
  { name: "Gum Arabic", category: "resin" },
  { name: "Groundnuts", category: "oilseed" },
  { name: "Hibiscus", category: "herb" },
  { name: "Cotton", category: "fiber" },
];
