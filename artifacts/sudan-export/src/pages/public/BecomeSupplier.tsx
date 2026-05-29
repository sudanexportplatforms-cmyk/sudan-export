import { Link } from "wouter";
import { CheckCircle2, ArrowRight, Globe2, ShieldCheck, TrendingUp, FileCheck2, Users, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PublicLayout from "@/components/layout/PublicLayout";
import { useTranslation } from "react-i18next";

const benefitIcons = [Globe2, TrendingUp, ShieldCheck, Banknote, FileCheck2, Users];
const benefitKeys = ["b1", "b2", "b3", "b4", "b5", "b6"] as const;
const stepKeys = ["s1", "s2", "s3", "s4"] as const;

export default function BecomeSupplier() {
  const { t } = useTranslation();
  const eligibilityItems: string[] = t("becomeSupplier.eligibility.items", { returnObjects: true }) as string[];

  return (
    <PublicLayout>
      <section className="pt-16 pb-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
              {t("becomeSupplier.badge")}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {t("becomeSupplier.title")}
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {t("becomeSupplier.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 h-12 px-8">
                <Link href="/sign-up">{t("becomeSupplier.cta1")}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-8">
                <Link href="/contact">{t("becomeSupplier.cta2")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("becomeSupplier.why.title")}</h2>
          <p className="text-gray-500 mb-10">{t("becomeSupplier.why.subtitle")}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefitKeys.map((key, i) => {
              const Icon = benefitIcons[i];
              return (
                <Card key={key} className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{t(`becomeSupplier.benefits.${key}.title`)}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{t(`becomeSupplier.benefits.${key}.desc`)}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("becomeSupplier.steps.title")}</h2>
          <p className="text-gray-500 mb-10">{t("becomeSupplier.steps.subtitle")}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stepKeys.map((key, i) => (
              <div key={key} className="relative">
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm h-full">
                  <div className="text-4xl font-black text-primary/10 mb-3">{t(`becomeSupplier.steps.${key}.step`)}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t(`becomeSupplier.steps.${key}.title`)}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{t(`becomeSupplier.steps.${key}.desc`)}</p>
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

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("becomeSupplier.eligibility.title")}</h2>
              <p className="text-gray-500 mb-6">{t("becomeSupplier.eligibility.subtitle")}</p>
              <ul className="space-y-3">
                {Array.isArray(eligibilityItems) && eligibilityItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-primary rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-3">{t("becomeSupplier.final.title")}</h3>
              <p className="text-green-200 mb-6 text-sm leading-relaxed">{t("becomeSupplier.final.subtitle")}</p>
              <Button asChild className="bg-[#C9A24A] hover:bg-[#b88e3a] text-white border-0 w-full h-11">
                <Link href="/sign-up">
                  {t("becomeSupplier.final.cta")} <ArrowRight className="ltr:ml-2 rtl:mr-2 w-4 h-4 rtl:rotate-180" />
                </Link>
              </Button>
              <p className="text-green-300 text-xs mt-4 text-center">
                <Link href="/sign-in" className="text-white underline">
                  {t("nav.signIn")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
