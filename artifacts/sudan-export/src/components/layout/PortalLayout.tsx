import { useState, useEffect } from "react";
import type React from "react";
import { Link, useLocation } from "wouter";
import { useUser, useClerk } from "@clerk/react";
import {
  LayoutDashboard, FileText, Send, MessageSquare, Building2,
  Settings, Users, Package, FileCheck2, LogOut, Menu, X, Mail,
  Globe, BarChart3, ClipboardList, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import NotificationBell from "./NotificationBell";

type PortalRole = "buyer" | "supplier" | "admin";

interface PortalLayoutProps {
  role: PortalRole;
  title: string;
  children: React.ReactNode;
}

const navLinks: Record<PortalRole, { href: string; label: string; icon: React.ComponentType<{ className?: string }> }[]> = {
  buyer: [
    { href: "/buyer/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/buyer/rfqs", label: "My RFQs", icon: FileText },
    { href: "/buyer/quotations", label: "Quotations", icon: Send },
    { href: "/buyer/messages", label: "Messages", icon: MessageSquare },
    { href: "/buyer/company", label: "Company Profile", icon: Building2 },
    { href: "/buyer/documents", label: "Documents", icon: FileCheck2 },
    { href: "/buyer/settings", label: "Settings", icon: Settings },
  ],
  supplier: [
    { href: "/supplier/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/supplier/rfqs", label: "RFQs Received", icon: FileText },
    { href: "/supplier/quotations", label: "My Quotations", icon: Send },
    { href: "/supplier/products", label: "Products", icon: Package },
    { href: "/supplier/messages", label: "Messages", icon: MessageSquare },
    { href: "/supplier/company", label: "Company Profile", icon: Building2 },
    { href: "/supplier/documents", label: "Documents", icon: FileCheck2 },
    { href: "/supplier/settings", label: "Settings", icon: Settings },
  ],
  admin: [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/companies", label: "Companies", icon: Building2 },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/rfqs", label: "All RFQs", icon: FileText },
    { href: "/admin/quotations", label: "All Quotations", icon: Send },
    { href: "/admin/email-logs", label: "Email Logs", icon: Mail },
    { href: "/admin/reports", label: "Reports", icon: BarChart3 },
    { href: "/admin/audit-logs", label: "Audit Logs", icon: ClipboardList },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ],
};

const roleBadge: Record<PortalRole, { label: string; className: string }> = {
  admin: { label: "Admin", className: "bg-red-100 text-red-700" },
  buyer: { label: "Buyer", className: "bg-green-100 text-green-700" },
  supplier: { label: "Supplier", className: "bg-blue-100 text-blue-700" },
};

function SidebarContent({
  role,
  links,
  location,
  onSignOut,
}: {
  role: PortalRole;
  links: typeof navLinks[PortalRole];
  location: string;
  onSignOut: () => void;
}) {
  const { user } = useUser();
  const badge = roleBadge[role];

  return (
    <>
      <div className="flex-1 overflow-y-auto py-3">
        {/* Visit Website button */}
        <div className="px-3 mb-3">
          <Link href="/">
            <div className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-sidebar-foreground/60 hover:text-primary hover:bg-sidebar-accent transition-colors border border-sidebar-border">
              <ExternalLink className="w-4 h-4" />
              Visit Website
            </div>
          </Link>
        </div>

        <nav className="space-y-0.5 px-3">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location === link.href || location.startsWith(`${link.href}/`);
            return (
              <Link key={link.href} href={link.href}>
                <div
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm ${
                    isActive
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {link.label}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
            {user?.firstName?.charAt(0) || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user?.fullName || "User"}
            </p>
            <span
              className={`inline-flex items-center mt-0.5 px-1.5 py-0.5 rounded text-xs font-medium ${badge.className}`}
            >
              {badge.label}
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 text-sm h-9"
          onClick={onSignOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </>
  );
}

export default function PortalLayout({ role, title, children }: PortalLayoutProps) {
  const { signOut } = useClerk();
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const links = navLinks[role];

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  const handleSignOut = () => signOut({ redirectUrl: "/" });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-sidebar border-r border-sidebar-border h-screen sticky top-0">
        <div className="h-16 flex items-center px-6 border-b border-sidebar-border bg-sidebar shrink-0">
          <Link href="/">
            <img src="/logo.svg" alt="Sudan Export" className="h-8" />
          </Link>
        </div>
        <SidebarContent
          role={role}
          links={links}
          location={location}
          onSignOut={handleSignOut}
        />
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out md:hidden flex flex-col ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-sidebar-border bg-sidebar shrink-0">
          <img src="/logo.svg" alt="Sudan Export" className="h-8" />
          <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <SidebarContent
          role={role}
          links={links}
          location={location}
          onSignOut={handleSignOut}
        />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary transition-colors px-2 py-1.5 rounded-md hover:bg-gray-50">
              <Globe className="w-3.5 h-3.5" />
              Website
            </Link>
            <NotificationBell />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}
