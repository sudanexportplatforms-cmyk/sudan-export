import { Link, useLocation } from "wouter";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateRfq, useListProducts, getListRfqsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import PortalLayout from "@/components/layout/PortalLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const rfqSchema = z.object({
  title: z.string().min(5),
  destinationCountry: z.string().optional(),
  deliveryPort: z.string().optional(),
  paymentTerms: z.string().optional(),
  incoterms: z.string().optional(),
  validUntil: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(z.object({
    productId: z.coerce.number().min(1),
    quantity: z.coerce.number().min(1),
    unit: z.string().min(1),
    targetPrice: z.coerce.number().optional(),
    specifications: z.string().optional()
  })).min(1)
});

type FormValues = z.infer<typeof rfqSchema>;

export default function NewRfq() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createRfq = useCreateRfq();
  const { data: products = [] } = useListProducts({ active: true });

  const form = useForm<FormValues>({
    resolver: zodResolver(rfqSchema),
    defaultValues: {
      title: "",
      destinationCountry: "",
      deliveryPort: "",
      paymentTerms: "",
      incoterms: "FOB",
      notes: "",
      items: [{ productId: 0, quantity: 1, unit: "MT", specifications: "" }]
    }
  });

  const { fields, append, remove } = useFieldArray({ name: "items", control: form.control });

  const onSubmit = (data: FormValues) => {
    createRfq.mutate({ data }, {
      onSuccess: (newRfq) => {
        queryClient.invalidateQueries({ queryKey: getListRfqsQueryKey() });
        toast({ title: t("buyer.newRfq.createSuccess"), description: t("buyer.newRfq.createSuccessDesc") });
        setLocation(`/buyer/rfqs/${newRfq.id}`);
      },
      onError: () => {
        toast({ title: t("buyer.newRfq.createError"), description: t("buyer.newRfq.createErrorDesc"), variant: "destructive" });
      }
    });
  };

  return (
    <PortalLayout role="buyer" title={t("buyer.newRfq.title")}>
      <div className="mb-6">
        <Button variant="ghost" asChild className="pl-0 hover:bg-transparent hover:text-primary">
          <Link href="/buyer/rfqs">
            <ArrowLeft className="w-4 h-4 ltr:mr-2 rtl:ml-2 rtl:rotate-180" />
            {t("buyer.newRfq.backBtn")}
          </Link>
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>{t("buyer.newRfq.generalInfo")}</CardTitle>
              <CardDescription>{t("buyer.newRfq.generalInfoDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("buyer.newRfq.rfqTitle")} <span className="text-red-500">*</span></FormLabel>
                  <FormControl><Input placeholder={t("buyer.newRfq.rfqTitlePlaceholder")} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="destinationCountry" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("buyer.newRfq.destinationCountry")}</FormLabel>
                    <FormControl><Input placeholder={t("buyer.newRfq.destinationPlaceholder")} {...field} value={field.value || ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="deliveryPort" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("buyer.newRfq.deliveryPort")}</FormLabel>
                    <FormControl><Input placeholder={t("buyer.newRfq.deliveryPortPlaceholder")} {...field} value={field.value || ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="incoterms" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("buyer.newRfq.incoterms")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder={t("buyer.newRfq.selectTerms")} /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="FOB">FOB (Free on Board)</SelectItem>
                        <SelectItem value="CIF">CIF (Cost, Insurance, Freight)</SelectItem>
                        <SelectItem value="EXW">EXW (Ex Works)</SelectItem>
                        <SelectItem value="CFR">CFR (Cost and Freight)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="paymentTerms" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("buyer.newRfq.paymentTerms")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder={t("buyer.newRfq.selectTerms")} /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="LC_AT_SIGHT">L/C at sight</SelectItem>
                        <SelectItem value="TT_ADVANCE">T/T Advance</SelectItem>
                        <SelectItem value="CAD">Cash Against Documents (CAD)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="validUntil" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("buyer.newRfq.validUntil")}</FormLabel>
                    <FormControl><Input type="date" {...field} value={field.value || ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="notes" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("buyer.newRfq.additionalNotes")}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t("buyer.newRfq.notesPlaceholder")} className="h-24" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{t("buyer.newRfq.requestedProducts")}</CardTitle>
                <CardDescription>{t("buyer.newRfq.requestedProductsDesc")}</CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => append({ productId: 0, quantity: 1, unit: "MT", specifications: "" })}>
                <Plus className="w-4 h-4 ltr:mr-2 rtl:ml-2" /> {t("buyer.newRfq.addItem")}
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {fields.map((field, index) => (
                <div key={field.id} className="p-4 bg-gray-50 border border-gray-100 rounded-lg relative">
                  {fields.length > 1 && (
                    <Button type="button" variant="ghost" size="icon"
                      className="absolute top-2 ltr:right-2 rtl:left-2 text-gray-400 hover:text-red-500 hover:bg-red-50"
                      onClick={() => remove(index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-2">
                    <div className="md:col-span-5">
                      <FormField control={form.control} name={`items.${index}.productId`} render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("buyer.newRfq.product")} <span className="text-red-500">*</span></FormLabel>
                          <Select onValueChange={(val) => field.onChange(parseInt(val, 10))} value={field.value ? field.value.toString() : ""}>
                            <FormControl><SelectTrigger className="bg-white"><SelectValue placeholder={t("buyer.newRfq.selectProduct")} /></SelectTrigger></FormControl>
                            <SelectContent>
                              {products.map(p => <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <div className="md:col-span-3">
                      <FormField control={form.control} name={`items.${index}.quantity`} render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("buyer.newRfq.quantity")} <span className="text-red-500">*</span></FormLabel>
                          <FormControl><Input type="number" min="0.1" step="any" className="bg-white" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <div className="md:col-span-2">
                      <FormField control={form.control} name={`items.${index}.unit`} render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("buyer.newRfq.unit")} <span className="text-red-500">*</span></FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger className="bg-white"><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="MT">MT</SelectItem>
                              <SelectItem value="KG">KG</SelectItem>
                              <SelectItem value="Tons">Tons</SelectItem>
                              <SelectItem value="Containers">Containers</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <div className="md:col-span-2">
                      <FormField control={form.control} name={`items.${index}.targetPrice`} render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("buyer.newRfq.targetPrice")}</FormLabel>
                          <FormControl><Input type="number" min="0" step="any" className="bg-white" placeholder={t("common.optional")} {...field} value={field.value || ''} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <FormField control={form.control} name={`items.${index}.specifications`} render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("buyer.newRfq.specifications")}</FormLabel>
                        <FormControl>
                          <Textarea className="bg-white h-20" placeholder={t("buyer.newRfq.specificationsPlaceholder")} {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>
              ))}
              {form.formState.errors.items?.root && (
                <p className="text-sm font-medium text-destructive">{form.formState.errors.items.root.message}</p>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button" asChild>
              <Link href="/buyer/rfqs">{t("common.cancel")}</Link>
            </Button>
            <Button type="submit" disabled={createRfq.isPending}>
              {createRfq.isPending && <Loader2 className="w-4 h-4 ltr:mr-2 rtl:ml-2 animate-spin" />}
              {t("buyer.newRfq.publishBtn")}
            </Button>
          </div>
        </form>
      </Form>
    </PortalLayout>
  );
}
