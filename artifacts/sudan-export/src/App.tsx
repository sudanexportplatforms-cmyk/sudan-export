import { useEffect, useRef } from "react";
import { ClerkProvider, SignIn, SignUp, Show, useClerk, useUser } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import { Switch, Route, Redirect, useLocation, Router as WouterRouter } from 'wouter';
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";

import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Home from "@/pages/public/Home";
import Products from "@/pages/public/Products";
import ProductDetail from "@/pages/public/ProductDetail";
import About from "@/pages/public/About";
import FAQ from "@/pages/public/FAQ";
import Contact from "@/pages/public/Contact";
import BecomeSupplier from "@/pages/public/BecomeSupplier";
import BecomeBuyer from "@/pages/public/BecomeBuyer";
import Onboarding from "@/pages/auth/Onboarding";

import BuyerDashboard from "@/pages/buyer/Dashboard";
import BuyerRfqs from "@/pages/buyer/Rfqs";
import NewRfq from "@/pages/buyer/NewRfq";
import RfqDetail from "@/pages/buyer/RfqDetail";
import BuyerQuotations from "@/pages/buyer/Quotations";
import BuyerMessages from "@/pages/buyer/Messages";
import BuyerCompany from "@/pages/buyer/Company";
import BuyerDocuments from "@/pages/buyer/Documents";
import BuyerSettings from "@/pages/buyer/Settings";

import SupplierDashboard from "@/pages/supplier/Dashboard";
import SupplierRfqs from "@/pages/supplier/Rfqs";
import SupplierRfqDetail from "@/pages/supplier/RfqDetail";
import SupplierQuotations from "@/pages/supplier/Quotations";
import SupplierMessages from "@/pages/supplier/Messages";
import SupplierProducts from "@/pages/supplier/Products";
import SupplierCompany from "@/pages/supplier/Company";
import SupplierDocuments from "@/pages/supplier/Documents";
import SupplierSettings from "@/pages/supplier/Settings";

import AdminDashboard from "@/pages/admin/Dashboard";
import AdminUsers from "@/pages/admin/Users";
import AdminCompanies from "@/pages/admin/Companies";
import AdminRfqs from "@/pages/admin/Rfqs";
import AdminQuotations from "@/pages/admin/Quotations";
import AdminProducts from "@/pages/admin/Products";
import AdminEmailLogs from "@/pages/admin/EmailLogs";
import AdminReports from "@/pages/admin/Reports";
import AdminAuditLogs from "@/pages/admin/AuditLogs";
import AdminSettings from "@/pages/admin/Settings";

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath) ? path.slice(basePath.length) || "/" : path;
}

if (!clerkPubKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in .env file');
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "hsl(147 50% 24%)",
    colorForeground: "hsl(147 10% 15%)",
    colorMutedForeground: "hsl(147 5% 45%)",
    colorDanger: "hsl(0 84% 60%)",
    colorBackground: "hsl(0 0% 100%)",
    colorInput: "hsl(147 10% 98%)",
    colorInputForeground: "hsl(147 10% 15%)",
    colorNeutral: "hsl(147 10% 90%)",
    fontFamily: "'Inter', sans-serif",
    borderRadius: "0.5rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-white rounded-2xl w-[440px] max-w-full overflow-hidden shadow-xl border border-gray-100",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-2xl font-bold text-gray-900 tracking-tight",
    headerSubtitle: "text-sm text-gray-500",
    socialButtonsBlockButtonText: "font-medium",
    formFieldLabel: "text-sm font-medium text-gray-700",
    footerActionLink: "font-medium text-primary hover:text-primary/90",
    footerActionText: "text-sm text-gray-500",
    dividerText: "text-xs font-medium text-gray-400 uppercase",
    identityPreviewEditButton: "text-primary hover:text-primary/90",
    formFieldSuccessText: "text-sm text-green-600",
    alertText: "text-sm text-red-600",
    logoBox: "mb-6 flex justify-center",
    logoImage: "h-12 w-auto",
    socialButtonsBlockButton: "border-gray-200 hover:bg-gray-50",
    formButtonPrimary: "bg-primary hover:bg-primary/90 text-white shadow-sm",
    formFieldInput: "border-gray-200 focus:border-primary focus:ring-primary shadow-sm",
    footerAction: "mt-6 border-t border-gray-100 pt-6",
    dividerLine: "bg-gray-200",
    alert: "bg-red-50 border-red-200",
    otpCodeFieldInput: "border-gray-200 focus:border-primary",
    formFieldRow: "mb-4",
    main: "p-8",
  },
};

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
    </div>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const queryClient = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (
        prevUserIdRef.current !== undefined &&
        prevUserIdRef.current !== userId
      ) {
        queryClient.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, queryClient]);

  return null;
}

import { useGetMyProfile } from "@workspace/api-client-react";

function HomeRedirect() {
  const { user, isLoaded: isClerkLoaded } = useUser();
  const { data: profile, isLoading: isProfileLoading } = useGetMyProfile({
    query: {
      enabled: !!user?.id,
      queryKey: ["getMyProfile"],
    }
  });

  if (!isClerkLoaded) return <div className="h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <>
      <Show when="signed-in">
        {isProfileLoading ? (
          <div className="h-screen bg-gray-50 flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : profile ? (
          <>
            {profile.role === 'admin' && <Redirect to="/admin/dashboard" />}
            {profile.role === 'buyer' && <Redirect to="/buyer/dashboard" />}
            {profile.role === 'supplier' && <Redirect to="/supplier/dashboard" />}
            {(!profile.role || !['admin', 'buyer', 'supplier'].includes(profile.role)) && <Redirect to="/onboarding" />}
          </>
        ) : (
          <Redirect to="/onboarding" />
        )}
      </Show>
      <Show when="signed-out">
        <Home />
      </Show>
    </>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: {
          start: {
            title: "Sign in to Sudan Export",
            subtitle: "Access your B2B trade portal",
          },
        },
        signUp: {
          start: {
            title: "Join Sudan Export",
            subtitle: "Start trading premium agricultural commodities",
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <TooltipProvider>
          <Switch>
            {/* Root — redirect logged-in users, show public home for guests */}
            <Route path="/" component={HomeRedirect} />

            {/* Auth */}
            <Route path="/sign-in/*?" component={SignInPage} />
            <Route path="/sign-up/*?" component={SignUpPage} />
            <Route path="/onboarding" component={Onboarding} />

            {/* Public — static routes before parameterised */}
            <Route path="/products" component={Products} />
            <Route path="/products/:slug" component={ProductDetail} />
            <Route path="/about" component={About} />
            <Route path="/faq" component={FAQ} />
            <Route path="/contact" component={Contact} />
            <Route path="/become-supplier" component={BecomeSupplier} />
            <Route path="/become-buyer" component={BecomeBuyer} />

            {/* Buyer routes */}
            <Route path="/buyer/dashboard" component={BuyerDashboard} />
            <Route path="/buyer/rfqs/new" component={NewRfq} />
            <Route path="/buyer/rfqs/:rfqId" component={RfqDetail} />
            <Route path="/buyer/rfqs" component={BuyerRfqs} />
            <Route path="/buyer/quotations" component={BuyerQuotations} />
            <Route path="/buyer/messages" component={BuyerMessages} />
            <Route path="/buyer/company" component={BuyerCompany} />
            <Route path="/buyer/documents" component={BuyerDocuments} />
            <Route path="/buyer/settings" component={BuyerSettings} />

            {/* Supplier routes */}
            <Route path="/supplier/dashboard" component={SupplierDashboard} />
            <Route path="/supplier/rfqs/:rfqId" component={SupplierRfqDetail} />
            <Route path="/supplier/rfqs" component={SupplierRfqs} />
            <Route path="/supplier/quotations" component={SupplierQuotations} />
            <Route path="/supplier/messages" component={SupplierMessages} />
            <Route path="/supplier/products" component={SupplierProducts} />
            <Route path="/supplier/company" component={SupplierCompany} />
            <Route path="/supplier/documents" component={SupplierDocuments} />
            <Route path="/supplier/settings" component={SupplierSettings} />

            {/* Admin routes */}
            <Route path="/admin/dashboard" component={AdminDashboard} />
            <Route path="/admin/users" component={AdminUsers} />
            <Route path="/admin/companies" component={AdminCompanies} />
            <Route path="/admin/products" component={AdminProducts} />
            <Route path="/admin/rfqs" component={AdminRfqs} />
            <Route path="/admin/quotations" component={AdminQuotations} />
            <Route path="/admin/email-logs" component={AdminEmailLogs} />
            <Route path="/admin/reports" component={AdminReports} />
            <Route path="/admin/audit-logs" component={AdminAuditLogs} />
            <Route path="/admin/settings" component={AdminSettings} />

            <Route component={NotFound} />
          </Switch>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
