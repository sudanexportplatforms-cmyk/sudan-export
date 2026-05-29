import PortalLayout from "@/components/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon, Bell, Shield, Globe2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AdminSettings() {
  const { t } = useTranslation();
  return (
    <PortalLayout role="admin" title={t("admin.settings.title")}>
      <div className="mb-6">
        <p className="text-gray-500 text-sm">{t("admin.settings.subtitle")}</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <Card className="border-none shadow-sm">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-primary" />
              {t("admin.settings.platformIdentity")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-1.5">
              <Label>{t("admin.settings.platformName")}</Label>
              <Input defaultValue="Sudan Export Platform" disabled className="bg-gray-50" />
            </div>
            <div className="space-y-1.5">
              <Label>{t("admin.settings.supportEmail")}</Label>
              <Input defaultValue="support@sudanexport.com" disabled className="bg-gray-50" />
            </div>
            <p className="text-xs text-gray-400">{t("admin.settings.envVarsNote")}</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              {t("admin.settings.emailNotifications")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {[
              { title: t("admin.settings.notif.rfqToSuppliers"), desc: t("admin.settings.notif.rfqToSuppliersDesc") },
              { title: t("admin.settings.notif.quotationAwarded"), desc: t("admin.settings.notif.quotationAwardedDesc") },
              { title: t("admin.settings.notif.companyVerification"), desc: t("admin.settings.notif.companyVerificationDesc") },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
                <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  {t("admin.settings.enabled")}
                </div>
              </div>
            ))}
            <p className="text-xs text-gray-400 pt-2 border-t border-gray-100">
              {t("admin.settings.resendNote")} <code className="bg-gray-100 px-1 rounded">RESEND_API_KEY</code>.
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              {t("admin.settings.security")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{t("admin.settings.authProvider")}</p>
                <p className="text-xs text-gray-500">{t("admin.settings.managedByClerk")}</p>
              </div>
              <div className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">Clerk</div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{t("admin.settings.sessionEncryption")}</p>
                <p className="text-xs text-gray-500">SESSION_SECRET env variable</p>
              </div>
              <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">{t("admin.settings.configured")}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm border-dashed border-2 border-gray-200">
          <CardContent className="p-6 text-center">
            <SettingsIcon className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <h3 className="font-medium text-gray-700 mb-1">{t("admin.settings.moreComingSoon")}</h3>
            <p className="text-xs text-gray-500">{t("admin.settings.moreComingSoonDesc")}</p>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}
