import { Link } from "wouter";
import { useListProducts } from "@workspace/api-client-react";
import { Package, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PublicLayout from "@/components/layout/PublicLayout";

function productEmoji(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("sesame")) return "🌿";
  if (n.includes("gum")) return "🌳";
  if (n.includes("ground") || n.includes("peanut")) return "🥜";
  if (n.includes("hibiscus") || n.includes("karkadeh")) return "🌺";
  if (n.includes("cotton")) return "🌸";
  return "🌾";
}

function toSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export default function Products() {
  const { data: products = [], isLoading } = useListProducts({ active: true });

  return (
    <PublicLayout>
      <section className="pt-16 pb-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
              Commodities
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Sudan's Finest Agricultural Exports
            </h1>
            <p className="text-lg text-gray-600">
              Source premium quality commodities directly from verified Sudanese exporters. Browse
              our five flagship products and post an RFQ to receive competitive quotations.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center py-24">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-gray-700">No products available</h2>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <Link key={product.id} href={`/products/${encodeURIComponent(toSlug(product.name))}`} className="group">
                  <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-200 group-hover:-translate-y-1 overflow-hidden h-full flex flex-col">
                    <div className="aspect-[4/3] bg-gradient-to-br from-primary/5 via-primary/8 to-accent/10 flex items-center justify-center text-7xl overflow-hidden">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{productEmoji(product.name)}</span>
                      )}
                    </div>
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-3">
                        <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                          {product.name}
                        </h2>
                        {product.category && (
                          <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full uppercase tracking-wide shrink-0 ml-2">
                            {product.category}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-4">
                        {product.description ||
                          "Premium quality, internationally traded Sudanese commodity."}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-xs text-gray-400">Unit</p>
                          <p className="text-sm font-medium text-gray-700">{product.unit}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-primary hover:text-primary hover:bg-primary/5"
                        >
                          View Details <ArrowRight className="ml-1 w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to source?</h2>
          <p className="text-gray-600 mb-6">
            Post an RFQ and receive competitive quotations from verified Sudanese exporters within
            48 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-primary hover:bg-primary/90 h-11 px-8">
              <Link href="/sign-up">
                Post an RFQ <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-11 px-8">
              <Link href="/become-supplier">Become a Supplier</Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
