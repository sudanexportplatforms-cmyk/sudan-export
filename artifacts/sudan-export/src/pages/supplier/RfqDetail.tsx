import { useState } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  useGetRfq, 
  useCreateQuotation,
  getGetRfqQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import PortalLayout from "@/components/layout/PortalLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, MapPin, Ship, DollarSign, Calendar, Loader2, Info } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const quoteSchema = z.object({
  currency: z.string().min(1, "Currency is required"),
  validUntil: z.string().optional(),
  deliveryTime: z.string().optional(),
  paymentTerms: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(z.object({
    rfqItemId: z.coerce.number(),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
    unit: z.string().min(1, "Unit is required"),
    unitPrice: z.coerce.number().min(0.01, "Unit price must be > 0"),
    currency: z.string().min(1, "Currency is required"),
    specifications: z.string().optional()
  }))
});

type FormValues = z.infer<typeof quoteSchema>;

export default function SupplierRfqDetail() {
  const { rfqId } = useParams<{ rfqId: string }>();
  const id = parseInt(rfqId, 10);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  const { data: rfq, isLoading: rfqLoading } = useGetRfq(id, { 
    query: { enabled: !isNaN(id), queryKey: getGetRfqQueryKey(id) } 
  });
  
  const createQuotation = useCreateQuotation();

  const [isQuoting, setIsQuoting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      currency: "USD",
      validUntil: "",
      deliveryTime: "",
      paymentTerms: "",
      notes: "",
      items: []
    }
  });

  const { fields } = useFieldArray({
    name: "items",
    control: form.control
  });

  // Pre-fill items when rfq is loaded
  const startQuoting = () => {
    if (!rfq || !('items' in rfq)) return;
    
    const initialItems = (rfq as any).items.map((item: any) => ({
      rfqItemId: item.id,
      quantity: item.quantity,
      unit: item.unit,
      unitPrice: 0,
      currency: "USD",
      specifications: ""
    }));
    
    form.setValue("items", initialItems);
    form.setValue("paymentTerms", rfq.paymentTerms || "");
    setIsQuoting(true);
  };

  const onSubmit = (data: FormValues) => {
    // Ensure nested currency matches top level
    const payload = {
      ...data,
      items: data.items.map(item => ({ ...item, currency: data.currency }))
    };

    createQuotation.mutate({ rfqId: id, data: payload as any }, {
      onSuccess: (newQuote) => {
        toast({ title: "Quotation Submitted", description: "The buyer will review your quote." });
        setLocation("/supplier/quotations");
      }
    });
  };

  if (rfqLoading) {
    return (
      <PortalLayout role="supplier" title="RFQ Details">
        <div className="flex justify-center py-20">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </PortalLayout>
    );
  }

  if (!rfq) {
    return (
      <PortalLayout role="supplier" title="RFQ Not Found">
        <div className="text-center py-20">
          <h2 className="text-xl font-bold">RFQ not found</h2>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout role="supplier" title={`RFQ: ${rfq.referenceNumber}`}>
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" asChild className="pl-0 hover:bg-transparent hover:text-primary">
          <Link href="/supplier/rfqs">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to RFQs
          </Link>
        </Button>
      </div>

      <Card className="border-none shadow-sm mb-8">
        <CardHeader className="pb-4 border-b border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl mb-2">{rfq.title}</CardTitle>
              <CardDescription className="text-sm">Posted by {rfq.buyerCompanyName || rfq.buyerName || 'Verified Buyer'}</CardDescription>
            </div>
            {!isQuoting && rfq.status === 'open' && (
              <Button onClick={startQuoting}>Submit Quotation</Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-1.5"><MapPin className="w-4 h-4"/> Destination</p>
              <p className="text-gray-900 font-medium">{rfq.destinationCountry || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-1.5"><Ship className="w-4 h-4"/> Port</p>
              <p className="text-gray-900 font-medium">{rfq.deliveryPort || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-1.5"><DollarSign className="w-4 h-4"/> Incoterms</p>
              <p className="text-gray-900 font-medium">{rfq.incoterms || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-1.5"><Calendar className="w-4 h-4"/> Valid Until</p>
              <p className="text-gray-900 font-medium">{rfq.validUntil ? format(new Date(rfq.validUntil), 'MMM d, yyyy') : 'No limit'}</p>
            </div>
          </div>

          {rfq.notes && (
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-900 mb-2">Buyer's Notes</h3>
              <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 whitespace-pre-wrap border border-gray-100">
                {rfq.notes}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4">Requested Commodities</h3>
            <div className="border border-gray-100 rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-500">Product</th>
                    <th className="px-4 py-3 font-medium text-gray-500 text-right">Quantity Required</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {'items' in rfq && (rfq as any).items.map((item: any) => (
                    <tr key={item.id}>
                      <td className="px-4 py-4">
                        <p className="font-medium text-gray-900">{item.productName}</p>
                        {item.specifications && (
                          <p className="text-xs text-gray-500 mt-1">{item.specifications}</p>
                        )}
                        {item.targetPrice && (
                          <div className="mt-2 inline-flex items-center text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded">
                            <Info className="w-3 h-3 mr-1" /> Target: ${item.targetPrice}/{item.unit}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right font-medium">
                        {item.quantity} {item.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {isQuoting && (
        <Card className="border-none shadow-sm border-t-4 border-t-primary rounded-t-none">
          <CardHeader>
            <CardTitle>Your Quotation</CardTitle>
            <CardDescription>Provide your best price and terms for this request.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="USD">USD ($)</SelectItem>
                            <SelectItem value="EUR">EUR (€)</SelectItem>
                            <SelectItem value="AED">AED (د.إ)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="validUntil"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quote Valid Until <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input type="date" required {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="deliveryTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estimated Delivery Time <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 14-21 days from port" required {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="paymentTerms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Terms <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 30% advance, 70% against BL" required {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Pricing Breakdown</h3>
                  {fields.map((field, index) => {
                    const rfqItem = ('items' in rfq) ? (rfq as any).items.find((i: any) => i.id === field.rfqItemId) : null;
                    return (
                      <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start p-4 bg-gray-50 rounded-lg">
                        <div className="md:col-span-5">
                          <p className="font-medium text-sm text-gray-900 mb-1">{rfqItem?.productName}</p>
                          <p className="text-xs text-gray-500">Required: {rfqItem?.quantity} {rfqItem?.unit}</p>
                        </div>
                        
                        <div className="md:col-span-3">
                          <FormField
                            control={form.control}
                            name={`items.${index}.quantity`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs">Your Qty</FormLabel>
                                <FormControl>
                                  <Input type="number" step="any" className="bg-white h-9 text-sm" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="md:col-span-4">
                          <FormField
                            control={form.control}
                            name={`items.${index}.unitPrice`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs">Unit Price ({form.watch("currency")}) <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" className="bg-white h-9 text-sm" placeholder="0.00" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="md:col-span-12">
                          <FormField
                            control={form.control}
                            name={`items.${index}.specifications`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs">Notes / Specs for this item</FormLabel>
                                <FormControl>
                                  <Input className="bg-white h-9 text-sm" placeholder="Optional" {...field} value={field.value || ''} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Comments to Buyer</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Include any other terms, conditions, or information..." 
                          className="h-24 resize-none"
                          {...field} 
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-4">
                  <Button variant="outline" type="button" onClick={() => setIsQuoting(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createQuotation.isPending}>
                    {createQuotation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Submit Quotation
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </PortalLayout>
  );
}
