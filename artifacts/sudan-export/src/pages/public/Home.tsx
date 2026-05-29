import { Link } from "wouter";
import { ArrowRight, Globe2, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useListProducts } from "@workspace/api-client-react";
import PublicLayout from "@/components/layout/PublicLayout";
import { useTranslation } from "react-i18next";

const featureIcons = [ShieldCheck, Globe2, Zap];
const stepKeys = ["step1", "step2", "step3", "step4"] as const;
const featureKeys = ["item1", "item2", "item3"] as const;
const statKeys = [
  { value: "5", key: "commodities" },
  { value: "40+", key: "countries" },
  { value: "100%", key: "verified" },
  { value: "24h", key: "turnaround" },
] as const;

export default function Home() {
  const { data: products = [] } = useListProducts({ active: true });
  const { t, i18n } = useTranslation();
  const isAr = i18n.language.startsWith("ar");

  const stepRoleColor = (stepKey: string) => {
    const role = t(`home.howItWorks.${stepKey}.role`);
    if (role === "Buyer" || role === "مشترٍ") return "bg-green-100 text-green-700";
    if (role === "Supplier" || role === "مورد") return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-600";
  };

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
              {t("home.badge")}
            </div>
            <h1 className={`text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-8 leading-[1.08] ${isAr ? "leading-snug" : ""}`}>
              {t("home.hero.title1")}{" "}
              <span className="text-primary">{t("home.hero.title2")}</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl leading-relaxed">
              {t("home.hero.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="h-14 px-8 text-base bg-primary hover:bg-primary/90 shadow-md" asChild>
                <Link href="/sign-up">
                  {t("home.hero.cta1")} <ArrowRight className="ltr:ml-2 rtl:mr-2 w-5 h-5 rtl:rotate-180" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-base border-gray-200" asChild>
                <Link href="/products">{t("home.hero.cta2")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-100 bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statKeys.map((s) => (
              <div key={s.key} className="text-center">
                <p className="text-3xl font-black text-primary">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1">{t(`home.stats.${s.key}`)}</p>
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
              <h2 className="text-3xl font-bold text-gray-900">{t("home.commodities.title")}</h2>
              <p className="text-gray-500 mt-2">{t("home.commodities.subtitle")}</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/products">
                {t("home.commodities.viewAll")} <ArrowRight className="ltr:ml-1.5 rtl:mr-1.5 w-4 h-4 rtl:rotate-180" />
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
                      <div className="text-4xl">{productEmoji(product.name)}</div>
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
            <h2 className="text-3xl font-bold text-gray-900">{t("home.howItWorks.title")}</h2>
            <p className="text-gray-500 mt-3">{t("home.howItWorks.subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stepKeys.map((key) => (
              <div key={key} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl font-black text-primary/10">
                    {t(`home.howItWorks.${key}.step`)}
                  </span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${stepRoleColor(key)}`}>
                    {t(`home.howItWorks.${key}.role`)}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {t(`home.howItWorks.${key}.title`)}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t(`home.howItWorks.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900">{t("home.features.title")}</h2>
            <p className="text-gray-500 mt-3">{t("home.features.subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featureKeys.map((key, i) => {
              const Icon = featureIcons[i];
              return (
                <div key={key} className="p-6 rounded-xl border border-gray-100 bg-white shadow-sm">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {t(`home.features.${key}.title`)}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {t(`home.features.${key}.description`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t("home.cta.title")}
          </h2>
          <p className="text-green-200 mb-8 text-lg">{t("home.cta.subtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-[#C9A24A] hover:bg-[#b88e3a] text-white border-0 h-12 px-8">
              <Link href="/become-buyer">
                {t("home.cta.buyerBtn")} <ArrowRight className="ltr:ml-2 rtl:mr-2 w-4 h-4 rtl:rotate-180" />
              </Link>
            </Button>
            <Button size="lg" asChild variant="outline" className="border-white text-white hover:bg-white/10 h-12 px-8">
              <Link href="/become-supplier">{t("home.cta.supplierBtn")}</Link>
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
