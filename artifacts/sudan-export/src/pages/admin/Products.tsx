import { useState } from "react";
import {
  useListProducts,
  useUpdateProduct,
  getListProductsQueryKey,
} from "@workspace/api-client-react";
import type { Product } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import PortalLayout from "@/components/layout/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Package, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

interface EditForm {
  name: string;
  description: string;
  category: string;
  unit: string;
  isActive: boolean;
}

export default function AdminProducts() {
  const { t } = useTranslation();
  const { data: products = [], isLoading } = useListProducts();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const updateProduct = useUpdateProduct();

  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [form, setForm] = useState<EditForm>({ name: "", description: "", category: "", unit: "", isActive: true });

  const openEdit = (product: Product) => {
    setEditTarget(product);
    setForm({ name: product.name, description: product.description ?? "", category: product.category ?? "", unit: product.unit, isActive: product.isActive });
  };

  const closeEdit = () => setEditTarget(null);

  const handleSave = () => {
    if (!editTarget) return;
    updateProduct.mutate({
      productId: editTarget.id,
      data: {
        name: form.name.trim() || undefined,
        description: form.description.trim() || null,
        category: form.category.trim() || null,
        unit: form.unit.trim() || undefined,
        isActive: form.isActive,
      },
    }, {
      onSuccess: () => {
        toast({ title: t("admin.products.updateSuccess") });
        queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
        closeEdit();
      },
      onError: () => {
        toast({ title: t("admin.products.updateError"), description: t("admin.products.updateErrorDesc"), variant: "destructive" });
      },
    });
  };

  return (
    <PortalLayout role="admin" title={t("admin.products.title")}>
      <div className="mb-6">
        <p className="text-gray-500 text-sm">{t("admin.products.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : products.length === 0 ? (
          <div className="col-span-full text-center py-16 px-4 bg-white rounded-xl shadow-sm border border-gray-100">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{t("admin.products.noProducts")}</h3>
            <p className="text-gray-500 text-sm">{t("admin.products.noProductsDesc")}</p>
          </div>
        ) : (
          products.map((product) => (
            <Card key={product.id} className="border-none shadow-sm overflow-hidden group">
              <div className="aspect-video bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center overflow-hidden relative">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <Package className="w-12 h-12 text-primary/30" />
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-900">{product.name}</h3>
                  <Badge variant="outline" className={product.isActive ? "border-green-200 text-green-700 bg-green-50" : "border-gray-200 text-gray-500"}>
                    {product.isActive ? t("admin.products.active") : t("admin.products.inactive")}
                  </Badge>
                </div>
                {product.category && (
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">{product.category}</p>
                )}
                <p className="text-sm text-gray-500 line-clamp-2">
                  {product.description || t("admin.products.noDescription")}
                </p>
                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    <span>{t("admin.products.unit")}: </span>
                    <span className="font-medium text-gray-700">{product.unit}</span>
                  </div>
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-gray-500 hover:text-primary hover:bg-primary/5 gap-1" onClick={() => openEdit(product)}>
                    <Pencil className="h-3 w-3" />
                    {t("common.edit")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={!!editTarget} onOpenChange={(open) => !open && closeEdit()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("admin.products.editTitle")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="edit-name">{t("admin.products.name")}</Label>
              <Input id="edit-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t("admin.products.namePlaceholder")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-description">{t("admin.products.description")}</Label>
              <Input id="edit-description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder={t("common.optional")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="edit-category">{t("admin.products.category")}</Label>
                <Input id="edit-category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Oilseeds" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-unit">{t("admin.products.unitLabel")}</Label>
                <Input id="edit-unit" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="e.g. MT" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" role="switch" aria-checked={form.isActive}
                onClick={() => setForm({ ...form, isActive: !form.isActive })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${form.isActive ? "bg-primary" : "bg-gray-200"}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.isActive ? "translate-x-6" : "translate-x-1"}`} />
              </button>
              <Label className="cursor-pointer" onClick={() => setForm({ ...form, isActive: !form.isActive })}>
                {form.isActive ? t("admin.products.activeVisible") : t("admin.products.inactiveHidden")}
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeEdit} disabled={updateProduct.isPending}>{t("common.cancel")}</Button>
            <Button onClick={handleSave} disabled={!form.name.trim() || !form.unit.trim() || updateProduct.isPending} className="bg-primary hover:bg-primary/90">
              {updateProduct.isPending ? t("common.saving") : t("common.saveChanges")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PortalLayout>
  );
}
