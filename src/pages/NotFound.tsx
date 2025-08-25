import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, MessageSquare } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="p-8 text-center max-w-md mx-auto shadow-large">
        <div className="mb-6">
          <h1 className="text-6xl font-playfair font-bold gradient-primary bg-clip-text text-transparent mb-4">
            404
          </h1>
          <h2 className="text-xl font-semibold mb-2">Page Not Found</h2>
          <p className="text-muted-foreground">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-3">
          <Button 
            onClick={() => navigate("/")}
            variant="hero" 
            size="lg"
            className="w-full"
          >
            <Home className="h-4 w-4 mr-2" />
            Return to Home
          </Button>
          
          <Button 
            onClick={() => window.open("https://wa.me/2348149608006", "_blank")}
            variant="outline"
            size="lg"
            className="w-full"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Contact Support
          </Button>
        </div>
        
        <div className="mt-8 pt-6 border-t">
          <img 
            src="https://i.imgur.com/ShFIWdI.png" 
            alt="MD Logo" 
            className="h-12 w-12 mx-auto rounded-full shadow-medium mb-2"
          />
          <p className="text-sm text-muted-foreground">
            MD Caps and Clothing Keffi
          </p>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;
