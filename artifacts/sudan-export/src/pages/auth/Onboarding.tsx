import { useUser } from "@clerk/react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useGetMyProfile, useUpsertMyProfile } from "@workspace/api-client-react";
import type { UserProfileInputRole } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, ShoppingCart } from "lucide-react";

export default function Onboarding() {
  const { user, isLoaded } = useUser();
  const [, setLocation] = useLocation();
  const upsertProfile = useUpsertMyProfile();
  const { data: profile, isLoading: isProfileLoading } = useGetMyProfile({
    query: { enabled: !!user?.id, queryKey: ["getMyProfile"] }
  });

  const [selectedRole, setSelectedRole] = useState<UserProfileInputRole | null>(null);

  useEffect(() => {
    if (profile && profile.role) {
      if (profile.role === 'admin') setLocation('/admin/dashboard');
      else if (profile.role === 'buyer') setLocation('/buyer/dashboard');
      else if (profile.role === 'supplier') setLocation('/supplier/dashboard');
    }
  }, [profile, setLocation]);

  const handleComplete = () => {
    if (!selectedRole || !user) return;
    
    upsertProfile.mutate({
      data: {
        role: selectedRole,
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
      }
    }, {
      onSuccess: () => {
        if (selectedRole === 'buyer') setLocation('/buyer/dashboard');
        else if (selectedRole === 'supplier') setLocation('/supplier/dashboard');
      }
    });
  };

  if (!isLoaded || isProfileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="mb-8">
        <img src="/logo.svg" alt="Sudan Export" className="h-12" />
      </div>
      
      <Card className="w-full max-w-2xl border-none shadow-xl">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-3xl font-bold text-gray-900 tracking-tight">Welcome to Sudan Export</CardTitle>
          <CardDescription className="text-lg mt-2">
            To get started, please tell us how you'll be using the platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 pt-0">
          <button
            onClick={() => setSelectedRole('buyer')}
            className={`flex flex-col items-center text-center p-8 rounded-xl border-2 transition-all duration-200 ${
              selectedRole === 'buyer' 
                ? 'border-primary bg-primary/5 ring-4 ring-primary/10' 
                : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
            }`}
          >
            <div className={`p-4 rounded-full mb-4 ${selectedRole === 'buyer' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
              <ShoppingCart className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">I am a Buyer</h3>
            <p className="text-gray-500 text-sm">
              I want to source premium agricultural commodities from verified Sudanese suppliers.
            </p>
          </button>

          <button
            onClick={() => setSelectedRole('supplier')}
            className={`flex flex-col items-center text-center p-8 rounded-xl border-2 transition-all duration-200 ${
              selectedRole === 'supplier' 
                ? 'border-primary bg-primary/5 ring-4 ring-primary/10' 
                : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
            }`}
          >
            <div className={`p-4 rounded-full mb-4 ${selectedRole === 'supplier' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
              <Building2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">I am a Supplier</h3>
            <p className="text-gray-500 text-sm">
              I want to export Sudanese commodities and connect with international buyers.
            </p>
          </button>
        </CardContent>
        <CardFooter className="bg-gray-50 border-t p-6 rounded-b-2xl flex justify-between items-center">
          <p className="text-sm text-gray-500">You can update your company profile later.</p>
          <Button 
            size="lg" 
            onClick={handleComplete} 
            disabled={!selectedRole || upsertProfile.isPending}
            className="px-8"
          >
            {upsertProfile.isPending ? 'Setting up...' : 'Continue to Dashboard'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
