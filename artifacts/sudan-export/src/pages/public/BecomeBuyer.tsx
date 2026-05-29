import { Link } from "wouter";
import { CheckCircle2, ArrowRight, Globe2, ShieldCheck, BarChart3, MessageSquare, Zap, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PublicLayout from "@/components/layout/PublicLayout";

const benefits = [
  {
    icon: Globe2,
    title: "Direct Supplier Access",
    description:
      "Bypass traders and brokers. Connect directly with verified Sudanese exporters and negotiate better pricing and terms.",
  },
  {
    icon: FileSearch,
    title: "Structured RFQ Workflow",
    description:
      "Post a single RFQ and receive multiple competitive quotations. Compare offers side by side and award to the best supplier.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Supplier Network",
    description:
      "Every supplier on the platform is identity-verified and document-checked. Trade with confidence, backed by platform guarantees.",
  },
  {
    icon: BarChart3,
    title: "Transparent Pricing",
    description:
      "See clear, itemised quotations from multiple suppliers. No hidden fees, no opaque markups — pure market pricing.",
  },
  {
    icon: MessageSquare,
    title: "Built-in Trade Communication",
    description:
      "Negotiate, ask for samples, and finalise terms directly within the platform. All conversation history is preserved and searchable.",
  },
  {
    icon: Zap,
    title: "Fast Turnaround",
    description:
      "Set your own RFQ deadline and receive quotations quickly. Average response time from verified suppliers is under 48 hours.",
  },
];

const steps = [
  {
    step: "01",
    title: "Register & Verify",
    description:
      "Create your buyer account, provide company details, and verify your business identity. Takes under 5 minutes.",
  },
  {
    step: "02",
    title: "Post an RFQ",
    description:
      "Describe what you need: product, quantity, quality specs, delivery Incoterms, and deadline. Submit to the marketplace.",
  },
  {
    step: "03",
    title: "Review Quotations",
    description:
      "Receive competitive bids from verified suppliers. Use the comparison view to evaluate pricing, delivery time, and terms.",
  },
  {
    step: "04",
    title: "Award & Trade",
    description:
      "Award the best quotation. Both parties are notified, and you can proceed directly to contract and shipment planning.",
  },
];

const commodities = [
  { name: "Sesame Seeds", origin: "Gedaref, Sudan", grade: "Humera & Wad Medani varieties" },
  { name: "Gum Arabic", origin: "Kordofan, Sudan", grade: "Grade 1 & Grade 3 Hashab" },
  { name: "Groundnuts", origin: "Darfur & Kordofan", grade: "Runner & Virginia types" },
  { name: "Hibiscus (Karkadeh)", origin: "Darfur, Sudan", grade: "Dry calyces, premium export quality" },
  { name: "Cotton", origin: "Gezira Scheme, Sudan", grade: "Long-staple Barakat & Acala" },
];

export default function BecomeBuyer() {
  return (
    <PublicLayout>
      <section className="pt-16 pb-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-[#96762B] font-medium text-sm mb-4">
              For Buyers
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Source premium Sudanese agricultural commodities
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Post an RFQ, receive competitive quotations from verified exporters, and close deals —
              all in one transparent platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 h-12 px-8">
                <Link href="/sign-up">Register as Buyer</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-8">
                <Link href="/products">View Commodities</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Why Source on Sudan Export?</h2>
          <p className="text-gray-500 mb-10">Built for international buyers who need reliability and transparency.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b) => {
              const Icon = b.icon;
              return (
                <Card key={b.title} className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 bg-accent/15 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{b.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{b.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Commodities</h2>
          <p className="text-gray-500 mb-8">Five core Sudanese agricultural exports available year-round.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {commodities.map((c) => (
              <div key={c.name} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-1">{c.name}</h3>
                <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                  <Globe2 className="w-3 h-3" /> {c.origin}
                </p>
                <p className="text-sm text-gray-600">{c.grade}</p>
              </div>
            ))}
            <div className="bg-primary/5 rounded-xl p-5 border border-primary/10 shadow-sm flex items-center justify-center text-center">
              <div>
                <p className="text-sm font-medium text-primary">More commodities</p>
                <p className="text-xs text-gray-500 mt-1">Coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">How It Works</h2>
          <p className="text-gray-500 mb-10">From RFQ to awarded deal in four steps.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.step} className="relative">
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm h-full">
                  <div className="text-4xl font-black text-accent/20 mb-3">{s.step}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{s.description}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-3 z-10 -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to source smarter?</h2>
          <p className="text-green-200 mb-8">
            Join global buyers already sourcing premium Sudanese commodities through our platform.
            Registration is free.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="bg-[#C9A24A] hover:bg-[#b88e3a] text-white border-0 h-12 px-8">
              <Link href="/sign-up">
                Create Buyer Account <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 h-12 px-8">
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
