import { useListProducts } from "@workspace/api-client-react";
import PortalLayout from "@/components/layout/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function SupplierProducts() {
  const { t } = useTranslation();
  const { data: products = [], isLoading } = useListProducts({ active: true });

  return (
    <PortalLayout role="supplier" title={t("supplier.products.title")}>
      <div className="mb-6">
        <p className="text-gray-500">{t("supplier.products.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : products.length === 0 ? (
          <div className="col-span-full text-center py-16 px-4 bg-white rounded-xl shadow-sm border border-gray-100">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">{t("supplier.products.noProducts")}</h3>
          </div>
        ) : (
          products.map((product) => (
            <Card key={product.id} className="border-none shadow-sm overflow-hidden flex flex-col">
              <div className="aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <Package className="w-12 h-12 text-gray-300" />
                )}
              </div>
              <CardContent className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900">{product.name}</h3>
                  <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded uppercase">
                    {product.category || t("supplier.products.general")}
                  </span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                  {product.description || t("supplier.products.noDescription")}
                </p>
                <div className="mt-auto border-t border-gray-100 pt-3 flex justify-between items-center">
                  <span className="text-xs text-gray-400">{t("supplier.products.unitOfMeasurement")}:</span>
                  <span className="text-sm font-medium text-gray-900">{product.unit}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </PortalLayout>
  );
}
