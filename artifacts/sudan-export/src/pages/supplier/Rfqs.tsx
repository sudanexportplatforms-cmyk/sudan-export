import { useState } from "react";
import { Link } from "wouter";
import { useListRfqs } from "@workspace/api-client-react";
import PortalLayout from "@/components/layout/PortalLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Search, Filter, MapPin, Calendar, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format, formatDistanceToNow } from "date-fns";

const statusColors: Record<string, string> = {
  open: "bg-green-100 text-green-800",
  quoting: "bg-amber-100 text-amber-800",
  shortlisted: "bg-purple-100 text-purple-800",
  awarded: "bg-[#C9A24A]/20 text-[#96762B] border-[#C9A24A]/30",
};

export default function SupplierRfqs() {
  const [searchTerm, setSearchTerm] = useState("");
  // Usually the supplier will only see open RFQs or RFQs targeted to them,
  // we use status "open" or leave empty to fetch all relevant
  const { data: rfqs = [], isLoading } = useListRfqs({ status: 'open' });

  const filteredRfqs = rfqs.filter(
    rfq => 
      rfq.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      rfq.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rfq.destinationCountry?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PortalLayout role="supplier" title="Available RFQs">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex w-full sm:w-auto items-center gap-2">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search by product, country, or reference..." 
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

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : filteredRfqs.length === 0 ? (
          <Card className="border-dashed border-2 shadow-none bg-transparent">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="w-12 h-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Active RFQs</h3>
              <p className="text-gray-500 max-w-sm">There are no open requests matching your search. Check back later.</p>
            </CardContent>
          </Card>
        ) : (
          filteredRfqs.map((rfq) => (
            <Card key={rfq.id} className="border-gray-200 shadow-sm hover:border-primary/50 transition-colors">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-gray-500">{rfq.referenceNumber}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${statusColors[rfq.status] || 'bg-gray-100 text-gray-800'}`}>
                          {rfq.status}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Posted {formatDistanceToNow(new Date(rfq.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{rfq.title}</h3>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      {rfq.destinationCountry && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>Destination: {rfq.destinationCountry}</span>
                        </div>
                      )}
                      {rfq.validUntil && (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>Deadline: {format(new Date(rfq.validUntil), 'MMM d, yyyy')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="bg-gray-50 border-t md:border-t-0 md:border-l border-gray-100 p-6 flex flex-col justify-center items-center text-center w-full md:w-64 shrink-0">
                    <p className="text-sm text-gray-500 mb-4">You have a verified profile matching this request</p>
                    <Button asChild className="w-full">
                      <Link href={`/supplier/rfqs/${rfq.id}`}>View & Quote</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </PortalLayout>
  );
}
