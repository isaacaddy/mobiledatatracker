import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataPackage } from "@shared/schema";
import { useState } from "react";
import PaymentDialog from "./payment-dialog";

export default function DataPackageCard({ package: pkg }: { package: DataPackage }) {
  const [showPayment, setShowPayment] = useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{pkg.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-3xl font-bold">
              ₵{(pkg.price / 100).toFixed(2)}
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Provider</span>
                <span className="font-medium">{pkg.provider}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Data</span>
                <span className="font-medium">{pkg.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Validity</span>
                <span className="font-medium">{pkg.validity}</span>
              </div>
            </div>
            <Button className="w-full" onClick={() => setShowPayment(true)}>
              Buy Now
            </Button>
          </div>
        </CardContent>
      </Card>

      <PaymentDialog
        open={showPayment}
        onOpenChange={setShowPayment}
        package={pkg}
      />
    </>
  );
}
