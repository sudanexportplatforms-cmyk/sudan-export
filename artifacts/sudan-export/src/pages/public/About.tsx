import { Link } from "wouter";
import { ShieldCheck, Globe2, Handshake, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PublicLayout from "@/components/layout/PublicLayout";
import { useTranslation } from "react-i18next";

const valueIcons = [ShieldCheck, Globe2, Handshake, TrendingUp];
const valueKeys = ["item1", "item2", "item3", "item4"] as const;
const teamKeys = ["member1", "member2", "member3", "member4"] as const;
const teamInitials = ["AA", "SN", "OH", "FK"];
const milestoneKeys = ["m1", "m2", "m3", "m4"] as const;

const aboutStats = [
  { value: "5", key: "commodities" },
  { value: "40+", key: "countries" },
  { value: "200+", key: "suppliers" },
  { value: "$10M+", key: "volume" },
] as const;

export default function About() {
  const { t } = useTranslation();

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="pt-16 pb-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
              {t("about.badge")}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {t("about.title")}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              {t("about.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("about.mission.title")}</h2>
              <p className="text-gray-600 leading-relaxed mb-4">{t("about.mission.p1")}</p>
              <p className="text-gray-600 leading-relaxed mb-4">{t("about.mission.p2")}</p>
              <p className="text-gray-600 leading-relaxed">{t("about.mission.p3")}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {aboutStats.map((stat) => (
                <div key={stat.key} className="bg-primary/5 rounded-2xl p-6 text-center">
                  <p className="text-3xl font-black text-primary">{stat.value}</p>
                  <p className="text-sm text-gray-600 mt-1">{t(`about.stats.${stat.key}`)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">{t("about.values.title")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {valueKeys.map((key, i) => {
              const Icon = valueIcons[i];
              return (
                <Card key={key} className="border-none shadow-sm">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {t(`about.values.${key}.title`)}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {t(`about.values.${key}.description`)}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">{t("about.journey.title")}</h2>
          <div className="relative">
            <div className="absolute ltr:left-6 rtl:right-6 top-0 bottom-0 w-0.5 bg-gray-200 hidden sm:block" />
            <div className="space-y-8">
              {milestoneKeys.map((key) => (
                <div key={key} className="flex items-start gap-6">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shadow-sm hidden sm:flex">
                    {t(`about.journey.${key}.year`).slice(2)}
                  </div>
                  <div className="pt-2 flex-1">
                    <span className="text-xs font-bold text-primary uppercase tracking-widest sm:hidden">
                      {t(`about.journey.${key}.year`)}
                    </span>
                    <p className="text-gray-700">{t(`about.journey.${key}.event`)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">{t("about.team.title")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {teamKeys.map((key, i) => (
              <div key={key} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl mx-auto mb-4">
                  {teamInitials[i]}
                </div>
                <h3 className="font-semibold text-gray-900">{t(`about.team.${key}.name`)}</h3>
                <p className="text-sm text-gray-500 mt-1">{t(`about.team.${key}.role`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center max-w-xl">
          <h2 className="text-2xl font-bold text-white mb-3">{t("about.cta.title")}</h2>
          <p className="text-green-200 mb-6">{t("about.cta.subtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-[#C9A24A] hover:bg-[#b88e3a] text-white border-0 h-11 px-8">
              <Link href="/sign-up">
                {t("about.cta.btn1")} <ArrowRight className="ltr:ml-2 rtl:mr-2 w-4 h-4 rtl:rotate-180" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-white text-white hover:bg-white/10 h-11 px-8">
              <Link href="/contact">{t("about.cta.btn2")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
