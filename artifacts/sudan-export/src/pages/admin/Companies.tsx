import { useState } from "react";
import {
  useListCompanies,
  useVerifyCompany,
  getListCompaniesQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import PortalLayout from "@/components/layout/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Building2, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminCompanies() {
  const [search, setSearch] = useState("");
  const { data: companies = [], isLoading } = useListCompanies();
  const verifyCompany = useVerifyCompany();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const filtered = companies.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleVerify = (
    companyId: number,
    action: "approve" | "reject",
  ) => {
    verifyCompany.mutate(
      { companyId, data: { action } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getListCompaniesQueryKey(),
          });
          toast({
            title: action === "approve" ? "Company Approved" : "Company Rejected",
            description: `The company has been ${action}d.`,
          });
        },
      },
    );
  };

  return (
    <PortalLayout role="admin" title="Company Management">
      <div className="mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white"
            data-testid="input-search-companies"
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
              <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Companies Found
              </h3>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 font-medium">Company</th>
                    <th className="px-6 py-4 font-medium">Type</th>
                    <th className="px-6 py-4 font-medium">Country</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filtered.map((company) => (
                    <tr
                      key={company.id}
                      data-testid={`row-company-${company.id}`}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {company.name}
                        </div>
                        {company.registrationNumber && (
                          <div className="text-xs text-gray-500 mt-0.5">
                            Reg: {company.registrationNumber}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                            company.type === "supplier"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {company.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {company.country}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                            company.verificationStatus === "approved"
                              ? "bg-green-100 text-green-700"
                              : company.verificationStatus === "rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {company.verificationStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {company.verificationStatus === "pending" && (
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-green-600 hover:bg-green-50"
                              data-testid={`button-approve-company-${company.id}`}
                              disabled={verifyCompany.isPending}
                              onClick={() =>
                                handleVerify(company.id, "approve")
                              }
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:bg-red-50"
                              data-testid={`button-reject-company-${company.id}`}
                              disabled={verifyCompany.isPending}
                              onClick={() =>
                                handleVerify(company.id, "reject")
                              }
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                        {company.verificationStatus === "approved" && (
                          <span className="text-xs text-green-600 font-medium">
                            Verified
                          </span>
                        )}
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
