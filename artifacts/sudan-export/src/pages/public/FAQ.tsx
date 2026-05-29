import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import PublicLayout from "@/components/layout/PublicLayout";
import { useTranslation } from "react-i18next";

type FaqCategory = "general" | "buyers" | "suppliers" | "platform";

const categories: FaqCategory[] = ["general", "buyers", "suppliers", "platform"];
const categoryItemCounts: Record<FaqCategory, number> = {
  general: 3,
  buyers: 4,
  suppliers: 3,
  platform: 3,
};

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        className="w-full text-start flex items-center justify-between py-5 gap-4"
        onClick={() => setOpen(!open)}
      >
        <span className="font-medium text-gray-900 text-sm sm:text-base">{q}</span>
        {open ? (
          <ChevronUp className="w-5 h-5 text-primary shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
        )}
      </button>
      {open && (
        <div className="pb-5 text-sm text-gray-600 leading-relaxed">{a}</div>
      )}
    </div>
  );
}

export default function FAQ() {
  const { t } = useTranslation();

  return (
    <PublicLayout>
      <section className="pt-16 pb-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
              {t("faq.badge")}
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{t("faq.title")}</h1>
            <p className="text-lg text-gray-600">{t("faq.subtitle")}</p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl space-y-10">
            {categories.map((cat) => {
              const count = categoryItemCounts[cat];
              return (
                <div key={cat}>
                  <h2 className="text-lg font-bold text-primary mb-4 pb-2 border-b-2 border-primary/20">
                    {t(`faq.${cat}.title`)}
                  </h2>
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-100 px-6">
                    {Array.from({ length: count }, (_, i) => (
                      <AccordionItem
                        key={i}
                        q={t(`faq.${cat}.q${i + 1}`)}
                        a={t(`faq.${cat}.a${i + 1}`)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center max-w-lg">
          <h2 className="text-2xl font-bold text-white mb-3">{t("faq.cta.title")}</h2>
          <p className="text-green-200 mb-6">{t("faq.cta.subtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="outline" className="bg-white text-primary hover:bg-white/90 border-white h-11 px-8">
              <Link href="/contact">{t("faq.cta.btn1")}</Link>
            </Button>
            <Button asChild className="bg-[#C9A24A] hover:bg-[#b88e3a] text-white border-0 h-11 px-8">
              <Link href="/sign-up">{t("faq.cta.btn2")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
