import { useState } from "react";
import { Link } from "wouter";
import { useListRfqs, useUpdateRfqStatus, getListRfqsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import PortalLayout from "@/components/layout/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  submitted: "bg-blue-100 text-blue-700",
  open: "bg-green-100 text-green-700",
  quoting: "bg-amber-100 text-amber-700",
  shortlisted: "bg-purple-100 text-purple-700",
  awarded: "bg-yellow-100 text-yellow-800",
  closed: "bg-gray-200 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminRfqs() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const { data: rfqs = [], isLoading } = useListRfqs();
  const updateStatus = useUpdateRfqStatus();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const filtered = rfqs.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.referenceNumber.toLowerCase().includes(search.toLowerCase()),
  );

  const handleClose = (rfqId: number) => {
    updateStatus.mutate({ rfqId, data: { status: "closed" } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListRfqsQueryKey() });
        toast({ title: t("admin.rfqs.closed") });
      },
    });
  };

  return (
    <PortalLayout role="admin" title={t("admin.rfqs.title")}>
      <div className="mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={t("admin.rfqs.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ltr:pl-9 rtl:pr-9 bg-white"
            data-testid="input-search-rfqs"
          />
        </div>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 px-4">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("admin.rfqs.noRfqs")}</h3>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 font-medium">{t("admin.rfqs.cols.ref")}</th>
                    <th className="px-6 py-4 font-medium">{t("admin.rfqs.cols.title")}</th>
                    <th className="px-6 py-4 font-medium">{t("admin.rfqs.cols.buyer")}</th>
                    <th className="px-6 py-4 font-medium">{t("admin.rfqs.cols.status")}</th>
                    <th className="px-6 py-4 font-medium text-center">{t("admin.rfqs.cols.quotes")}</th>
                    <th className="px-6 py-4 font-medium">{t("admin.rfqs.cols.created")}</th>
                    <th className="px-6 py-4 font-medium ltr:text-right rtl:text-left">{t("admin.rfqs.cols.actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filtered.map((rfq) => (
                    <tr
                      key={rfq.id}
                      data-testid={`row-rfq-${rfq.id}`}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">{rfq.referenceNumber}</td>
                      <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate">{rfq.title}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {(rfq as any).buyerCompanyName || (rfq as any).buyerName || "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[rfq.status] || "bg-gray-100 text-gray-700"}`}>
                          {t(`rfqStatus.${rfq.status}`, { defaultValue: rfq.status })}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-medium text-primary">{(rfq as any).quotationCount ?? 0}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {new Date(rfq.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 ltr:text-right rtl:text-left">
                        <div className="flex gap-2 ltr:justify-end rtl:justify-start">
                          {rfq.status !== "closed" && rfq.status !== "cancelled" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-gray-600"
                              data-testid={`button-close-rfq-${rfq.id}`}
                              disabled={updateStatus.isPending}
                              onClick={() => handleClose(rfq.id)}
                            >
                              {t("admin.rfqs.close")}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </PortalLayout>
  );
}
