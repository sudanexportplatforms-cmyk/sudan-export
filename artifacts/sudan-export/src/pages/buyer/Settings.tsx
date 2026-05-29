import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useGetMyProfile, useUpsertMyProfile, getGetMyProfileQueryKey } from "@workspace/api-client-react";
import type { UserProfileInputRole } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import PortalLayout from "@/components/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const profileSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  country: z.string().optional(),
});

type FormValues = z.infer<typeof profileSchema>;

export default function BuyerSettings() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useGetMyProfile();
  const upsertProfile = useUpsertMyProfile();

  const form = useForm<FormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { firstName: "", lastName: "", phone: "", country: "" }
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        phone: profile.phone || "",
        country: profile.country || "",
      });
    }
  }, [profile, form]);

  const onSubmit = (data: FormValues) => {
    upsertProfile.mutate({ data: { ...data, role: "buyer" as UserProfileInputRole } }, {
      onSuccess: () => {
        toast({ title: t("buyer.settings.saveSuccess") });
        queryClient.invalidateQueries({ queryKey: getGetMyProfileQueryKey() });
      }
    });
  };

  if (isLoading) {
    return (
      <PortalLayout role="buyer" title={t("buyer.settings.title")}>
        <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout role="buyer" title={t("buyer.settings.title")}>
      <Card className="border-none shadow-sm max-w-2xl mb-8">
        <CardHeader>
          <CardTitle>{t("buyer.settings.personalInfo")}</CardTitle>
          <CardDescription>{t("buyer.settings.personalInfoDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="firstName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("buyer.settings.firstName")}</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="lastName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("buyer.settings.lastName")}</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("buyer.settings.phone")}</FormLabel>
                    <FormControl><Input {...field} value={field.value || ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="country" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("buyer.settings.country")}</FormLabel>
                    <FormControl><Input {...field} value={field.value || ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={upsertProfile.isPending}>
                  {upsertProfile.isPending && <Loader2 className="w-4 h-4 ltr:mr-2 rtl:ml-2 animate-spin" />}
                  {t("common.saveChanges")}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm max-w-2xl border-red-100">
        <CardHeader>
          <CardTitle className="text-red-600">{t("buyer.settings.dangerZone")}</CardTitle>
          <CardDescription>{t("buyer.settings.dangerZoneDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between border-t border-gray-100 pt-4">
            <div>
              <p className="font-medium text-gray-900">{t("buyer.settings.deleteAccount")}</p>
              <p className="text-sm text-gray-500">{t("buyer.settings.deleteAccountDesc")}</p>
            </div>
            <Button variant="destructive">{t("buyer.settings.deleteAccount")}</Button>
          </div>
        </CardContent>
      </Card>
    </PortalLayout>
  );
}
