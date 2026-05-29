import PortalLayout from "@/components/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon, Bell, Shield, Globe2, Clock } from "lucide-react";

export default function AdminSettings() {
  return (
    <PortalLayout role="admin" title="Admin Settings">
      <div className="mb-6">
        <p className="text-gray-500 text-sm">
          Platform-wide configuration. Most settings require a developer deployment to take effect.
        </p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <Card className="border-none shadow-sm">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-primary" />
              Platform Identity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-1.5">
              <Label>Platform Name</Label>
              <Input defaultValue="Sudan Export Platform" disabled className="bg-gray-50" />
            </div>
            <div className="space-y-1.5">
              <Label>Support Email</Label>
              <Input defaultValue="support@sudanexport.com" disabled className="bg-gray-50" />
            </div>
            <p className="text-xs text-gray-400">
              To update these values, modify environment variables and redeploy.
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              Email Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">New RFQ notifications to suppliers</p>
                <p className="text-xs text-gray-500">Email suppliers when a new RFQ is posted</p>
              </div>
              <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Enabled</div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Quotation awarded notifications</p>
                <p className="text-xs text-gray-500">Email suppliers when their quotation is awarded</p>
              </div>
              <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Enabled</div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Company verification notifications</p>
                <p className="text-xs text-gray-500">Email companies when their verification status changes</p>
              </div>
              <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Enabled</div>
            </div>
            <p className="text-xs text-gray-400 pt-2 border-t border-gray-100">
              Email delivery requires the <code className="bg-gray-100 px-1 rounded">RESEND_API_KEY</code> environment variable to be set.
              See Email Logs page for delivery status.
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Authentication provider</p>
                <p className="text-xs text-gray-500">Managed by Clerk</p>
              </div>
              <div className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">Clerk</div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Session encryption</p>
                <p className="text-xs text-gray-500">SESSION_SECRET env variable</p>
              </div>
              <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Configured</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm border-dashed border-2 border-gray-200">
          <CardContent className="p-6 text-center">
            <SettingsIcon className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <h3 className="font-medium text-gray-700 mb-1">More settings coming soon</h3>
            <p className="text-xs text-gray-500">
              Future settings will include RFQ deadlines, approval workflows, fee configuration,
              and user suspension policies.
            </p>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}
