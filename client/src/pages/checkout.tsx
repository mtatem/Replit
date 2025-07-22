import { useEffect, useState } from "react";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// This will be enabled when VITE_STRIPE_PUBLIC_KEY is configured
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : Promise.resolve(null);

interface CheckoutFormProps {
  purchaseDetails: {
    cryptoSymbol: string;
    cryptoAmount: string;
    usdAmount: number;
    totalCost: number;
    paymentMethod: string;
  };
  onBack: () => void;
}

const CheckoutForm = ({ purchaseDetails, onBack }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/portfolio`,
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Payment Successful",
          description: "Your cryptocurrency has been purchased successfully!",
        });
      }
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Purchase
      </Button>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Card className="bg-dark-surface border-dark-border">
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <PaymentElement />
                <Button
                  type="submit"
                  disabled={!stripe || isProcessing}
                  className="w-full h-12 bg-gradient-to-r from-crypto-blue to-crypto-green"
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    `Pay $${purchaseDetails.totalCost.toFixed(2)}`
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="bg-dark-surface border-dark-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-crypto-green" />
                <span>Order Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Cryptocurrency</span>
                  <Badge variant="secondary" className="bg-crypto-blue/20 text-crypto-blue">
                    {purchaseDetails.cryptoSymbol}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount</span>
                  <span className="font-medium">{purchaseDetails.cryptoAmount} {purchaseDetails.cryptoSymbol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment Method</span>
                  <span className="capitalize">{purchaseDetails.paymentMethod}</span>
                </div>
                <Separator className="bg-dark-border" />
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span>${purchaseDetails.usdAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Fees</span>
                  <span>${(purchaseDetails.totalCost - purchaseDetails.usdAmount).toFixed(2)}</span>
                </div>
                <Separator className="bg-dark-border" />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${purchaseDetails.totalCost.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

interface CheckoutProps {
  purchaseDetails: {
    cryptoSymbol: string;
    cryptoAmount: string;
    usdAmount: number;
    totalCost: number;
    paymentMethod: string;
  };
  onBack: () => void;
}

export default function Checkout({ purchaseDetails, onBack }: CheckoutProps) {
  const [clientSecret, setClientSecret] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
      toast({
        title: "Payment Setup Required",
        description: "Stripe integration needs to be configured with API keys",
        variant: "destructive",
      });
      return;
    }

    // Create PaymentIntent when component mounts
    apiRequest("POST", "/api/create-payment-intent", {
      amount: purchaseDetails.totalCost,
      cryptoSymbol: purchaseDetails.cryptoSymbol,
      paymentMethod: purchaseDetails.paymentMethod
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          toast({
            title: "Payment Setup",
            description: data.message || "Payment processing not yet configured",
            variant: "default",
          });
        }
      })
      .catch(() => {
        toast({
          title: "Payment Error",
          description: "Unable to initialize payment. Please try again.",
          variant: "destructive",
        });
      });
  }, [purchaseDetails, toast]);

  if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Purchase
        </Button>
        
        <Card className="bg-dark-surface border-dark-border">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto" />
              <h3 className="text-xl font-semibold">Payment Setup Required</h3>
              <p className="text-gray-400">
                Stripe integration needs to be configured with API keys to enable cryptocurrency purchases.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-400">Initializing secure payment...</p>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm purchaseDetails={purchaseDetails} onBack={onBack} />
    </Elements>
  );
}