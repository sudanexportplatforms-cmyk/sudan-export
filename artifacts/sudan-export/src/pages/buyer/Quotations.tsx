import { useState } from "react";
import { Link } from "wouter";
import { useListQuotations } from "@workspace/api-client-react";
import PortalLayout from "@/components/layout/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight, Building2, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-800",
  submitted: "bg-blue-100 text-blue-800",
  shortlisted: "bg-purple-100 text-purple-800",
  awarded: "bg-[#C9A24A]/20 text-[#96762B] border-[#C9A24A]/30",
  rejected: "bg-gray-100 text-gray-500 line-through opacity-70",
};

export default function BuyerQuotations() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: quotations = [], isLoading } = useListQuotations();

  const filteredQuotes = quotations.filter(q => 
    q.rfqTitle?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    q.supplierCompanyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.supplierName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PortalLayout role="buyer" title="All Quotations">
      <div className="flex justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search by RFQ or Supplier..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>
          <Button variant="outline" size="icon" className="shrink-0 bg-white">
            <Filter className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : filteredQuotes.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Quotations Found</h3>
              <p className="text-gray-500 max-w-sm mx-auto mb-6">
                You haven't received any quotations yet. When suppliers respond to your RFQs, they will appear here.
              </p>
              <Button asChild variant="outline">
                <Link href="/buyer/rfqs">View My RFQs</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 font-medium">RFQ</th>
                    <th className="px-6 py-4 font-medium">Supplier</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Date Received</th>
                    <th className="px-6 py-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredQuotes.map((quote) => (
                    <tr key={quote.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {quote.rfqTitle || `RFQ #${quote.rfqId}`}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          {quote.supplierCompanyName || quote.supplierName || "Unknown"}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {quote.currency} {quote.totalAmount?.toLocaleString() || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider ${statusColors[quote.status] || 'bg-gray-100 text-gray-800'}`}>
                          {quote.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {format(new Date(quote.createdAt), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary hover:bg-primary/5">
                          <Link href={`/buyer/rfqs/${quote.rfqId}`}>
                            Compare <ArrowRight className="ml-1 w-4 h-4" />
                          </Link>
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
