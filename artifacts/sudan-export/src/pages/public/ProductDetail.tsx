import { Link } from "wouter";
import { useListProducts } from "@workspace/api-client-react";
import { ArrowLeft, ArrowRight, Package, Globe2, Scale, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PublicLayout from "@/components/layout/PublicLayout";
import { useTranslation } from "react-i18next";

interface Props {
  params: { slug: string };
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

const productFacts: Record<string, { origin: string; season: string; grade: string; export: string }> = {
  "sesame-seeds": {
    origin: "Gedaref & Kassala, Sudan",
    season: "October – December",
    grade: "Humera, Wad Medani & Machine-Cleaned varieties",
    export: "Bulk, Jumbo bags, PP bags (25kg, 50kg)",
  },
  "gum-arabic": {
    origin: "North Kordofan & South Darfur, Sudan",
    season: "November – February",
    grade: "Grade 1 Hashab (Acacia senegal) & Talha (Acacia seyal)",
    export: "Kibble, Spray-dried powder, Hand-picked grades",
  },
  groundnuts: {
    origin: "North Darfur, North Kordofan & Kassala",
    season: "October – February",
    grade: "Runner, Virginia & Valencia types",
    export: "In-shell, Shelled, Blanched, Oil",
  },
  hibiscus: {
    origin: "North Darfur & Gedaref, Sudan",
    season: "November – January",
    grade: "Premium dry calyces, Red Grade A",
    export: "Whole dried calyces, Powder, Concentrate",
  },
  cotton: {
    origin: "Gezira Scheme & New Halfa, Sudan",
    season: "December – February",
    grade: "Long-staple Barakat & Short-staple Acala",
    export: "Raw lint, Yarn, Linters",
  },
};

function normSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export default function ProductDetail({ params }: Props) {
  const { data: products = [], isLoading } = useListProducts({ active: true });
  const { t } = useTranslation();
  const slug = decodeURIComponent(params.slug).toLowerCase();

  const product = products.find((p) => normSlug(p.name) === slug);
  const facts = productFacts[slug] ?? productFacts[Object.keys(productFacts).find((k) => slug.includes(k.split("-")[0])) ?? ""] ?? null;

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="flex justify-center py-32">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </PublicLayout>
    );
  }

  if (!product) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-24 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("productDetail.notFound")}</h1>
          <p className="text-gray-500 mb-6">{t("productDetail.notFoundDesc")}</p>
          <Button asChild variant="outline">
            <Link href="/products">
              <ArrowLeft className="ltr:mr-2 rtl:ml-2 w-4 h-4 rtl:rotate-180" />
              {t("productDetail.backToProducts")}
            </Link>
          </Button>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <section className="pt-10 pb-4">
        <div className="container mx-auto px-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            {t("productDetail.back")}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-primary/5 via-primary/8 to-accent/10 aspect-[4/3] flex items-center justify-center text-9xl shadow-sm">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <span>{productEmoji(product.name)}</span>
              )}
            </div>

            <div>
              {product.category && (
                <span className="text-xs font-medium bg-gray-100 text-gray-600 px-3 py-1 rounded-full uppercase tracking-wide">
                  {product.category}
                </span>
              )}
              <h1 className="text-4xl font-bold text-gray-900 mt-3 mb-4">{product.name}</h1>
              <p className="text-gray-600 leading-relaxed mb-6">
                {product.description ||
                  `${product.name} is one of Sudan's premier export commodities, sourced from verified producers and traded globally.`}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                    <Scale className="w-3.5 h-3.5" /> {t("productDetail.unit")}
                  </div>
                  <p className="font-semibold text-gray-900">{product.unit}</p>
                </div>
                {facts && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                      <Tag className="w-3.5 h-3.5" /> {t("productDetail.facts.grade")}
                    </div>
                    <p className="font-semibold text-gray-900 text-sm leading-tight">{facts.grade}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild className="bg-primary hover:bg-primary/90 h-11 flex-1">
                  <Link href="/sign-up">
                    {t("productDetail.requestRfq")} <ArrowRight className="ltr:ml-2 rtl:mr-2 w-4 h-4 rtl:rotate-180" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-11">
                  <Link href="/become-supplier">{t("productDetail.becomeSupplier")}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {facts && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{t("productDetail.specifications")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Globe2, label: t("productDetail.facts.origin"), value: facts.origin },
                { icon: Tag, label: t("productDetail.facts.grade"), value: facts.grade },
                { icon: Scale, label: t("productDetail.facts.export"), value: facts.export },
                { icon: Package, label: t("productDetail.facts.season"), value: facts.season },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Card key={item.label} className="border-none shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 text-primary mb-2">
                        <Icon className="w-4 h-4" />
                        <span className="text-xs font-medium uppercase tracking-wide">{item.label}</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-snug">{item.value}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="py-12 bg-primary">
        <div className="container mx-auto px-4 text-center max-w-xl">
          <h2 className="text-2xl font-bold text-white mb-3">
            {t("productDetail.requestRfq")} — {product.name}
          </h2>
          <p className="text-green-200 mb-6 text-sm">
            Register and post an RFQ to receive competitive quotations from verified Sudanese exporters within 48 hours.
          </p>
          <Button asChild className="bg-[#C9A24A] hover:bg-[#b88e3a] text-white border-0 h-11 px-8">
            <Link href="/sign-up">
              {t("productDetail.requestRfq")} <ArrowRight className="ltr:ml-2 rtl:mr-2 w-4 h-4 rtl:rotate-180" />
            </Link>
          </Button>
        </div>
      </section>
    </PublicLayout>
  );
}
