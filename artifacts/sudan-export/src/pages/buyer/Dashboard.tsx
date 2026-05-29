import { useGetBuyerStats, useGetRecentActivity } from "@workspace/api-client-react";
import PortalLayout from "@/components/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useTranslation } from "react-i18next";

export default function BuyerDashboard() {
  const { data: stats, isLoading: statsLoading } = useGetBuyerStats();
  const { data: activities, isLoading: activitiesLoading } = useGetRecentActivity();
  const { t } = useTranslation();

  if (statsLoading || activitiesLoading) {
    return (
      <PortalLayout role="buyer" title={t("buyer.dashboard.title")}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout role="buyer" title={t("buyer.dashboard.title")}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-none shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{t("buyer.dashboard.openRfqs")}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats?.openRfqs || 0}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
              <Send className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{t("buyer.dashboard.pendingQuotations")}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats?.pendingQuotations || 0}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{t("buyer.dashboard.awardedDeals")}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats?.awardedRfqs || 0}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{t("buyer.dashboard.totalRfqs")}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats?.totalRfqs || 0}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="border-none shadow-sm">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="text-lg font-bold">{t("buyer.dashboard.recentActivity")}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {activities && activities.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {activities.map((activity) => (
                    <div key={activity.id} className="p-4 flex items-start gap-4">
                      <div className="mt-1 p-2 bg-gray-50 rounded-full text-gray-400">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <p>{t("buyer.dashboard.noActivity")}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border-none shadow-sm bg-primary text-primary-foreground">
            <CardContent className="p-6">
              <h3 className="font-bold text-xl mb-2">{t("buyer.dashboard.cta.title")}</h3>
              <p className="text-primary-foreground/80 text-sm mb-6">
                {t("buyer.dashboard.cta.subtitle")}
              </p>
              <a
                href="/buyer/rfqs/new"
                className="inline-block bg-white text-primary px-4 py-2 rounded-md font-medium text-sm hover:bg-gray-50 transition-colors"
              >
                {t("buyer.dashboard.cta.btn")}
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </PortalLayout>
  );
}
