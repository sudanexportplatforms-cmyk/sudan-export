import { useState } from "react";
import type React from "react";
import { Link } from "wouter";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

interface PublicLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: "/products", key: "products" },
  { href: "/about", key: "aboutUs" },
  { href: "/faq", key: "faq" },
  { href: "/contact", key: "contact" },
] as const;

export default function PublicLayout({ children }: PublicLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.svg" alt="Sudan Export" className="h-10" />
            </Link>
            <nav className="hidden lg:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
                >
                  {t(`nav.${item.key}`)}
                </Link>
              ))}
              <div className="relative group">
                <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-primary transition-colors py-1">
                  {t("nav.joinPlatform")} <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <div className="absolute top-full ltr:left-0 rtl:right-0 pt-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50">
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 py-2 w-48">
                    <Link
                      href="/become-supplier"
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                    >
                      {t("nav.becomeSupplier")}
                    </Link>
                    <Link
                      href="/become-buyer"
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                    >
                      {t("nav.becomeBuyer")}
                    </Link>
                  </div>
                </div>
              </div>
            </nav>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              href="/sign-in"
              className="text-sm font-medium text-gray-600 hover:text-primary transition-colors px-3 py-2"
            >
              {t("nav.signIn")}
            </Link>
            <Button asChild size="sm" className="bg-primary hover:bg-primary/90 shadow-sm">
              <Link href="/sign-up">{t("nav.getStarted")}</Link>
            </Button>
          </div>

          <button
            className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white py-4">
            <div className="container mx-auto px-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md"
                >
                  {t(`nav.${item.key}`)}
                </Link>
              ))}
              <Link
                href="/become-supplier"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md"
              >
                {t("nav.becomeSupplier")}
              </Link>
              <Link
                href="/become-buyer"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md"
              >
                {t("nav.becomeBuyer")}
              </Link>
              <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2 items-center">
                <LanguageSwitcher variant="outline" className="shrink-0" />
                <Button variant="outline" asChild className="flex-1">
                  <Link href="/sign-in" onClick={() => setMobileOpen(false)}>
                    {t("nav.signIn")}
                  </Link>
                </Button>
                <Button asChild className="flex-1 bg-primary hover:bg-primary/90">
                  <Link href="/sign-up" onClick={() => setMobileOpen(false)}>
                    {t("nav.getStarted")}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-[#1F5D3B] text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="lg:col-span-2">
              <img
                src="/logo.svg"
                alt="Sudan Export"
                className="h-10 mb-4 brightness-0 invert"
              />
              <p className="text-green-200 text-sm leading-relaxed max-w-sm">
                {t("footer.description")}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">{t("footer.platform")}</h4>
              <ul className="space-y-2.5 text-sm text-green-200">
                <li><Link href="/products" className="hover:text-white transition-colors">{t("nav.products")}</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">{t("nav.aboutUs")}</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">{t("nav.faq")}</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">{t("nav.contact")}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">{t("footer.joinUs")}</h4>
              <ul className="space-y-2.5 text-sm text-green-200">
                <li><Link href="/become-supplier" className="hover:text-white transition-colors">{t("nav.becomeSupplier")}</Link></li>
                <li><Link href="/become-buyer" className="hover:text-white transition-colors">{t("nav.becomeBuyer")}</Link></li>
                <li><Link href="/sign-in" className="hover:text-white transition-colors">{t("nav.signIn")}</Link></li>
                <li><Link href="/sign-up" className="hover:text-white transition-colors">{t("nav.register")}</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-green-700 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-green-300">
            <p>{t("footer.rights", { year: new Date().getFullYear() })}</p>
            <p>{t("footer.tagline")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
