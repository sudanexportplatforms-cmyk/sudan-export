import { Link } from "wouter";
import { ArrowRight, Globe2, ShieldCheck, BarChart3, MessageSquare, Zap, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PublicLayout from "@/components/layout/PublicLayout";
import { useTranslation } from "react-i18next";

const benefitIcons = [Globe2, FileSearch, ShieldCheck, BarChart3, MessageSquare, Zap];
const benefitKeys = ["b1", "b2", "b3", "b4", "b5", "b6"] as const;
const stepKeys = ["s1", "s2", "s3", "s4"] as const;

const commodities = [
  { name: "Sesame Seeds", origin: "Gedaref, Sudan", grade: "Humera & Wad Medani varieties" },
  { name: "Gum Arabic", origin: "Kordofan, Sudan", grade: "Grade 1 & Grade 3 Hashab" },
  { name: "Groundnuts", origin: "Darfur & Kordofan", grade: "Runner & Virginia types" },
  { name: "Hibiscus (Karkadeh)", origin: "Darfur, Sudan", grade: "Dry calyces, premium export quality" },
  { name: "Cotton", origin: "Gezira Scheme, Sudan", grade: "Long-staple Barakat & Acala" },
];

export default function BecomeBuyer() {
  const { t } = useTranslation();

  return (
    <PublicLayout>
      <section className="pt-16 pb-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-[#96762B] font-medium text-sm mb-4">
              {t("becomeBuyer.badge")}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {t("becomeBuyer.title")}
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {t("becomeBuyer.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 h-12 px-8">
                <Link href="/sign-up">{t("becomeBuyer.cta1")}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-8">
                <Link href="/products">{t("becomeBuyer.cta2")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("becomeBuyer.why.title")}</h2>
          <p className="text-gray-500 mb-10">{t("becomeBuyer.why.subtitle")}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefitKeys.map((key, i) => {
              const Icon = benefitIcons[i];
              return (
                <Card key={key} className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 bg-accent/15 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{t(`becomeBuyer.benefits.${key}.title`)}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{t(`becomeBuyer.benefits.${key}.desc`)}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("becomeBuyer.commodities.title")}</h2>
          <p className="text-gray-500 mb-8">{t("becomeBuyer.commodities.subtitle")}</p>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("becomeBuyer.steps.title")}</h2>
          <p className="text-gray-500 mb-10">{t("becomeBuyer.steps.subtitle")}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stepKeys.map((key, i) => (
              <div key={key} className="relative">
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm h-full">
                  <div className="text-4xl font-black text-accent/20 mb-3">{t(`becomeBuyer.steps.${key}.step`)}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t(`becomeBuyer.steps.${key}.title`)}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{t(`becomeBuyer.steps.${key}.desc`)}</p>
                </div>
                {i < stepKeys.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 ltr:-right-3 rtl:-left-3 z-10 -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-gray-300 rtl:rotate-180" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl font-bold text-white mb-4">{t("becomeBuyer.final.title")}</h2>
          <p className="text-green-200 mb-8">{t("becomeBuyer.final.subtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="bg-[#C9A24A] hover:bg-[#b88e3a] text-white border-0 h-12 px-8">
              <Link href="/sign-up">
                {t("becomeBuyer.final.cta")} <ArrowRight className="ltr:ml-2 rtl:mr-2 w-4 h-4 rtl:rotate-180" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 h-12 px-8">
              <Link href="/products">{t("becomeBuyer.cta2")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
