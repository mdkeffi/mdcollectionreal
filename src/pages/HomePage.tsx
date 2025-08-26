import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageSquare, Phone } from "lucide-react";
import { toast } from "sonner";

const SHEETDB_ENDPOINT = "https://sheetdb.io/api/v1/tl4p36fvtpr2f";

interface CEOInfo {
  name: string;
  title: string;
  description: string;
  phone: string;
  imageUrl: string;
}

const ceoInfo: CEOInfo = {
  name: "Muhammad Muhammad",
  title: "CEO of MD Caps and Clothing Keffi",
  description: "Muhammad Muhammad, the CEO of MD Caps and Clothing Keffi, is dedicated to creating stylish, high-quality clothing that celebrates both tradition and modern fashion. With a focus on innovation and customer satisfaction, he strives to make every client look and feel their best.",
  phone: "08149608006",
  imageUrl: "https://i.imgur.com/QCBXm5d.jpeg"
};

const heroImages = [
  "https://i.imgur.com/72prNqt.jpeg",
  "https://i.imgur.com/D2Ad3x4.jpeg", 
  "https://i.imgur.com/wUHIw2a.jpeg"
];

const agbadaImages = [
  "https://i.imgur.com/qMB38em.jpeg",
  "https://i.imgur.com/PTsXbMm.jpeg",
  "https://i.imgur.com/jtpmIb6.jpeg",
  "https://i.imgur.com/MltE3Xz.jpeg",
  "https://i.imgur.com/HP8KH5P.jpeg"
];

const HomePage = () => {
  const navigate = useNavigate();
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [showCeoPopup, setShowCeoPopup] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [logoColorIndex, setLogoColorIndex] = useState(0);
  const [showContinueOrder, setShowContinueOrder] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<any>(null);

  // Initialize component
  useEffect(() => {
    const savedName = localStorage.getItem("customerName");
    if (!savedName) {
      setShowWelcomePopup(true);
    } else {
      setCustomerName(savedName);
    }

    // Check for pending orders
    const pendingPayment = localStorage.getItem("pendingPayment");
    const kaptansOrder = localStorage.getItem("kaptansOrder");
    const agbadaOrder = localStorage.getItem("agbadaOrder");
    
    if (pendingPayment || kaptansOrder || agbadaOrder) {
      try {
        const orderData = pendingPayment ? JSON.parse(pendingPayment) : 
                         kaptansOrder ? JSON.parse(kaptansOrder) : 
                         agbadaOrder ? JSON.parse(agbadaOrder) : null;
        if (orderData) {
          setPendingOrder(orderData);
          setShowContinueOrder(true);
        }
      } catch (error) {
        console.error("Error parsing pending order:", error);
      }
    }

    // Update clock every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Hero image rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Logo color rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setLogoColorIndex((prev) => (prev + 1) % 2);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit', 
      second: '2-digit'
    });
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

  const handleWelcomeSubmit = async () => {
    if (!customerName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    localStorage.setItem("customerName", customerName);
    setShowWelcomePopup(false);

    // Send customer entry data to sheets
    await sendDataToSheets({
      event_type: "customer_entry",
      customer_name: customerName,
      page: "homepage",
      timestamp: new Date().toISOString()
    });

    toast.success(`Welcome, ${customerName}!`);
  };

  const handleShopKaptans = async () => {
    // Send interaction data to sheets
    await sendDataToSheets({
      event_type: "navigation",
      customer_name: customerName,
      action: "shop_kaptans",
      page: "homepage",
      timestamp: new Date().toISOString()
    });
    navigate("/kaptans");
  };

  const handleShopAgbada = async () => {
    // Send interaction data to sheets
    await sendDataToSheets({
      event_type: "navigation", 
      customer_name: customerName,
      action: "shop_agbada",
      page: "homepage",
      timestamp: new Date().toISOString()
    });
    navigate("/agbada");
  };

  const handleContactCEO = () => {
    window.open(`https://wa.me/234${ceoInfo.phone}`, "_blank");
  };

  const continueOrder = () => {
    if (pendingOrder) {
      // If there's a pending payment, go to payment page
      const pendingPayment = localStorage.getItem("pendingPayment");
      if (pendingPayment) {
        navigate("/payment");
        return;
      }
      
      // Navigate based on order type
      if (pendingOrder.type === "kaptan") {
        navigate("/kaptans");
      } else if (pendingOrder.type === "agbada") {
        navigate("/agbada");
      } else {
        navigate("/payment");
      }
    }
  };

  const cancelPendingOrder = () => {
    localStorage.removeItem("pendingPayment");
    localStorage.removeItem("kaptansOrder");
    localStorage.removeItem("agbadaOrder");
    setShowContinueOrder(false);
    setPendingOrder(null);
    toast.success("Order cancelled");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Continue Order Banner */}
      {showContinueOrder && (
        <div className="bg-gradient-to-r from-accent to-primary text-white py-2 px-4 text-center relative">
          <div className="flex items-center justify-center gap-4 text-sm font-medium">
            <span>You have a pending order</span>
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={continueOrder}
              className="h-6 text-xs"
            >
              Continue Order
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={cancelPendingOrder}
              className="h-6 text-xs"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b shadow-soft">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="https://i.imgur.com/ShFIWdI.png" 
                alt="MD Logo" 
                className={`h-12 w-12 rounded-full shadow-medium transition-all duration-500 ${
                  logoColorIndex === 0 ? 'filter-none' : 'filter grayscale invert'
                }`}
              />
              <div>
                <h1 className="text-xl font-bold gradient-primary bg-clip-text text-transparent">
                  MD Caps & Clothing
                </h1>
                <p className="text-xs text-muted-foreground">Keffi, Nasarawa State</p>
              </div>
            </div>
            
            <nav className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowCeoPopup(true)}>
                <span className="hidden sm:inline">About CEO</span>
                <span className="sm:hidden">CEO</span>
              </Button>
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => window.open(`https://wa.me/234${ceoInfo.phone}`, "_blank")}
              >
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Contact</span>
              </Button>
            </nav>
          </div>
          
          <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
            <span>Welcome {customerName || "Guest"}</span>
            <span>{formatTime(currentTime)}</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90 z-10" />
        {heroImages.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Hero ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentHeroIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        
        <div className="relative z-20 h-full flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-4 text-glow">
              MD Caps & Clothing
            </h1>
            <p className="text-lg md:text-xl mb-8 font-light">
              Traditional Excellence, Modern Style
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="hero" 
                size="xl"
                onClick={handleShopKaptans}
                className="animate-slide-up"
              >
                🛍️ Shop Kaptans
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Company Message */}
      <section className="py-12 px-4">
        <div className="container mx-auto text-center">
          <Card className="p-8 shadow-large border-accent/20">
            <h2 className="text-2xl md:text-3xl font-playfair mb-4 gradient-accent bg-clip-text text-transparent">
              Traditional Excellence, Modern Style
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We specialize in creating high-quality traditional Nigerian clothing including 
              Kaptans, Agbada, and Babban Riga with modern craftsmanship and attention to detail.
            </p>
          </Card>
        </div>
      </section>

      {/* Agbada Showcase */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-playfair text-center mb-8 gradient-secondary bg-clip-text text-transparent">
            Agbada Collection
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 mb-8">
            {agbadaImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Agbada ${index + 1}`}
                className="h-48 w-36 object-cover rounded-xl shadow-medium hover:shadow-large transition-shadow cursor-pointer flex-shrink-0"
              />
            ))}
          </div>
          <div className="text-center">
            <Button variant="shop" size="lg" onClick={handleShopAgbada}>
              🛒 Shop Agbada Collection
            </Button>
          </div>
        </div>
      </section>

      {/* Caps Collection */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-playfair text-center mb-8 gradient-accent bg-clip-text text-transparent">
            Caps Collection
          </h2>
          <div className="flex gap-6 justify-center items-center mb-8">
            <div className="relative">
              <img
                src="https://i.imgur.com/5lWiyPc.jpeg"
                alt="Cap Style 1"
                className="h-48 w-48 object-cover rounded-xl shadow-medium hover:shadow-large transition-all cursor-pointer"
                onClick={() => window.open("https://wa.me/2348149608006", "_blank")}
              />
            </div>
            <div className="relative">
              <img
                src="https://i.imgur.com/94mEN77.jpeg"
                alt="Cap Style 2"
                className="h-48 w-48 object-cover rounded-xl shadow-medium hover:shadow-large transition-all cursor-pointer"
                onClick={() => window.open("https://wa.me/2348149608006", "_blank")}
              />
            </div>
          </div>
          <div className="text-center">
            <Button 
              variant="hero" 
              size="lg" 
              onClick={() => window.open("https://wa.me/2348149608006", "_blank")}
            >
              🧢 Order Caps via WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open(`https://wa.me/234${ceoInfo.phone}`, "_blank")}
              className="text-accent hover:text-accent/80"
            >
              <MessageSquare className="h-6 w-6" />
            </Button>
          </div>
          <p>&copy; 2025 MD Caps and Clothing. All rights reserved.</p>
        </div>
      </footer>

      {/* Welcome Popup */}
      <Dialog open={showWelcomePopup} onOpenChange={setShowWelcomePopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl gradient-primary bg-clip-text text-transparent">
              Welcome!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-4">
            <p className="text-center text-muted-foreground mb-4">
              This is the official website of MD Caps and Clothing Keffi
            </p>
            <p className="text-center text-muted-foreground">
              Please enter your name to continue
            </p>
            <div className="space-y-2">
              <Label htmlFor="customerName">Your Name</Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your full name"
                onKeyPress={(e) => e.key === "Enter" && handleWelcomeSubmit()}
              />
            </div>
            <Button 
              onClick={handleWelcomeSubmit} 
              className="w-full" 
              variant="hero"
              disabled={!customerName.trim()}
            >
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* CEO Info Popup */}
      <Dialog open={showCeoPopup} onOpenChange={setShowCeoPopup}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl gradient-accent bg-clip-text text-transparent">
              About the CEO
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 p-4">
            <div className="text-center">
              <img
                src={ceoInfo.imageUrl}
                alt={ceoInfo.name}
                className="w-32 h-32 mx-auto rounded-full shadow-glow object-cover mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">{ceoInfo.name}</h3>
              <p className="text-primary font-medium mb-4">{ceoInfo.title}</p>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {ceoInfo.description}
            </p>
            <div className="flex gap-3 justify-center">
              <Button 
                variant="hero" 
                onClick={handleContactCEO}
                className="flex items-center gap-2"
              >
                <Phone className="h-4 w-4" />
                Contact CEO: {ceoInfo.phone}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomePage;