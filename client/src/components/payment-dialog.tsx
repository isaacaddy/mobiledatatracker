import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { DataPackage } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  package: DataPackage;
}

export default function PaymentDialog({
  open,
  onOpenChange,
  package: pkg,
}: PaymentDialogProps) {
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      paymentMethod: "momo",
    },
  });

  const purchaseMutation = useMutation({
    mutationFn: async (data: { packageId: number; paymentMethod: string }) => {
      const res = await apiRequest("POST", "/api/purchases", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/purchases"] });
      onOpenChange(false);
      toast({
        title: "Purchase successful",
        description: "Your data package has been activated",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Purchase failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: { paymentMethod: string }) => {
    purchaseMutation.mutate({
      packageId: pkg.id,
      paymentMethod: data.paymentMethod,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete Purchase</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="font-medium">{pkg.name}</h3>
            <p className="text-sm text-muted-foreground">
              {pkg.size} valid for {pkg.validity}
            </p>
            <p className="text-lg font-bold mt-2">
              ₵{(pkg.price / 100).toFixed(2)}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="momo" id="momo" />
                          <label htmlFor="momo">Mobile Money</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="card" id="card" />
                          <label htmlFor="card">Card Payment</label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={purchaseMutation.isPending}
              >
                {purchaseMutation.isPending ? "Processing..." : "Pay Now"}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
