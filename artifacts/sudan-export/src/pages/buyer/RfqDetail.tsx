import { useParams, Link } from "wouter";
import { 
  useGetRfq, 
  useListRfqQuotations, 
  useUpdateQuotationStatus, 
  useUpdateRfqStatus,
  getGetRfqQueryKey,
  getListRfqQuotationsQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import PortalLayout from "@/components/layout/PortalLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Building2, Calendar, FileText, CheckCircle, XCircle, AlertCircle, Ship, MapPin, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import type { QuotationDetail } from "@workspace/api-client-react";
import { useTranslation } from "react-i18next";

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-800",
  submitted: "bg-blue-100 text-blue-800",
  open: "bg-green-100 text-green-800",
  quoting: "bg-amber-100 text-amber-800",
  shortlisted: "bg-purple-100 text-purple-800",
  awarded: "bg-[#C9A24A]/20 text-[#96762B] border-[#C9A24A]/30",
  closed: "bg-gray-200 text-gray-700",
  cancelled: "bg-red-100 text-red-800",
};

export default function RfqDetail() {
  const { t } = useTranslation();
  const { rfqId } = useParams<{ rfqId: string }>();
  const id = parseInt(rfqId, 10);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: rfq, isLoading: rfqLoading } = useGetRfq(id, { 
    query: { enabled: !isNaN(id), queryKey: getGetRfqQueryKey(id) } 
  });
  
  const { data: quotations = [], isLoading: quotesLoading } = useListRfqQuotations(id, {
    query: { enabled: !isNaN(id), queryKey: getListRfqQuotationsQueryKey(id) }
  });

  const updateQuoteStatus = useUpdateQuotationStatus();
  const updateRfq = useUpdateRfqStatus();

  const handleAward = (quoteId: number) => {
    updateQuoteStatus.mutate({ quotationId: quoteId, data: { status: 'awarded' } }, {
      onSuccess: () => {
        toast({ title: "Quotation Awarded", description: "The supplier will be notified." });
        queryClient.invalidateQueries({ queryKey: getListRfqQuotationsQueryKey(id) });
        queryClient.invalidateQueries({ queryKey: getGetRfqQueryKey(id) });
      }
    });
  };

  const handleShortlist = (quoteId: number) => {
    updateQuoteStatus.mutate({ quotationId: quoteId, data: { status: 'shortlisted' } }, {
      onSuccess: () => {
        toast({ title: "Quotation Shortlisted", description: "Added to your shortlist." });
        queryClient.invalidateQueries({ queryKey: getListRfqQuotationsQueryKey(id) });
      }
    });
  };

  const handleReject = (quoteId: number) => {
    updateQuoteStatus.mutate({ quotationId: quoteId, data: { status: 'rejected' } }, {
      onSuccess: () => {
        toast({ title: "Quotation Rejected" });
        queryClient.invalidateQueries({ queryKey: getListRfqQuotationsQueryKey(id) });
      }
    });
  };

  const handleCloseRfq = () => {
    updateRfq.mutate({ rfqId: id, data: { status: 'closed' } }, {
      onSuccess: () => {
        toast({ title: "RFQ Closed" });
        queryClient.invalidateQueries({ queryKey: getGetRfqQueryKey(id) });
      }
    });
  };

  if (rfqLoading) {
    return (
      <PortalLayout role="buyer" title={t("buyer.rfqDetail.title")}>
        <div className="flex justify-center py-20">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </PortalLayout>
    );
  }

  if (!rfq) {
    return (
      <PortalLayout role="buyer" title={t("buyer.rfqDetail.notFound")}>
        <div className="text-center py-20">
          <h2 className="text-xl font-bold">{t("buyer.rfqDetail.notFoundMsg")}</h2>
          <Button asChild className="mt-4">
            <Link href="/buyer/rfqs">{t("buyer.rfqDetail.backBtn")}</Link>
          </Button>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout role="buyer" title={`RFQ: ${rfq.referenceNumber}`}>
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" asChild className="pl-0 hover:bg-transparent hover:text-primary">
          <Link href="/buyer/rfqs">
            <ArrowLeft className="w-4 h-4 ltr:mr-2 rtl:ml-2 rtl:rotate-180" />
            {t("buyer.rfqDetail.backBtn")}
          </Link>
        </Button>
        
        {rfq.status !== 'closed' && rfq.status !== 'cancelled' && rfq.status !== 'awarded' && (
          <Button variant="outline" onClick={handleCloseRfq} disabled={updateRfq.isPending}>
            {t("buyer.rfqDetail.closeBtn")}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-4 border-b border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-2xl">{rfq.title}</CardTitle>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide ${statusColors[rfq.status]}`}>
                      {t(`rfqStatus.${rfq.status}`, { defaultValue: rfq.status })}
                    </span>
                  </div>
                  <CardDescription className="text-sm">{t("buyer.rfqDetail.postedOn")} {format(new Date(rfq.createdAt), 'MMMM d, yyyy')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-1.5"><MapPin className="w-4 h-4"/> {t("buyer.rfqDetail.destination")}</p>
                  <p className="text-gray-900 font-medium">{rfq.destinationCountry || t("buyer.rfqDetail.notSpecified")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-1.5"><Ship className="w-4 h-4"/> {t("buyer.rfqDetail.port")}</p>
                  <p className="text-gray-900 font-medium">{rfq.deliveryPort || t("buyer.rfqDetail.notSpecified")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-1.5"><DollarSign className="w-4 h-4"/> {t("buyer.rfqDetail.incoterms")}</p>
                  <p className="text-gray-900 font-medium">{rfq.incoterms || t("buyer.rfqDetail.notSpecified")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-1.5"><Calendar className="w-4 h-4"/> {t("buyer.rfqDetail.validUntil")}</p>
                  <p className="text-gray-900 font-medium">{rfq.validUntil ? format(new Date(rfq.validUntil), 'MMM d, yyyy') : t("buyer.rfqDetail.noLimit")}</p>
                </div>
              </div>

              {rfq.notes && (
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">{t("buyer.rfqDetail.additionalNotes")}</h3>
                  <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 whitespace-pre-wrap">
                    {rfq.notes}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4">{t("buyer.rfqDetail.requestedItems")}</h3>
                <div className="border border-gray-100 rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-left rtl:text-right">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-4 py-3 font-medium text-gray-500">{t("buyer.rfqDetail.product")}</th>
                        <th className="px-4 py-3 font-medium text-gray-500">{t("buyer.rfqDetail.quantity")}</th>
                        <th className="px-4 py-3 font-medium text-gray-500">{t("buyer.rfqDetail.targetPrice")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {'items' in rfq && (rfq as any).items.map((item: any) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3">
                            <p className="font-medium text-gray-900">{item.productName}</p>
                            {item.specifications && (
                              <p className="text-xs text-gray-500 mt-1">{item.specifications}</p>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">{item.quantity} {item.unit}</td>
                          <td className="px-4 py-3 text-gray-600">
                            {item.targetPrice ? `$${item.targetPrice.toLocaleString()}` : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-sm bg-primary text-primary-foreground">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">{t("buyer.rfqDetail.quotationsReceived")}</h3>
              <p className="text-5xl font-bold mb-4">{quotations.length}</p>
              <p className="text-sm text-primary-foreground/80">{t("buyer.rfqDetail.reviewQuotes")}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-4">{t("buyer.rfqDetail.quotationComparison")}</h2>
      
      {quotesLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : quotations.length === 0 ? (
        <Card className="border-dashed border-2 shadow-none bg-transparent">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="w-10 h-10 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">{t("buyer.rfqDetail.noQuotations")}</h3>
            <p className="text-gray-500 max-w-sm">{t("buyer.rfqDetail.noQuotationsDesc")}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(quotations as QuotationDetail[]).map((quote) => (
            <Card key={quote.id} className={`border flex flex-col ${quote.status === 'awarded' ? 'border-[#C9A24A] shadow-md ring-1 ring-[#C9A24A]/50' : quote.status === 'shortlisted' ? 'border-primary shadow-sm' : 'border-gray-200 shadow-sm'}`}>
              <CardHeader className={`pb-4 ${quote.status === 'awarded' ? 'bg-[#C9A24A]/5' : quote.status === 'shortlisted' ? 'bg-primary/5' : ''}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      {quote.supplierCompanyName || quote.supplierName}
                    </CardTitle>
                    <CardDescription className="mt-1 text-xs">{t("buyer.rfqDetail.submitted")} {format(new Date(quote.createdAt), 'MMM d, yyyy')}</CardDescription>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${statusColors[quote.status]}`}>
                    {t(`quotationStatus.${quote.status}`, { defaultValue: quote.status })}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-4 flex-1">
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500 mb-1">{t("buyer.rfqDetail.totalAmount")}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {quote.currency} {quote.totalAmount?.toLocaleString() || 'N/A'}
                  </p>
                </div>
                
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-500">{t("buyer.rfqDetail.deliveryTime")}:</span>
                    <span className="font-medium text-gray-900">{quote.deliveryTime || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-500">{t("buyer.rfqDetail.paymentTerms")}:</span>
                    <span className="font-medium text-gray-900">{quote.paymentTerms || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span className="text-gray-500">{t("buyer.rfqDetail.validUntil")}:</span>
                    <span className="font-medium text-gray-900">{quote.validUntil ? format(new Date(quote.validUntil), 'MMM d') : 'N/A'}</span>
                  </div>
                </div>

                {quote.items && quote.items.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-900 mb-2 uppercase tracking-wide">{t("buyer.rfqDetail.itemBreakdown")}</p>
                    <div className="space-y-2">
                      {quote.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-600 line-clamp-1 flex-1 ltr:pr-2 rtl:pl-2" title={item.productName}>
                            {item.quantity} {item.unit} {item.productName}
                          </span>
                          <span className="font-medium">
                            {quote.currency} {item.unitPrice.toLocaleString()}/{item.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              
              {rfq.status !== 'closed' && rfq.status !== 'cancelled' && (
                <div className="p-4 border-t border-gray-100 bg-gray-50/50 mt-auto flex flex-wrap gap-2">
                  {quote.status !== 'awarded' && quote.status !== 'rejected' && (
                    <Button 
                      size="sm" 
                      className="flex-1 bg-[#C9A24A] hover:bg-[#C9A24A]/90 text-white"
                      onClick={() => handleAward(quote.id)}
                      disabled={updateQuoteStatus.isPending || rfq.status === 'awarded'}
                    >
                      <CheckCircle className="w-4 h-4 ltr:mr-1.5 rtl:ml-1.5" /> {t("common.award")}
                    </Button>
                  )}
                  {quote.status === 'submitted' && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleShortlist(quote.id)}
                      disabled={updateQuoteStatus.isPending}
                    >
                      {t("common.shortlist")}
                    </Button>
                  )}
                  {quote.status !== 'rejected' && quote.status !== 'awarded' && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleReject(quote.id)}
                      disabled={updateQuoteStatus.isPending}
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </PortalLayout>
  );
}
