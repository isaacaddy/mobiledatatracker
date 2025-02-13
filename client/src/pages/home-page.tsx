import { useQuery } from "@tanstack/react-query";
import { DataPackage } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import DataPackageCard from "@/components/data-package-card";

export default function HomePage() {
  const { data: packages } = useQuery<DataPackage[]>({
    queryKey: ["/api/packages"],
  });

  const { user, logoutMutation } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">DataBuy Ghana</h1>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
            <Button variant="destructive" onClick={() => logoutMutation.mutate()}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Welcome, {user?.username}!</h2>
          <p className="text-muted-foreground">
            Choose from our selection of data packages below
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {packages?.map((pkg) => (
            <DataPackageCard key={pkg.id} package={pkg} />
          ))}
        </div>
      </main>
    </div>
  );
}
