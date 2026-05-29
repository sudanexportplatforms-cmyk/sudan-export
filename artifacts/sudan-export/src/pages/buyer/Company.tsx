import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useGetMyProfile, useCreateCompany, useUpdateCompany, getGetMyProfileQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import PortalLayout from "@/components/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
type CompanyInputType = "supplier" | "buyer";

const companySchema = z.object({
  name: z.string().min(2, "Company name is required"),
  registrationNumber: z.string().optional(),
  country: z.string().min(2, "Country is required"),
  city: z.string().optional(),
  address: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof companySchema>;

export default function BuyerCompany() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: profile, isLoading: isProfileLoading } = useGetMyProfile();
  
  const createCompany = useCreateCompany();
  const updateCompany = useUpdateCompany();
  
  const hasCompany = !!profile?.companyId;

  const form = useForm<FormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      country: "",
      city: "",
      address: "",
      registrationNumber: "",
      website: "",
      phone: "",
      email: "",
      description: "",
    }
  });

  // Note: In a real app we'd fetch the actual company details. 
  // For now we'll just populate what we know from the profile if it exists.
  useEffect(() => {
    if (profile?.companyName) {
      form.setValue("name", profile.companyName);
    }
  }, [profile, form]);

  const onSubmit = (data: FormValues) => {
    if (hasCompany && profile.companyId) {
      updateCompany.mutate({ 
        companyId: profile.companyId,
        data 
      }, {
        onSuccess: () => {
          toast({ title: "Company profile updated" });
          queryClient.invalidateQueries({ queryKey: getGetMyProfileQueryKey() });
        }
      });
    } else {
      createCompany.mutate({ 
        data: { ...data, type: "buyer" as CompanyInputType } 
      }, {
        onSuccess: () => {
          toast({ title: "Company profile created" });
          queryClient.invalidateQueries({ queryKey: getGetMyProfileQueryKey() });
        }
      });
    }
  };

  if (isProfileLoading) {
    return (
      <PortalLayout role="buyer" title="Company Profile">
        <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>
      </PortalLayout>
    );
  }

  const isPending = createCompany.isPending || updateCompany.isPending;

  return (
    <PortalLayout role="buyer" title="Company Profile">
      <Card className="border-none shadow-sm max-w-3xl">
        <CardHeader>
          <CardTitle>{hasCompany ? "Edit Company Profile" : "Create Company Profile"}</CardTitle>
          <CardDescription>
            {hasCompany 
              ? "Update your company information visible to suppliers." 
              : "Create your company profile to start trading on Sudan Export."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Enter company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="registrationNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registration / Tax Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Optional" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., United Arab Emirates" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Dubai" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Street address" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="contact@company.com" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 234 567 8900" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input type="url" placeholder="https://www.company.com" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell suppliers about your business, import volume, and history." 
                        className="h-32 resize-none"
                        {...field} 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {hasCompany ? "Save Changes" : "Create Profile"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </PortalLayout>
  );
}
