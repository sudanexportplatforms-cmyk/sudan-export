import { useState } from "react";
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

const rfqSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  destinationCountry: z.string().optional(),
  deliveryPort: z.string().optional(),
  paymentTerms: z.string().optional(),
  incoterms: z.string().optional(),
  validUntil: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(z.object({
    productId: z.coerce.number().min(1, "Please select a product"),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
    unit: z.string().min(1, "Unit is required"),
    targetPrice: z.coerce.number().optional(),
    specifications: z.string().optional()
  })).min(1, "At least one item is required")
});

type FormValues = z.infer<typeof rfqSchema>;

export default function NewRfq() {
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

  const { fields, append, remove } = useFieldArray({
    name: "items",
    control: form.control
  });

  const onSubmit = (data: FormValues) => {
    createRfq.mutate({ data }, {
      onSuccess: (newRfq) => {
        queryClient.invalidateQueries({ queryKey: getListRfqsQueryKey() });
        toast({
          title: "RFQ Created",
          description: "Your Request for Quotation has been published.",
        });
        setLocation(`/buyer/rfqs/${newRfq.id}`);
      },
      onError: (err) => {
        toast({
          title: "Failed to create RFQ",
          description: "Please check your inputs and try again.",
          variant: "destructive"
        });
      }
    });
  };

  return (
    <PortalLayout role="buyer" title="Create RFQ">
      <div className="mb-6">
        <Button variant="ghost" asChild className="pl-0 hover:bg-transparent hover:text-primary">
          <Link href="/buyer/rfqs">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to RFQs
          </Link>
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>Provide the basic details for your request.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RFQ Title <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 500 MT of Premium White Sesame Seeds" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="destinationCountry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination Country</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., United Arab Emirates" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="deliveryPort"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Port</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Jebel Ali" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="incoterms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Incoterms</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select terms" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="FOB">FOB (Free on Board)</SelectItem>
                          <SelectItem value="CIF">CIF (Cost, Insurance, Freight)</SelectItem>
                          <SelectItem value="EXW">EXW (Ex Works)</SelectItem>
                          <SelectItem value="CFR">CFR (Cost and Freight)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paymentTerms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Terms</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select terms" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="LC_AT_SIGHT">L/C at sight</SelectItem>
                          <SelectItem value="TT_ADVANCE">T/T Advance</SelectItem>
                          <SelectItem value="CAD">Cash Against Documents (CAD)</SelectItem>
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
                      <FormLabel>Valid Until</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any specific packaging requirements, certifications needed, etc." 
                        className="h-24"
                        {...field} 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Requested Products</CardTitle>
                <CardDescription>Add the commodities you want to source.</CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => append({ productId: 0, quantity: 1, unit: "MT", specifications: "" })}>
                <Plus className="w-4 h-4 mr-2" /> Add Item
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {fields.map((field, index) => (
                <div key={field.id} className="p-4 bg-gray-50 border border-gray-100 rounded-lg relative">
                  {fields.length > 1 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500 hover:bg-red-50"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-2">
                    <div className="md:col-span-5">
                      <FormField
                        control={form.control}
                        name={`items.${index}.productId`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product <span className="text-red-500">*</span></FormLabel>
                            <Select onValueChange={(val) => field.onChange(parseInt(val, 10))} value={field.value ? field.value.toString() : ""}>
                              <FormControl>
                                <SelectTrigger className="bg-white">
                                  <SelectValue placeholder="Select product" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {products.map(p => (
                                  <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="md:col-span-3">
                      <FormField
                        control={form.control}
                        name={`items.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input type="number" min="0.1" step="any" className="bg-white" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <FormField
                        control={form.control}
                        name={`items.${index}.unit`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unit <span className="text-red-500">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="MT">MT</SelectItem>
                                <SelectItem value="KG">KG</SelectItem>
                                <SelectItem value="Tons">Tons</SelectItem>
                                <SelectItem value="Containers">Containers</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <FormField
                        control={form.control}
                        name={`items.${index}.targetPrice`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Target Price (USD)</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" step="any" className="bg-white" placeholder="Optional" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <FormField
                      control={form.control}
                      name={`items.${index}.specifications`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Technical Specifications</FormLabel>
                          <FormControl>
                            <Textarea 
                              className="bg-white h-20" 
                              placeholder="e.g., Purity: 99%, Moisture: max 6%, Admixture: max 1%" 
                              {...field} 
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
              <Link href="/buyer/rfqs">Cancel</Link>
            </Button>
            <Button type="submit" disabled={createRfq.isPending}>
              {createRfq.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Publish RFQ
            </Button>
          </div>
        </form>
      </Form>
    </PortalLayout>
  );
}
