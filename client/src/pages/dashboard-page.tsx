import { useQuery } from "@tanstack/react-query";
import { Purchase } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { format } from "date-fns";

export default function DashboardPage() {
  const { data: purchases } = useQuery<Purchase[]>({
    queryKey: ["/api/purchases"],
  });

  const { user, logoutMutation } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">DataBuy Ghana</h1>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline">Home</Button>
            </Link>
            <Button variant="destructive" onClick={() => logoutMutation.mutate()}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Purchase History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {purchases?.map((purchase) => (
                <div key={purchase.id} className="py-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Package ID: {purchase.packageId}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(purchase.purchaseDate), "PPP")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium capitalize">
                        {purchase.paymentMethod}
                      </p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {purchase.status}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
