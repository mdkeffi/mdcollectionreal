import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, MessageSquare, Eye } from "lucide-react";
import { toast } from "sonner";

interface KaptanItem {
  id: number;
  name: string;
  image: string;
  priceShort: number;
  priceLong?: number;
}

const kaptanItems: KaptanItem[] = [
  { id: 1, name: "Kaptan 1", image: "https://i.imgur.com/fsdYxPK.jpeg", priceShort: 17000, priceLong: 20000 },
  { id: 2, name: "Kaptan 2", image: "https://i.imgur.com/PJ1LnvI.jpeg", priceShort: 20000, priceLong: 25000 },
  { id: 3, name: "Kaptan 3", image: "https://i.imgur.com/nZgbZfT.jpeg", priceShort: 20000, priceLong: 25000 },
  { id: 4, name: "Kaptan 4", image: "https://i.imgur.com/pa977uJ.jpeg", priceShort: 20000, priceLong: 25000 },
  { id: 5, name: "Kaptan 5", image: "https://i.imgur.com/N8pFXuw.jpeg", priceShort: 20000, priceLong: 25000 },
  { id: 6, name: "Kaptan 6", image: "https://i.imgur.com/fGR07Yb.jpeg", priceShort: 20000, priceLong: 25000 },
  { id: 7, name: "Kaptan 7", image: "https://i.imgur.com/zNFZnyU.jpeg", priceShort: 20000, priceLong: 25000 },
  { id: 8, name: "Kaptan 8", image: "https://i.imgur.com/WMPnozi.jpeg", priceShort: 17000, priceLong: 20000 },
  { id: 9, name: "Kaptan 9", image: "https://i.imgur.com/XCkBqyq.jpeg", priceShort: 17000 },
  { id: 10, name: "Kaptan 10", image: "https://i.imgur.com/8UFOt2B.jpeg", priceShort: 20000, priceLong: 25000 },
  { id: 11, name: "Kaptan 11", image: "https://i.imgur.com/38AevD5.jpeg", priceShort: 20000, priceLong: 25000 },
  { id: 12, name: "Kaptan 12", image: "https://i.imgur.com/72prNqt.jpeg", priceShort: 20000, priceLong: 25000 },
  { id: 13, name: "Kaptan 13", image: "https://i.imgur.com/wUHIw2a.jpeg", priceShort: 20000, priceLong: 25000 },
  { id: 14, name: "Kaptan 14", image: "https://i.imgur.com/CUPoMgY.jpeg", priceShort: 20000, priceLong: 25000 },
  { id: 15, name: "Kaptan 15", image: "https://i.imgur.com/rBmS3QW.jpeg", priceShort: 20000, priceLong: 25000 },
  { id: 16, name: "Kaptan 16", image: "https://i.imgur.com/kz1WBoF.jpeg", priceShort: 20000, priceLong: 25000 },
  { id: 17, name: "Kaptan 17", image: "https://i.imgur.com/dIPts0g.jpeg", priceShort: 20000, priceLong: 25000 },
  { id: 18, name: "Kaptan 18", image: "https://i.imgur.com/IKZG8Dt.jpeg", priceShort: 20000, priceLong: 25000 },
  { id: 19, name: "Kaptan 19", image: "https://i.imgur.com/gKblrBD.jpeg", priceShort: 17000 },
  { id: 20, name: "Kaptan 20", image: "https://i.imgur.com/V7KW32J.jpeg", priceShort: 20000 },
  { id: 21, name: "Kaptan 21", image: "https://i.imgur.com/j7nNDN8.jpeg", priceShort: 17000 },
  { id: 22, name: "Kaptan 22", image: "https://i.imgur.com/8rcURfB.jpeg", priceShort: 20000 },
  { id: 23, name: "Kaptan 23", image: "https://i.imgur.com/xpQVRTA.jpeg", priceShort: 17000 },
  { id: 24, name: "Kaptan 24", image: "https://i.imgur.com/afTCoMM.jpeg", priceShort: 17000, priceLong: 20000 },
  { id: 25, name: "Kaptan 25", image: "https://i.imgur.com/VnezYwh.jpeg", priceShort: 20000, priceLong: 25000 },
  { id: 26, name: "Kaptan 26", image: "https://i.imgur.com/RaTs4CA.jpeg", priceShort: 17000, priceLong: 20000 },
  { id: 27, name: "Kaptan 27", image: "https://i.imgur.com/AMIAksb.jpeg", priceShort: 17000, priceLong: 20000 },
  { id: 28, name: "Kaptan 28", image: "https://i.imgur.com/UO7pQYl.jpeg", priceShort: 17000, priceLong: 20000 },
  { id: 29, name: "Kaptan 29", image: "https://i.imgur.com/K9Q0AxJ.jpeg", priceShort: 17000, priceLong: 20000 },
  { id: 30, name: "Kaptan 30", image: "https://i.imgur.com/dp3yYdh.jpeg", priceShort: 17000, priceLong: 20000 },
  { id: 31, name: "Kaptan 31", image: "https://i.imgur.com/FYR1WTJ.jpeg", priceShort: 20000, priceLong: 25000 },
  { id: 32, name: "Kaptan 32", image: "https://i.imgur.com/NyQJ6oF.jpeg", priceLong: 28000, priceShort: 0 },
  { id: 33, name: "Kaptan 33", image: "https://i.imgur.com/D2Ad3x4.jpeg", priceShort: 21000, priceLong: 26000 },
  { id: 34, name: "Kaptan 34", image: "https://i.imgur.com/pKYZmdb.jpeg", priceShort: 20000, priceLong: 25000 },
  { id: 35, name: "Kaptan 35", image: "https://i.imgur.com/c8dZrhp.jpeg", priceShort: 20000, priceLong: 25000 },
  { id: 36, name: "Kaptan 36", image: "https://i.imgur.com/ES2L878.jpeg", priceShort: 20000, priceLong: 25000 }
];

const KaptansPage = () => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<KaptanItem | null>(null);
  const [showBuyPopup, setShowBuyPopup] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [fullImageSrc, setFullImageSrc] = useState("");

  useEffect(() => {
    // Check for pending order and show resume option
    const pendingOrder = localStorage.getItem("kaptansOrder");
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

  const openBuyPopup = (item: KaptanItem) => {
    setSelectedItem(item);
    setShowBuyPopup(true);
  };

  const selectOption = (sleeve: "short" | "long") => {
    if (!selectedItem) return;

    const price = sleeve === "short" ? selectedItem.priceShort : selectedItem.priceLong;
    
    if (!price) {
      toast.error("This option is not available for this item");
      return;
    }

    const orderData = {
      item: selectedItem,
      sleeve,
      price,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem("kaptansOrder", JSON.stringify(orderData));
    setShowBuyPopup(false);
    
    navigate(`/payment?design=${encodeURIComponent(selectedItem.image)}&name=${encodeURIComponent(selectedItem.name)}&amount=${price}&sleeve=${sleeve}&type=kaptan`);
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
                MD Kaptans Collection
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
            Choose between short (short sleeve) or long (long sleeve). Prices vary based on style.
          </p>
        </div>
      </header>

      {/* Items Grid */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {kaptanItems.map((item) => (
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
                <div className="space-y-1 text-xs">
                  {item.priceShort > 0 && (
                    <div className="flex justify-between">
                      <span>Short:</span>
                      <span className="font-semibold">{formatPrice(item.priceShort)}</span>
                    </div>
                  )}
                  {item.priceLong && (
                    <div className="flex justify-between">
                      <span>Long:</span>
                      <span className="font-semibold">{formatPrice(item.priceLong)}</span>
                    </div>
                  )}
                </div>
                <Button 
                  onClick={() => openBuyPopup(item)}
                  className="w-full"
                  variant="hero"
                  size="sm"
                >
                  Buy This
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
            Send your style via WhatsApp
          </Button>
        </div>
      </footer>

      {/* Buy Options Popup */}
      <Dialog open={showBuyPopup} onOpenChange={setShowBuyPopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center gradient-accent bg-clip-text text-transparent">
              Choose Option
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
                </div>
                <div className="space-y-2">
                  {selectedItem.priceShort > 0 && (
                    <Button
                      onClick={() => selectOption("short")}
                      variant="hero"
                      className="w-full justify-between"
                    >
                      <span>Short Sleeve</span>
                      <span>{formatPrice(selectedItem.priceShort)}</span>
                    </Button>
                  )}
                  {selectedItem.priceLong && (
                    <Button
                      onClick={() => selectOption("long")}
                      variant="shop"
                      className="w-full justify-between"
                    >
                      <span>Long Sleeve</span>
                      <span>{formatPrice(selectedItem.priceLong)}</span>
                    </Button>
                  )}
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

export default KaptansPage;