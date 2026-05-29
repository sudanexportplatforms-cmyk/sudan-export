import PortalLayout from "@/components/layout/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList, Clock } from "lucide-react";

export default function AdminAuditLogs() {
  return (
    <PortalLayout role="admin" title="Audit Logs">
      <div className="mb-6">
        <p className="text-gray-500 text-sm">
          A tamper-evident log of all administrative and user actions across the platform.
        </p>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="py-20 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Audit Logs — Coming Soon</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
            This feature will provide a complete, searchable trail of actions: user logins, company
            verifications, RFQ status changes, and admin overrides — with timestamps and actor IDs.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm font-medium">
            <Clock className="w-4 h-4" />
            Planned for next release
          </div>
        </CardContent>
      </Card>
    </PortalLayout>
  );
}
