import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, MessageSquare, Ruler, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const SHEETDB_ENDPOINT = "https://sheetdb.io/api/v1/tl4p36fvtpr2f";

interface MeasurementData {
  shirt: string;
  trouser: string;
  hand: string;
  neck: string;
  shoulder: string;
  fabricColor: string;
  description: string;
}

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
  reference: string;
  status: string;
  timestamp: string;
}

const MeasurementPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [measurementData, setMeasurementData] = useState<MeasurementData>({
    shirt: "",
    trouser: "",
    hand: "",
    neck: "",
    shoulder: "",
    fabricColor: "",
    description: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  useEffect(() => {
    // Load payment data
    const savedPaymentData = localStorage.getItem("paymentResult");
    if (!savedPaymentData) {
      toast.error("No payment information found. Redirecting to home...");
      setTimeout(() => navigate("/"), 2000);
      return;
    }

    const payment: PaymentData = JSON.parse(savedPaymentData);
    setPaymentData(payment);
  }, [navigate]);

  const handleInputChange = (field: keyof MeasurementData, value: string) => {
    setMeasurementData(prev => ({ ...prev, [field]: value }));
  };

  const validateMeasurements = () => {
    const { shirt, trouser, hand, neck, shoulder, fabricColor } = measurementData;
    
    if (!shirt.trim()) {
      toast.error("Please enter shirt measurement");
      return false;
    }
    if (!trouser.trim()) {
      toast.error("Please enter trouser measurement");
      return false;
    }
    if (!hand.trim()) {
      toast.error("Please enter hand measurement");
      return false;
    }
    if (!neck.trim()) {
      toast.error("Please enter neck measurement");
      return false;
    }
    if (!shoulder.trim()) {
      toast.error("Please enter shoulder measurement");
      return false;
    }
    if (!fabricColor.trim()) {
      toast.error("Please specify fabric color preference");
      return false;
    }
    
    return true;
  };

  const sendDataToSheets = async (data: any) => {
    try {
      const response = await fetch(SHEETDB_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: [data] })
      });
      
      if (!response.ok) {
        throw new Error("Failed to send data");
      }
      
      return true;
    } catch (error) {
      console.error("Error sending data to sheets:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!validateMeasurements() || !paymentData) return;

    setIsSubmitting(true);

    try {
      // Compile all data for Google Sheets
      const completeOrderData = {
        event_type: "order_complete",
        reference: paymentData.reference,
        timestamp: new Date().toISOString(),
        
        // Customer Information
        customer_name: paymentData.name,
        customer_email: paymentData.email,
        customer_phone: paymentData.phone,
        customer_location: paymentData.location,
        
        // Product Information
        item_name: paymentData.itemName,
        item_design: paymentData.design,
        sleeve_type: paymentData.sleeve || "N/A",
        product_type: paymentData.type,
        amount_paid: paymentData.amount,
        
        // Measurements
        shirt_measurement: measurementData.shirt,
        trouser_measurement: measurementData.trouser,
        hand_measurement: measurementData.hand,
        neck_measurement: measurementData.neck,
        shoulder_measurement: measurementData.shoulder,
        fabric_color: measurementData.fabricColor,
        special_description: measurementData.description || "N/A",
        
        // Status
        payment_status: paymentData.status,
        order_status: "measurements_completed"
      };

      // Send to Google Sheets
      await sendDataToSheets(completeOrderData);
      
      // Clear localStorage after successful submission
      localStorage.removeItem("paymentResult");
      localStorage.removeItem(`measurements_${paymentData.reference}`);
      localStorage.removeItem("kaptansOrder");
      localStorage.removeItem("agbadaOrder");
      localStorage.removeItem("pendingPayment");
      
      // Show success dialog
      setShowSuccessDialog(true);
      
    } catch (error) {
      toast.error("Failed to submit measurements. Please try again or contact us.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md mx-auto shadow-glow">
          <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
          <h1 className="text-2xl font-playfair font-bold mb-4 gradient-accent bg-clip-text text-transparent">
            Order Completed!
          </h1>
          <p className="text-muted-foreground mb-6">
            Thank you for your order. We have received your measurements and payment. 
            Our team will contact you within 24 hours to confirm your order details.
          </p>
          <div className="space-y-3">
            <Button onClick={() => navigate("/")} variant="hero" className="w-full">
              Return to Home
            </Button>
            <Button
              onClick={() => window.open("https://wa.me/2348149608006", "_blank")}
              variant="outline"
              className="w-full"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact Us on WhatsApp
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-playfair font-bold gradient-primary bg-clip-text text-transparent">
                  Measurements
                </h1>
                <p className="text-sm text-muted-foreground">Provide your measurements</p>
              </div>
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

      {/* Order Summary */}
      {paymentData && (
        <div className="container mx-auto px-4 py-6">
          <Card className="p-4 bg-gradient-to-r from-accent/10 to-primary/10 border-accent/20">
            <div className="flex items-center gap-4">
              <img
                src={paymentData.design}
                alt={paymentData.itemName}
                className="w-16 h-20 object-cover rounded-lg shadow-medium"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{paymentData.itemName}</h3>
                <p className="text-sm text-muted-foreground">
                  Order #: {paymentData.reference}
                </p>
                <p className="text-sm text-muted-foreground">
                  Customer: {paymentData.name}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold gradient-primary bg-clip-text text-transparent">
                  ₦{paymentData.amount.toLocaleString()}
                </p>
                <p className="text-xs text-success">Payment Confirmed</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Measurements Form */}
      <main className="container mx-auto px-4 pb-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Ruler className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold gradient-secondary bg-clip-text text-transparent">
                Body Measurements
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Please provide accurate measurements in inches or centimeters. 
              Our team will contact you if any clarification is needed.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shirt">Shirt Length</Label>
                <Input
                  id="shirt"
                  value={measurementData.shirt}
                  onChange={(e) => handleInputChange("shirt", e.target.value)}
                  placeholder="e.g., 32 inches"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="trouser">Trouser Length</Label>
                <Input
                  id="trouser"
                  value={measurementData.trouser}
                  onChange={(e) => handleInputChange("trouser", e.target.value)}
                  placeholder="e.g., 42 inches"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hand">Hand/Arm Length</Label>
                <Input
                  id="hand"
                  value={measurementData.hand}
                  onChange={(e) => handleInputChange("hand", e.target.value)}
                  placeholder="e.g., 24 inches"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="neck">Neck Size</Label>
                <Input
                  id="neck"
                  value={measurementData.neck}
                  onChange={(e) => handleInputChange("neck", e.target.value)}
                  placeholder="e.g., 16 inches"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="shoulder">Shoulder Width</Label>
                <Input
                  id="shoulder"
                  value={measurementData.shoulder}
                  onChange={(e) => handleInputChange("shoulder", e.target.value)}
                  placeholder="e.g., 18 inches"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 gradient-accent bg-clip-text text-transparent">
              Style Preferences
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fabricColor">
                  Fabric Color Preference
                </Label>
                <Input
                  id="fabricColor"
                  value={measurementData.fabricColor}
                  onChange={(e) => handleInputChange("fabricColor", e.target.value)}
                  placeholder="e.g., Same as selected style, Navy Blue, etc."
                />
                <p className="text-xs text-muted-foreground">
                  You can request the same color as your selected design or specify a different color
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Special Instructions (Optional)
                </Label>
                <Textarea
                  id="description"
                  value={measurementData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Any special requests, modifications, or additional details..."
                  rows={3}
                />
              </div>
            </div>
          </Card>

          {/* Submit Button */}
          <div className="text-center">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !validateMeasurements()}
              variant="hero"
              size="xl"
              className="w-full"
            >
              {isSubmitting ? (
                "Submitting Order..."
              ) : (
                "Complete Order"
              )}
            </Button>
            
            <p className="text-sm text-muted-foreground mt-4">
              By submitting, you confirm that all measurements and information are accurate. 
              We'll contact you within 24 hours to confirm your order.
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
            Need help with measurements? Contact us: 08149608006
          </Button>
        </div>
      </footer>

      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              Order Successful!
            </AlertDialogTitle>
            <AlertDialogDescription>
              Your measurements have been submitted successfully. We'll contact you within 24 hours to confirm your order. 
              Would you like to return to the home page?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowSuccessDialog(false)}>
              Stay Here
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate("/")}>
              Return Home
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MeasurementPage;