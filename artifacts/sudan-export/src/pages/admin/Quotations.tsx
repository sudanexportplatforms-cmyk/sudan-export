import { useState } from "react";
import { useListQuotations } from "@workspace/api-client-react";
import { Link } from "wouter";
import PortalLayout from "@/components/layout/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Send } from "lucide-react";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  submitted: "bg-blue-100 text-blue-700",
  shortlisted: "bg-purple-100 text-purple-700",
  awarded: "bg-[#C9A24A]/20 text-[#96762B]",
  rejected: "bg-red-100 text-red-700",
};

export default function AdminQuotations() {
  const [search, setSearch] = useState("");
  const { data: quotations = [], isLoading } = useListQuotations();

  const filtered = quotations.filter(
    (q) =>
      (q.rfqTitle?.toLowerCase() ?? "").includes(search.toLowerCase()) ||
      (q.supplierCompanyName?.toLowerCase() ?? "").includes(search.toLowerCase()) ||
      (q.supplierName?.toLowerCase() ?? "").includes(search.toLowerCase()),
  );

  return (
    <PortalLayout role="admin" title="All Quotations">
      <div className="mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by RFQ or supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white"
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
              <Send className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Quotations Found</h3>
              <p className="text-gray-500 text-sm">Quotations submitted by suppliers will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 font-medium">RFQ</th>
                    <th className="px-6 py-4 font-medium">Supplier</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Delivery Days</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filtered.map((q) => (
                    <tr key={q.id} className="hover:bg-gray-50/50 transition-colors cursor-pointer">
                      <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate">
                        <Link href={`/admin/quotations/${q.id}`} className="hover:text-primary hover:underline">
                          {q.rfqTitle || `RFQ #${q.rfqId}`}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {q.supplierCompanyName || q.supplierName || "—"}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {q.currency} {q.totalAmount?.toLocaleString() ?? "—"}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {q.deliveryTime ?? "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                            statusColors[q.status] ?? "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {q.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {format(new Date(q.createdAt), "MMM d, yyyy")}
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
