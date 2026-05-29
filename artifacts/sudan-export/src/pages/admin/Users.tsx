import { useState } from "react";
import { useListUsers } from "@workspace/api-client-react";
import PortalLayout from "@/components/layout/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AdminUsers() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const { data: users = [], isLoading } = useListUsers();

  const filtered = users.filter(
    (u) =>
      `${u.firstName} ${u.lastName} ${u.email}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );

  return (
    <PortalLayout role="admin" title={t("admin.users.title")}>
      <div className="mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={t("admin.users.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ltr:pl-9 rtl:pr-9 bg-white"
            data-testid="input-search-users"
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
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("admin.users.noUsers")}</h3>
              <p className="text-gray-500 text-sm">{t("admin.users.noUsersDesc")}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 font-medium">{t("admin.users.cols.name")}</th>
                    <th className="px-6 py-4 font-medium">{t("admin.users.cols.email")}</th>
                    <th className="px-6 py-4 font-medium">{t("admin.users.cols.role")}</th>
                    <th className="px-6 py-4 font-medium">{t("admin.users.cols.status")}</th>
                    <th className="px-6 py-4 font-medium">{t("admin.users.cols.company")}</th>
                    <th className="px-6 py-4 font-medium">{t("admin.users.cols.joined")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filtered.map((user) => (
                    <tr
                      key={user.id}
                      data-testid={`row-user-${user.id}`}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                            {(user.firstName || user.email || "U").charAt(0).toUpperCase()}
                          </div>
                          {user.firstName || user.lastName
                            ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
                            : "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          user.role === "admin" ? "bg-red-100 text-red-700"
                            : user.role === "supplier" ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}>
                          {t(`roles.${user.role}`, { defaultValue: user.role })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          user.status === "active" ? "bg-green-100 text-green-700"
                            : user.status === "suspended" ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}>
                          {t(`userStatus.${user.status}`, { defaultValue: user.status })}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{(user as any).companyName || "—"}</td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {new Date(user.createdAt).toLocaleDateString()}
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
