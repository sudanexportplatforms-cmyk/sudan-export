import { useListProducts } from "@workspace/api-client-react";
import PortalLayout from "@/components/layout/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";

export default function AdminProducts() {
  const { data: products = [], isLoading } = useListProducts();

  return (
    <PortalLayout role="admin" title="Product Catalog">
      <div className="mb-6">
        <p className="text-gray-500 text-sm">
          Core commodity catalog. Products are seeded via the database seed script.
          Contact a developer to add or modify products.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : products.length === 0 ? (
          <div className="col-span-full text-center py-16 px-4 bg-white rounded-xl shadow-sm border border-gray-100">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No Products</h3>
            <p className="text-gray-500 text-sm">Run the seed script to populate the product catalog.</p>
          </div>
        ) : (
          products.map((product) => (
            <Card key={product.id} className="border-none shadow-sm overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package className="w-12 h-12 text-primary/30" />
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-900">{product.name}</h3>
                  <Badge
                    variant="outline"
                    className={product.isActive ? "border-green-200 text-green-700 bg-green-50" : "border-gray-200 text-gray-500"}
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                {product.category && (
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                    {product.category}
                  </p>
                )}
                <p className="text-sm text-gray-500 line-clamp-2">
                  {product.description || "No description."}
                </p>
                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                  <span>Unit</span>
                  <span className="font-medium text-gray-700">{product.unit}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </PortalLayout>
  );
}
