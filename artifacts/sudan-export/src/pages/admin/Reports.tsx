import { useGetAdminStats } from "@workspace/api-client-react";
import PortalLayout from "@/components/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, FileText, CheckCircle2, ShieldAlert, TrendingUp, BarChart3 } from "lucide-react";
import { useTranslation } from "react-i18next";

function StatBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-gray-700">{label}</span>
        <span className="font-semibold text-gray-900">{value.toLocaleString()}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function AdminReports() {
  const { t } = useTranslation();
  const { data: stats, isLoading } = useGetAdminStats();

  if (isLoading) {
    return (
      <PortalLayout role="admin" title={t("admin.reports.title")}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </PortalLayout>
    );
  }

  const totalUsers = (stats?.totalBuyers ?? 0) + (stats?.totalSuppliers ?? 0);
  const awardRate = (stats?.totalRfqs ?? 0) > 0
    ? Math.round(((stats?.awardedDeals ?? 0) / (stats?.totalRfqs ?? 1)) * 100) : 0;

  const statCards = [
    { labelKey: "admin.reports.totalUsers", value: totalUsers, icon: Users, color: "bg-blue-50 text-blue-600" },
    { labelKey: "admin.reports.totalBuyers", value: stats?.totalBuyers ?? 0, icon: Users, color: "bg-green-50 text-green-600" },
    { labelKey: "admin.reports.totalSuppliers", value: stats?.totalSuppliers ?? 0, icon: Building2, color: "bg-indigo-50 text-indigo-600" },
    { labelKey: "admin.reports.totalRfqs", value: stats?.totalRfqs ?? 0, icon: FileText, color: "bg-amber-50 text-amber-600" },
    { labelKey: "admin.reports.awardedDeals", value: stats?.awardedDeals ?? 0, icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600" },
    { labelKey: "admin.reports.pendingVerifications", value: stats?.pendingVerifications ?? 0, icon: ShieldAlert, color: "bg-red-50 text-red-600" },
  ];

  return (
    <PortalLayout role="admin" title={t("admin.reports.title")}>
      <div className="mb-6">
        <p className="text-gray-500 text-sm">{t("admin.reports.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.labelKey} className="border-none shadow-sm">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`p-2.5 rounded-lg ${item.color}`}><Icon className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t(item.labelKey)}</p>
                  <h3 className="text-2xl font-bold text-gray-900">{item.value.toLocaleString()}</h3>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="border-none shadow-sm">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              {t("admin.reports.userBreakdown")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <StatBar label={t("admin.reports.buyers")} value={stats?.totalBuyers ?? 0} max={totalUsers} color="bg-green-500" />
            <StatBar label={t("admin.reports.suppliers")} value={stats?.totalSuppliers ?? 0} max={totalUsers} color="bg-indigo-500" />
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              {t("admin.reports.rfqOutcomes")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <StatBar label={t("admin.reports.awardedDeals")} value={stats?.awardedDeals ?? 0} max={stats?.totalRfqs ?? 1} color="bg-emerald-500" />
            <StatBar label={t("admin.reports.pendingVerifications")} value={stats?.pendingVerifications ?? 0} max={totalUsers || 1} color="bg-amber-500" />
            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-center text-gray-600">
              {t("admin.reports.awardRate")}: <span className="font-bold text-primary">{awardRate}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm border-dashed border-2 border-gray-200">
        <CardContent className="p-8 text-center">
          <BarChart3 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-700 mb-1">{t("admin.reports.advancedTitle")}</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">{t("admin.reports.advancedDesc")}</p>
        </CardContent>
      </Card>
    </PortalLayout>
  );
}
