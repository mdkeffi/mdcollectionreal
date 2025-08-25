import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, MessageSquare, CreditCard } from "lucide-react";
import { PaystackButton } from "react-paystack";
import { toast } from "sonner";

const PAYSTACK_PUBLIC_KEY = "pk_test_05b2d7701c6df6c513061f969002b163804eeb18";
const SHEETDB_ENDPOINT = "https://sheetdb.io/api/v1/tl4p36fvtpr2f";

interface PaymentData {
  name: string;
  email: string;
  phone: string;
  location: string;
  design: string;
  itemName: string;
  amount: number;
  sleeve?: string;
  type: string;
}

const PaymentPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState<PaymentData>({
    name: "",
    email: "",
    phone: "",
    location: "",
    design: searchParams.get("design") || "",
    itemName: searchParams.get("name") || "",
    amount: parseInt(searchParams.get("amount") || "0"),
    sleeve: searchParams.get("sleeve") || undefined,
    type: searchParams.get("type") || ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load customer name if available
    const customerName = localStorage.getItem("customerName");
    if (customerName) {
      setFormData(prev => ({ ...prev, name: customerName }));
    }

    // Check if user has a pending payment
    const pendingPayment = localStorage.getItem("pendingPayment");
    if (pendingPayment) {
      const paymentData = JSON.parse(pendingPayment);
      setFormData(paymentData);
      toast.info("Resuming your previous payment...");
    }
  }, []);

  const handleInputChange = (field: keyof PaymentData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { name, email, phone, location, amount } = formData;
    
    if (!name.trim()) {
      toast.error("Please enter your name");
      return false;
    }
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!phone.trim() || phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return false;
    }
    if (!location.trim()) {
      toast.error("Please enter your location");
      return false;
    }
    if (amount <= 0) {
      toast.error("Invalid amount");
      return false;
    }
    
    return true;
  };

  const sendDataToSheets = async (data: any) => {
    try {
      await fetch(SHEETDB_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: [data] })
      });
    } catch (error) {
      console.error("Error sending data to sheets:", error);
    }
  };

  const paystackConfig = {
    reference: `md_${Date.now()}`,
    email: formData.email,
    amount: formData.amount * 100, // Paystack expects amount in kobo
    publicKey: PAYSTACK_PUBLIC_KEY,
    text: `Pay ₦${formData.amount.toLocaleString()}`,
    onSuccess: async (reference: any) => {
      setIsSubmitting(true);
      
      // Save payment data to localStorage
      const paymentResult = {
        ...formData,
        reference: reference.reference,
        status: "success",
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem("paymentResult", JSON.stringify(paymentResult));
      localStorage.removeItem("pendingPayment");

      // Send payment data to Google Sheets
      await sendDataToSheets({
        event_type: "payment_success",
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        customer_location: formData.location,
        item_name: formData.itemName,
        item_design: formData.design,
        sleeve_type: formData.sleeve || "N/A",
        product_type: formData.type,
        amount: formData.amount,
        reference: reference.reference,
        timestamp: new Date().toISOString()
      });

      toast.success("Payment successful! Redirecting to measurement...");
      
      setTimeout(() => {
        navigate(`/measurement?ref=${reference.reference}`);
      }, 2000);
    },
    onClose: () => {
      // Save form data for later if user closes without paying
      localStorage.setItem("pendingPayment", JSON.stringify(formData));
      toast.info("Payment cancelled. You can resume later.");
    }
  };

  const handlePayment = () => {
    if (!validateForm()) return;
    
    // Save pending payment data
    localStorage.setItem("pendingPayment", JSON.stringify(formData));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b shadow-soft">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-playfair font-bold gradient-primary bg-clip-text text-transparent">
                Payment Details
              </h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open("https://wa.me/2348149608006", "_blank")}
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Payment Form */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Selected Item */}
          {formData.design && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 gradient-accent bg-clip-text text-transparent">
                Selected Item
              </h2>
              <div className="flex items-center gap-4">
                <img
                  src={formData.design}
                  alt={formData.itemName}
                  className="w-20 h-24 object-cover rounded-lg shadow-medium"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{formData.itemName}</h3>
                  {formData.sleeve && (
                    <p className="text-sm text-muted-foreground capitalize">
                      {formData.sleeve} sleeve
                    </p>
                  )}
                  <p className="text-lg font-bold gradient-primary bg-clip-text text-transparent">
                    ₦{formData.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Customer Information */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 gradient-secondary bg-clip-text text-transparent">
              Customer Information
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email address"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location/Address</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="Enter your location or delivery address"
                />
              </div>
            </div>
          </Card>

          {/* Payment Summary */}
          <Card className="p-6 border-accent/20 bg-gradient-to-br from-accent/5 to-primary/5">
            <h2 className="text-lg font-semibold mb-4 gradient-accent bg-clip-text text-transparent">
              Payment Summary
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Item Price:</span>
                <span className="font-semibold">₦{formData.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span className="font-semibold">Included</span>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="gradient-primary bg-clip-text text-transparent">
                  ₦{formData.amount.toLocaleString()}
                </span>
              </div>
            </div>
          </Card>

          {/* Payment Button */}
          <div className="text-center">
            {validateForm() && formData.amount > 0 ? (
              <PaystackButton
                {...paystackConfig}
                className="w-full h-12 bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-bold rounded-lg shadow-glow hover:shadow-large transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                onClose={() => paystackConfig.onClose()}
                onSuccess={(reference) => paystackConfig.onSuccess(reference)}
              >
                <CreditCard className="h-5 w-5" />
                Pay ₦{formData.amount.toLocaleString()} with Paystack
              </PaystackButton>
            ) : (
              <Button
                variant="hero"
                size="xl"
                className="w-full"
                disabled
              >
                Complete all fields to proceed
              </Button>
            )}
            
            <p className="text-sm text-muted-foreground mt-4">
              Secure payment powered by Paystack. Your payment information is encrypted and secure.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-8 px-4 mt-12">
        <div className="container mx-auto text-center">
          <Button
            variant="ghost"
            onClick={() => window.open("https://wa.me/2348149608006", "_blank")}
            className="text-accent hover:text-accent/80"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Need help? Contact us: 08149608006
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default PaymentPage;