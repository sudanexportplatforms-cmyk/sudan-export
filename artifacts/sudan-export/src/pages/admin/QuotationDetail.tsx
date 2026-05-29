import { useParams, Link } from "wouter";
import {
  useGetQuotation,
  useUpdateQuotationStatus,
  getGetQuotationQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import PortalLayout from "@/components/layout/PortalLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle,
  XCircle,
  Star,
  DollarSign,
  Truck,
  FileText,
  CreditCard,
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  submitted: "bg-blue-100 text-blue-700",
  shortlisted: "bg-purple-100 text-purple-700",
  awarded: "bg-[#C9A24A]/20 text-[#96762B]",
  rejected: "bg-red-100 text-red-700",
};

export default function AdminQuotationDetail() {
  const { t } = useTranslation();
  const { quotationId } = useParams<{ quotationId: string }>();
  const id = parseInt(quotationId, 10);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: quotation, isLoading } = useGetQuotation(id, {
    query: { enabled: !isNaN(id), queryKey: getGetQuotationQueryKey(id) },
  });

  const updateStatus = useUpdateQuotationStatus();

  const handleStatusChange = (status: "awarded" | "shortlisted" | "rejected") => {
    updateStatus.mutate({ quotationId: id, data: { status } }, {
      onSuccess: () => {
        toast({ title: t(`admin.quotationDetail.${status}`) });
        queryClient.invalidateQueries({ queryKey: getGetQuotationQueryKey(id) });
      },
      onError: () => {
        toast({ title: t("common.actionFailed"), description: t("admin.quotationDetail.actionFailedDesc"), variant: "destructive" });
      },
    });
  };

  return (
    <PortalLayout role="admin" title={t("admin.quotationDetail.title")}>
      <div className="mb-6">
        <Link href="/admin/quotations">
          <Button variant="ghost" size="sm" className="gap-2 text-gray-600 hover:text-gray-900 ltr:-ml-2 rtl:-mr-2">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t("admin.quotationDetail.backBtn")}
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : !quotation ? (
        <Card className="border-none shadow-sm">
          <CardContent className="text-center py-16">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{t("admin.quotationDetail.notFound")}</h3>
            <p className="text-gray-500 text-sm">{t("admin.quotationDetail.notFoundDesc")}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-2xl font-bold text-gray-900">{t("admin.quotationDetail.heading")} #{quotation.id}</h1>
                    <Badge className={`capitalize text-xs font-medium px-2.5 py-0.5 rounded-full border-0 ${statusColors[quotation.status] ?? "bg-gray-100 text-gray-700"}`}>
                      {t(`quotationStatus.${quotation.status}`, { defaultValue: quotation.status })}
                    </Badge>
                  </div>
                  <p className="text-gray-500 text-sm">
                    {t("admin.quotationDetail.rfqLabel")}: {quotation.rfqTitle || `#${quotation.rfqId}`}
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {(quotation.status === "submitted" || quotation.status === "shortlisted") && (
                    <>
                      {quotation.status === "submitted" && (
                        <Button size="sm" variant="outline" className="gap-1.5 border-purple-200 text-purple-700 hover:bg-purple-50"
                          onClick={() => handleStatusChange("shortlisted")} disabled={updateStatus.isPending}>
                          <Star className="h-3.5 w-3.5" /> {t("common.shortlist")}
                        </Button>
                      )}
                      <Button size="sm" className="gap-1.5 bg-[#C9A24A] hover:bg-[#b08a3a] text-white border-0"
                        onClick={() => handleStatusChange("awarded")} disabled={updateStatus.isPending}>
                        <CheckCircle className="h-3.5 w-3.5" /> {t("common.award")}
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1.5 border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => handleStatusChange("rejected")} disabled={updateStatus.isPending}>
                        <XCircle className="h-3.5 w-3.5" /> {t("common.reject")}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  {t("admin.quotationDetail.supplier")}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">{t("admin.quotationDetail.company")}</span>
                  <span className="font-medium text-gray-900">{quotation.supplierCompanyName || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t("admin.quotationDetail.contact")}</span>
                  <span className="font-medium text-gray-900">{quotation.supplierName || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t("admin.quotationDetail.submitted")}</span>
                  <span className="text-gray-700">{format(new Date(quotation.createdAt), "MMM d, yyyy")}</span>
                </div>
                {quotation.validUntil && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t("admin.quotationDetail.validUntil")}</span>
                    <span className="text-gray-700 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {format(new Date(quotation.validUntil), "MMM d, yyyy")}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  {t("admin.quotationDetail.commercialTerms")}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">{t("admin.quotationDetail.totalAmount")}</span>
                  <span className="font-bold text-gray-900 text-base">
                    {quotation.currency} {quotation.totalAmount?.toLocaleString() ?? "—"}
                  </span>
                </div>
                {quotation.deliveryTime && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 flex items-center gap-1"><Truck className="h-3.5 w-3.5" /> {t("admin.quotationDetail.delivery")}</span>
                    <span className="text-gray-700">{quotation.deliveryTime}</span>
                  </div>
                )}
                {quotation.paymentTerms && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 flex items-center gap-1"><CreditCard className="h-3.5 w-3.5" /> {t("admin.quotationDetail.payment")}</span>
                    <span className="text-gray-700">{quotation.paymentTerms}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {quotation.items && quotation.items.length > 0 && (
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-gray-900">{t("admin.quotationDetail.lineItems")}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left rtl:text-right">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-3 font-medium">{t("admin.quotationDetail.product")}</th>
                        <th className="px-6 py-3 font-medium">{t("admin.quotationDetail.qty")}</th>
                        <th className="px-6 py-3 font-medium">{t("admin.quotationDetail.unit")}</th>
                        <th className="px-6 py-3 font-medium">{t("admin.quotationDetail.unitPrice")}</th>
                        <th className="px-6 py-3 font-medium ltr:text-right rtl:text-left">{t("admin.quotationDetail.total")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {quotation.items.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50/50">
                          <td className="px-6 py-4 font-medium text-gray-900">{item.productName}</td>
                          <td className="px-6 py-4 text-gray-600">{item.quantity.toLocaleString()}</td>
                          <td className="px-6 py-4 text-gray-600">{item.unit}</td>
                          <td className="px-6 py-4 text-gray-600">{item.currency} {item.unitPrice.toLocaleString()}</td>
                          <td className="px-6 py-4 ltr:text-right rtl:text-left font-medium text-gray-900">
                            {item.currency} {item.totalPrice.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {quotation.notes && (
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  {t("admin.quotationDetail.notes")}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{quotation.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </PortalLayout>
  );
}
