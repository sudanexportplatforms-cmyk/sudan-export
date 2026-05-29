import { Link } from "wouter";
import { CheckCircle2, ArrowRight, Globe2, ShieldCheck, TrendingUp, FileCheck2, Users, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PublicLayout from "@/components/layout/PublicLayout";

const benefits = [
  {
    icon: Globe2,
    title: "Access 40+ International Markets",
    description:
      "Connect directly with verified buyers from Europe, Asia, the Gulf, and North America looking for premium Sudanese commodities.",
  },
  {
    icon: TrendingUp,
    title: "Grow Your Export Volume",
    description:
      "Receive structured RFQs with clear specifications, timelines, and quantities — so you can plan production and fulfil more orders.",
  },
  {
    icon: ShieldCheck,
    title: "Verified & Trusted Platform",
    description:
      "Your verified supplier badge builds buyer trust. Platform-facilitated contracts reduce risk and ensure timely payment terms.",
  },
  {
    icon: Banknote,
    title: "Competitive Quotation System",
    description:
      "Submit competitive quotations directly in the platform. Compare your bids, track win rates, and optimise your pricing strategy.",
  },
  {
    icon: FileCheck2,
    title: "Document Management",
    description:
      "Upload and manage phytosanitary certificates, packing lists, and quality certificates in one secure place — accessible to buyers during negotiation.",
  },
  {
    icon: Users,
    title: "Dedicated Support",
    description:
      "Our team of trade specialists is available to help you onboard, optimise your profile, and close deals with international buyers.",
  },
];

const steps = [
  {
    step: "01",
    title: "Register & Create Profile",
    description:
      "Sign up with your business email, complete your company profile, and describe the commodities you export.",
  },
  {
    step: "02",
    title: "Upload Documents",
    description:
      "Submit your company registration certificate, export licence, and any commodity-specific quality certifications.",
  },
  {
    step: "03",
    title: "Admin Verification",
    description:
      "Our team reviews your documents within 2 business days. You'll receive an email once your account is verified.",
  },
  {
    step: "04",
    title: "Browse & Quote",
    description:
      "Explore open RFQs from international buyers, submit competitive quotations, and start building global trade relationships.",
  },
];

const requirements = [
  "Valid company registration certificate",
  "Export licence or permit",
  "Tax identification number",
  "Bank account information (for payments)",
  "Product quality certificates or lab analysis reports",
  "At least one active commodity for export",
];

export default function BecomeSupplier() {
  return (
    <PublicLayout>
      <section className="pt-16 pb-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
              For Suppliers
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Export Sudan's finest commodities to the world
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Join hundreds of verified Sudanese exporters connecting with international buyers on a
              transparent, professional B2B platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 h-12 px-8">
                <Link href="/sign-up">Register as Supplier</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-8">
                <Link href="/contact">Talk to Our Team</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Why Join as a Supplier?</h2>
          <p className="text-gray-500 mb-10">Benefits designed for Sudanese exporters.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b) => {
              const Icon = b.icon;
              return (
                <Card key={b.title} className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-primary" />
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">How to Get Started</h2>
          <p className="text-gray-500 mb-10">Four simple steps to start exporting globally.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.step} className="relative">
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm h-full">
                  <div className="text-4xl font-black text-primary/10 mb-3">{s.step}</div>
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

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Eligibility Requirements</h2>
              <p className="text-gray-500 mb-6">
                To maintain platform quality, all suppliers must meet the following criteria before
                approval.
              </p>
              <ul className="space-y-3">
                {requirements.map((r) => (
                  <li key={r} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-gray-700 text-sm">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-primary rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-3">Ready to start exporting?</h3>
              <p className="text-green-200 mb-6 text-sm leading-relaxed">
                Registration takes less than 10 minutes. Our verification team will review your
                documents within 2 business days.
              </p>
              <Button asChild className="bg-[#C9A24A] hover:bg-[#b88e3a] text-white border-0 w-full h-11">
                <Link href="/sign-up">
                  Create Supplier Account <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <p className="text-green-300 text-xs mt-4 text-center">
                Already registered?{" "}
                <Link href="/sign-in" className="text-white underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
