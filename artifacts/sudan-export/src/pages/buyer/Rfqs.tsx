import { useState } from "react";
import { Link } from "wouter";
import { useListRfqs } from "@workspace/api-client-react";
import PortalLayout from "@/components/layout/PortalLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

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
  const [searchTerm, setSearchTerm] = useState("");
  const { data: rfqs = [], isLoading } = useListRfqs();

  const filteredRfqs = rfqs.filter(
    rfq => 
      rfq.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      rfq.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PortalLayout role="buyer" title="My RFQs">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex w-full sm:w-auto items-center gap-2">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search RFQs..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>
          <Button variant="outline" size="icon" className="shrink-0 bg-white">
            <Filter className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/buyer/rfqs/new">
            <Plus className="mr-2 h-4 w-4" />
            Create RFQ
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No RFQs Found</h3>
              <p className="text-gray-500 max-w-sm mx-auto mb-6">
                You haven't created any Requests for Quotation yet. Create one to start sourcing from verified suppliers.
              </p>
              <Button asChild>
                <Link href="/buyer/rfqs/new">Create Your First RFQ</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 font-medium">Reference</th>
                    <th className="px-6 py-4 font-medium">Title</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-center">Quotes</th>
                    <th className="px-6 py-4 font-medium">Deadline</th>
                    <th className="px-6 py-4 font-medium text-right">Action</th>
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
                          {rfq.status.charAt(0).toUpperCase() + rfq.status.slice(1)}
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
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary hover:bg-primary/5">
                          <Link href={`/buyer/rfqs/${rfq.id}`}>View Details</Link>
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
