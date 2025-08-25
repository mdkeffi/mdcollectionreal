import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, MessageSquare, Eye } from "lucide-react";
import { toast } from "sonner";

interface AgbadaItem {
  id: number;
  name: string;
  image: string;
  price: number;
}

const agbadaItems: AgbadaItem[] = [
  { id: 1, name: "Agbada 1", image: "https://i.imgur.com/sI4O9jO.jpeg", price: 35000 },
  { id: 2, name: "Agbada 2", image: "https://i.imgur.com/di0GayQ.jpeg", price: 35000 },
  { id: 3, name: "Agbada 3", image: "https://i.imgur.com/mO0qA0N.jpeg", price: 35000 },
  { id: 4, name: "Agbada 4", image: "https://i.imgur.com/qMB38em.jpeg", price: 35000 },
  { id: 5, name: "Agbada 5", image: "https://i.imgur.com/MltE3Xz.jpeg", price: 35000 },
  { id: 6, name: "Agbada 6", image: "https://i.imgur.com/HP8KH5P.jpeg", price: 35000 },
  { id: 7, name: "Agbada 7", image: "https://i.imgur.com/je0jf4H.jpeg", price: 35000 },
  { id: 8, name: "Agbada 8", image: "https://i.imgur.com/PTsXbMm.jpeg", price: 35000 },
  { id: 9, name: "Agbada 9", image: "https://i.imgur.com/D1i90CI.jpeg", price: 35000 },
  { id: 10, name: "Agbada 10", image: "https://i.imgur.com/0moVcXI.jpeg", price: 35000 },
  { id: 11, name: "Agbada 11", image: "https://i.imgur.com/7p29ZrB.jpeg", price: 35000 },
  { id: 12, name: "Agbada 12", image: "https://i.imgur.com/I77I5Ck.jpeg", price: 35000 },
  { id: 13, name: "Agbada 13", image: "https://i.imgur.com/Y3OdlRt.jpeg", price: 35000 },
  { id: 14, name: "Agbada 14", image: "https://i.imgur.com/fAHk1pq.jpeg", price: 35000 },
  { id: 15, name: "Agbada 15", image: "https://i.imgur.com/dHtWwiV.jpeg", price: 35000 },
  { id: 16, name: "Agbada 16", image: "https://i.imgur.com/8wQbEyj.jpeg", price: 35000 },
  { id: 17, name: "Agbada 17", image: "https://i.imgur.com/RHAFkru.jpeg", price: 35000 },
  { id: 18, name: "Agbada 18", image: "https://i.imgur.com/TVoc0H7.jpeg", price: 35000 },
  { id: 19, name: "Agbada 19", image: "https://i.imgur.com/FPJ8OYK.jpeg", price: 35000 },
  { id: 20, name: "Agbada 20", image: "https://i.imgur.com/Ej0XX5O.jpeg", price: 35000 },
  { id: 21, name: "Agbada 21", image: "https://i.imgur.com/tKHtdq5.jpeg", price: 35000 },
  { id: 22, name: "Agbada 22", image: "https://i.imgur.com/GYfZ6cb.jpeg", price: 35000 },
  { id: 23, name: "Agbada 23", image: "https://i.imgur.com/l28eUfx.jpeg", price: 35000 },
  { id: 24, name: "Agbada 24", image: "https://i.imgur.com/2TngrLC.jpeg", price: 35000 },
  { id: 25, name: "Agbada 25", image: "https://i.imgur.com/Mn2YWUp.jpeg", price: 35000 },
  { id: 26, name: "Agbada 26", image: "https://i.imgur.com/taRe601.jpeg", price: 35000 },
  { id: 27, name: "Agbada 27", image: "https://i.imgur.com/IAWPzqZ.jpeg", price: 35000 },
  { id: 28, name: "Agbada 28", image: "https://i.imgur.com/Kr9hXQQ.jpeg", price: 35000 },
  { id: 29, name: "Agbada 29", image: "https://i.imgur.com/eAPiFH8.jpeg", price: 35000 },
  { id: 30, name: "Agbada 30", image: "https://i.imgur.com/MuviFgu.jpeg", price: 35000 },
  { id: 31, name: "Agbada 31", image: "https://i.imgur.com/xY96WCe.jpeg", price: 35000 },
  { id: 32, name: "Agbada 32", image: "https://i.imgur.com/60aTCqW.jpeg", price: 35000 }
];

const AgbadaPage = () => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<AgbadaItem | null>(null);
  const [showBuyPopup, setShowBuyPopup] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [fullImageSrc, setFullImageSrc] = useState("");

  useEffect(() => {
    // Check for pending order and show resume option
    const pendingOrder = localStorage.getItem("agbadaOrder");
    if (pendingOrder) {
      toast.info("You have a pending order. You can continue from where you left off.");
    }
  }, []);

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const openFullImage = (imageSrc: string) => {
    setFullImageSrc(imageSrc);
    setShowFullImage(true);
  };

  const openBuyPopup = (item: AgbadaItem) => {
    setSelectedItem(item);
    setShowBuyPopup(true);
  };

  const confirmPurchase = () => {
    if (!selectedItem) return;

    const orderData = {
      item: selectedItem,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem("agbadaOrder", JSON.stringify(orderData));
    setShowBuyPopup(false);
    
    navigate(`/payment?design=${encodeURIComponent(selectedItem.image)}&name=${encodeURIComponent(selectedItem.name)}&amount=${selectedItem.price}&type=agbada`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b shadow-soft">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-playfair font-bold gradient-primary bg-clip-text text-transparent">
                MD Agbada (Babban Riga) Collection
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
          <p className="text-sm text-muted-foreground mt-2">
            Premium traditional Agbada and Babban Riga designs crafted with excellence.
          </p>
        </div>
      </header>

      {/* Items Grid */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {agbadaItems.map((item) => (
            <Card key={item.id} className="group hover:shadow-large transition-all duration-300 overflow-hidden">
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={() => openFullImage(item.image)}
                  className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
              <div className="p-4 space-y-3">
                <h3 className="font-semibold text-sm">{item.name}</h3>
                <div className="text-center">
                  <span className="text-lg font-bold gradient-accent bg-clip-text text-transparent">
                    {formatPrice(item.price)}
                  </span>
                </div>
                <Button 
                  onClick={() => openBuyPopup(item)}
                  className="w-full"
                  variant="hero"
                  size="sm"
                >
                  Buy Now
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-8 px-4 mt-12">
        <div className="container mx-auto text-center space-y-4">
          <p>Didn't find your preferred style?</p>
          <Button
            variant="ghost"
            onClick={() => window.open("https://wa.me/2348149608006", "_blank")}
            className="text-accent hover:text-accent/80"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat us on WhatsApp
          </Button>
        </div>
      </footer>

      {/* Buy Confirmation Popup */}
      <Dialog open={showBuyPopup} onOpenChange={setShowBuyPopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center gradient-accent bg-clip-text text-transparent">
              Confirm Purchase
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-4">
            {selectedItem && (
              <>
                <div className="text-center">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    className="w-24 h-32 object-cover rounded-lg mx-auto mb-2"
                  />
                  <h3 className="font-semibold">{selectedItem.name}</h3>
                  <p className="text-lg font-bold gradient-accent bg-clip-text text-transparent">
                    {formatPrice(selectedItem.price)}
                  </p>
                </div>
                <p className="text-center text-muted-foreground">
                  Are you sure you want to purchase this item?
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={confirmPurchase}
                    variant="hero"
                    className="flex-1"
                  >
                    Yes, Continue
                  </Button>
                  <Button
                    onClick={() => setShowBuyPopup(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Full Image View */}
      <Dialog open={showFullImage} onOpenChange={setShowFullImage}>
        <DialogContent className="sm:max-w-4xl p-2">
          <img
            src={fullImageSrc}
            alt="Full view"
            className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgbadaPage;