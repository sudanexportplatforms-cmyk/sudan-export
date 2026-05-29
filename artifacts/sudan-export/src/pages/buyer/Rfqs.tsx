import { useState } from "react";
import { Link } from "wouter";
import { useListRfqs } from "@workspace/api-client-react";
import PortalLayout from "@/components/layout/PortalLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, FileText, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-800",
  submitted: "bg-blue-100 text-blue-800",
  open: "bg-green-100 text-green-800",
  quoting: "bg-amber-100 text-amber-800",
  shortlisted: "bg-purple-100 text-purple-800",
  awarded: "bg-gold/20 text-gold-900 border-gold/30",
  closed: "bg-gray-200 text-gray-700",
  cancelled: "bg-red-100 text-red-800",
};

export default function BuyerRfqs() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const { data: rfqs = [], isLoading } = useListRfqs();

  const filteredRfqs = rfqs.filter(
    rfq => 
      rfq.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      rfq.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PortalLayout role="buyer" title={t("buyer.rfqs.title")}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex w-full sm:w-auto items-center gap-2">
          <div className="relative w-full sm:w-80">
            <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder={t("buyer.rfqs.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ltr:pl-9 rtl:pr-9 bg-white"
            />
          </div>
          <Button variant="outline" size="icon" className="shrink-0 bg-white">
            <Filter className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/buyer/rfqs/new">
            <Plus className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
            {t("buyer.rfqs.createBtn")}
          </Link>
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : filteredRfqs.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("buyer.rfqs.noRfqs")}</h3>
              <p className="text-gray-500 max-w-sm mx-auto mb-6">
                {t("buyer.rfqs.noRfqsDesc")}
              </p>
              <Button asChild>
                <Link href="/buyer/rfqs/new">{t("buyer.rfqs.createFirst")}</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 font-medium">{t("buyer.rfqs.cols.ref")}</th>
                    <th className="px-6 py-4 font-medium">{t("buyer.rfqs.cols.title")}</th>
                    <th className="px-6 py-4 font-medium">{t("buyer.rfqs.cols.status")}</th>
                    <th className="px-6 py-4 font-medium text-center">{t("buyer.rfqs.cols.quotes")}</th>
                    <th className="px-6 py-4 font-medium">{t("buyer.rfqs.cols.deadline")}</th>
                    <th className="px-6 py-4 font-medium ltr:text-right rtl:text-left">{t("buyer.rfqs.cols.action")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredRfqs.map((rfq) => (
                    <tr key={rfq.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">
                        {rfq.referenceNumber}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {rfq.title}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[rfq.status] || 'bg-gray-100 text-gray-800'}`}>
                          {t(`rfqStatus.${rfq.status}`, { defaultValue: rfq.status })}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${rfq.quotationCount > 0 ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'}`}>
                          {rfq.quotationCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {rfq.validUntil ? format(new Date(rfq.validUntil), 'MMM d, yyyy') : 'N/A'}
                      </td>
                      <td className="px-6 py-4 ltr:text-right rtl:text-left">
                        <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary hover:bg-primary/5">
                          <Link href={`/buyer/rfqs/${rfq.id}`}>{t("common.viewDetails")}</Link>
                        </Button>
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
