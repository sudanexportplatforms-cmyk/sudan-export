import { useState, useEffect } from "react";
import type React from "react";
import { Link, useLocation } from "wouter";
import { useUser, useClerk } from "@clerk/react";
import { 
  LayoutDashboard, FileText, Send, MessageSquare, Building2, 
  Settings, Users, Package, FileCheck2, LogOut, Bell, Menu, X, Mail
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
    { href: "/admin/documents", label: "Documents", icon: FileCheck2 },
    { href: "/admin/email-logs", label: "Email Logs", icon: Mail },
  ],
};

export default function PortalLayout({ role, title, children }: PortalLayoutProps) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const links = navLinks[role];

  // Close mobile menu on navigate
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-sidebar border-r border-sidebar-border h-screen sticky top-0">
        <div className="h-16 flex items-center px-6 border-b border-sidebar-border bg-sidebar">
          <Link href="/">
            <img src="/logo.svg" alt="Sudan Export" className="h-8" />
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location === link.href || location.startsWith(`${link.href}/`);
              return (
                <Link key={link.href} href={link.href}>
                  <div className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                    isActive 
                      ? "bg-primary text-primary-foreground font-medium" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}>
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {user?.firstName?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user?.fullName || 'User'}
              </p>
              <p className="text-xs text-sidebar-foreground/70 capitalize">
                {role} Account
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => signOut({ redirectUrl: '/' })}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out md:hidden flex flex-col ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-sidebar-border bg-sidebar">
          <img src="/logo.svg" alt="Sudan Export" className="h-8" />
          <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location === link.href || location.startsWith(`${link.href}/`);
              return (
                <Link key={link.href} href={link.href}>
                  <div className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                    isActive 
                      ? "bg-primary text-primary-foreground font-medium" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}>
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h1>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
