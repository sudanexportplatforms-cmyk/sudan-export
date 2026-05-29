import { useState } from "react";
import PortalLayout from "@/components/layout/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Mail, RefreshCw, CheckCircle2, XCircle, Clock, SkipForward } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

interface EmailLog {
  id: number;
  recipientEmail: string;
  eventType: string;
  entityType: string;
  entityId: number;
  status: "pending" | "sent" | "failed" | "skipped";
  errorMessage: string | null;
  sentAt: string | null;
  createdAt: string;
}

interface EmailStats {
  total: number;
  byStatus: Record<string, number>;
  byEvent: Record<string, number>;
}

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";

async function fetchEmailLogs(params: { status?: string; eventType?: string } = {}): Promise<EmailLog[]> {
  const qs = new URLSearchParams();
  if (params.status && params.status !== "all") qs.set("status", params.status);
  if (params.eventType && params.eventType !== "all") qs.set("eventType", params.eventType);
  const res = await fetch(`${BASE}/api/email-logs?${qs}`);
  if (!res.ok) throw new Error("Failed to fetch email logs");
  return res.json();
}

async function fetchEmailStats(): Promise<EmailStats> {
  const res = await fetch(`${BASE}/api/email-logs/stats`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

async function retryEmailLog(logId: number): Promise<EmailLog> {
  const res = await fetch(`${BASE}/api/email-logs/${logId}/retry`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to retry");
  return res.json();
}

const statusConfig: Record<string, { className: string; Icon: React.ComponentType<{ className?: string }> }> = {
  sent:    { className: "bg-green-100 text-green-700",  Icon: CheckCircle2 },
  pending: { className: "bg-amber-100 text-amber-700",  Icon: Clock },
  failed:  { className: "bg-red-100 text-red-700",      Icon: XCircle },
  skipped: { className: "bg-gray-100 text-gray-700",    Icon: SkipForward },
};

const eventKeys = ["rfq_opened","quotation_submitted","quotation_awarded","rfq_closed","rfq_cancelled","company_approved","company_rejected"] as const;

export default function AdminEmailLogs() {
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState("all");
  const [eventFilter, setEventFilter]   = useState("all");
  const [search, setSearch]             = useState("");
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: logs = [], isLoading, refetch } = useQuery({
    queryKey: ["email-logs", statusFilter, eventFilter],
    queryFn: () => fetchEmailLogs({ status: statusFilter, eventType: eventFilter }),
    refetchInterval: 15_000,
  });

  const { data: stats } = useQuery({
    queryKey: ["email-logs-stats"],
    queryFn: fetchEmailStats,
    refetchInterval: 15_000,
  });

  const retry = useMutation({
    mutationFn: retryEmailLog,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["email-logs"] });
      qc.invalidateQueries({ queryKey: ["email-logs-stats"] });
      toast({ title: t("admin.emailLogs.queued") });
    },
  });

  const filtered = logs.filter(
    (l) =>
      l.recipientEmail.toLowerCase().includes(search.toLowerCase()) ||
      l.eventType.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <PortalLayout role="admin" title={t("admin.emailLogs.title")}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {(["sent", "pending", "failed", "skipped"] as const).map((s) => {
          const cfg = statusConfig[s];
          const Icon = cfg.Icon;
          return (
            <Card key={s} className="border-none shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${cfg.className}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats?.byStatus?.[s] ?? 0}</p>
                  <p className="text-xs text-gray-500 capitalize">{t(`emailStatus.${s}`, { defaultValue: s })}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative w-full sm:w-72">
          <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={t("admin.emailLogs.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ltr:pl-9 rtl:pr-9 bg-white"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 bg-white">
            <SelectValue placeholder={t("admin.emailLogs.statusFilter")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("admin.emailLogs.allStatuses")}</SelectItem>
            {(["sent","pending","failed","skipped"] as const).map(s => (
              <SelectItem key={s} value={s}>{t(`emailStatus.${s}`, { defaultValue: s })}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={eventFilter} onValueChange={setEventFilter}>
          <SelectTrigger className="w-52 bg-white">
            <SelectValue placeholder={t("admin.emailLogs.eventFilter")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("admin.emailLogs.allEvents")}</SelectItem>
            {eventKeys.map((k) => (
              <SelectItem key={k} value={k}>{t(`emailEvent.${k}`, { defaultValue: k })}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" className="bg-white" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 text-gray-600" />
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Mail className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("admin.emailLogs.noLogs")}</h3>
              <p className="text-gray-500 text-sm">{t("admin.emailLogs.noLogsDesc")}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-5 py-4 font-medium">{t("admin.emailLogs.cols.recipient")}</th>
                    <th className="px-5 py-4 font-medium">{t("admin.emailLogs.cols.event")}</th>
                    <th className="px-5 py-4 font-medium">{t("admin.emailLogs.cols.entity")}</th>
                    <th className="px-5 py-4 font-medium">{t("admin.emailLogs.cols.status")}</th>
                    <th className="px-5 py-4 font-medium">{t("admin.emailLogs.cols.sentAt")}</th>
                    <th className="px-5 py-4 font-medium">{t("admin.emailLogs.cols.created")}</th>
                    <th className="px-5 py-4 font-medium ltr:text-right rtl:text-left">{t("admin.emailLogs.cols.actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filtered.map((log) => {
                    const cfg = statusConfig[log.status] ?? statusConfig.pending;
                    const Icon = cfg.Icon;
                    return (
                      <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-3 text-gray-900 font-medium max-w-[180px] truncate" title={log.recipientEmail}>
                          {log.recipientEmail}
                        </td>
                        <td className="px-5 py-3">
                          <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            {t(`emailEvent.${log.eventType}`, { defaultValue: log.eventType })}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-gray-500 text-xs capitalize">
                          {log.entityType} #{log.entityId}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}>
                            <Icon className="w-3 h-3" />
                            {t(`emailStatus.${log.status}`, { defaultValue: log.status })}
                          </span>
                          {log.errorMessage && (
                            <p className="text-xs text-red-500 mt-1 max-w-[160px] truncate" title={log.errorMessage}>
                              {log.errorMessage}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-3 text-gray-500 text-xs">
                          {log.sentAt ? new Date(log.sentAt).toLocaleString() : "—"}
                        </td>
                        <td className="px-5 py-3 text-gray-500 text-xs">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="px-5 py-3 ltr:text-right rtl:text-left">
                          {(log.status === "failed" || log.status === "skipped") && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-primary hover:bg-primary/5 text-xs"
                              disabled={retry.isPending}
                              onClick={() => retry.mutate(log.id)}
                            >
                              <RefreshCw className="w-3 h-3 ltr:mr-1 rtl:ml-1" /> {t("admin.emailLogs.retry")}
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </PortalLayout>
  );
}
