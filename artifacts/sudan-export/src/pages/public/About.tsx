import { Link } from "wouter";
import { ShieldCheck, Globe2, Handshake, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PublicLayout from "@/components/layout/PublicLayout";

const values = [
  {
    icon: ShieldCheck,
    title: "Trust & Verification",
    description:
      "Every supplier and buyer on the platform is identity-verified and document-checked. We maintain strict onboarding standards to protect all parties.",
  },
  {
    icon: Globe2,
    title: "Global Reach",
    description:
      "We connect Sudanese agricultural exporters with buyers across 40+ countries — from Europe and North America to Asia and the Gulf.",
  },
  {
    icon: Handshake,
    title: "Fair Trade",
    description:
      "Our transparent RFQ system ensures competitive, market-driven pricing without hidden middlemen or opaque markups.",
  },
  {
    icon: TrendingUp,
    title: "Economic Growth",
    description:
      "We are committed to growing Sudan's agricultural export revenues by giving local producers direct access to international markets.",
  },
];

const team = [
  { name: "Ahmed Al-Rasheed", role: "Chief Executive Officer", initials: "AA" },
  { name: "Sara Nour", role: "Chief Operations Officer", initials: "SN" },
  { name: "Omar Hassan", role: "Head of Supplier Relations", initials: "OH" },
  { name: "Fatima Khalid", role: "Head of Buyer Relations", initials: "FK" },
];

const milestones = [
  { year: "2022", event: "Platform founded in Khartoum with a mission to digitise agricultural trade." },
  { year: "2023", event: "First 50 verified suppliers onboarded across five core commodities." },
  { year: "2024", event: "Expanded buyer network to 30+ countries; launched structured RFQ workflow." },
  { year: "2025", event: "Reached USD 10M in facilitated trade volume; launched mobile access." },
];

export default function About() {
  return (
    <PublicLayout>
      <section className="pt-16 pb-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
              About Us
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Bridging Sudanese exporters with the world
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Sudan Export Platform was founded to modernise agricultural commodity trade — replacing
              fragmented, opaque processes with a transparent, digital B2B marketplace that works
              for both exporters and international buyers.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Sudan is one of Africa's largest producers of sesame seeds, gum arabic, groundnuts,
                hibiscus, and cotton — yet many of its exporters have lacked the tools and
                connections to reach premium international buyers efficiently.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Sudan Export Platform solves this by providing a secure, structured B2B marketplace
                where verified Sudanese suppliers can showcase their products, receive detailed
                sourcing requests, and compete for international contracts — all in one place.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our platform handles the complexity of B2B trade: RFQ management, quotation
                comparison, document handling, supplier verification, and direct communication —
                so both sides can focus on what matters: the deal.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "5", label: "Core Commodities" },
                { value: "40+", label: "Buyer Countries" },
                { value: "200+", label: "Verified Suppliers" },
                { value: "$10M+", label: "Trade Volume Facilitated" },
              ].map((stat) => (
                <div key={stat.label} className="bg-primary/5 rounded-2xl p-6 text-center">
                  <p className="text-3xl font-black text-primary">{stat.value}</p>
                  <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <Card key={v.title} className="border-none shadow-sm">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{v.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{v.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Our Journey</h2>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 hidden sm:block" />
            <div className="space-y-8">
              {milestones.map((m) => (
                <div key={m.year} className="flex items-start gap-6">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shadow-sm hidden sm:flex">
                    {m.year.slice(2)}
                  </div>
                  <div className="pt-2 flex-1">
                    <span className="text-xs font-bold text-primary uppercase tracking-widest sm:hidden">
                      {m.year}
                    </span>
                    <p className="text-gray-700">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Leadership Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl mx-auto mb-4">
                  {member.initials}
                </div>
                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center max-w-xl">
          <h2 className="text-2xl font-bold text-white mb-3">Join the Platform</h2>
          <p className="text-green-200 mb-6">
            Whether you are an international buyer or a Sudanese exporter, we have a place for
            you on Sudan Export Platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-[#C9A24A] hover:bg-[#b88e3a] text-white border-0 h-11 px-8">
              <Link href="/sign-up">
                Get Started <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-white text-white hover:bg-white/10 h-11 px-8">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
