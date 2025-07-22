import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Key, Atom, Users, Cpu } from "lucide-react";

interface SecurityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SecurityModal({ open, onOpenChange }: SecurityModalProps) {
  const securityFeatures = [
    {
      title: "Passkey Authentication",
      description: "Biometric and hardware security",
      icon: Key,
      status: "active",
      color: "from-green-500 to-emerald-500",
      action: null,
    },
    {
      title: "Quantum Encryption",
      description: "Post-quantum cryptography protection",
      icon: Atom,
      status: "active",
      color: "from-blue-500 to-purple-500",
      action: null,
    },
    {
      title: "Multi-Signature Wallet",
      description: "Require multiple approvals for transactions",
      icon: Users,
      status: "setup",
      color: "from-orange-500 to-red-500",
      action: "Setup",
    },
    {
      title: "Hardware Wallet Integration",
      description: "Connect Ledger, Trezor, or other devices",
      icon: Cpu,
      status: "connect",
      color: "from-gray-500 to-gray-700",
      action: "Connect",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-dark-surface border-dark-border max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Security Features</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {securityFeatures.map((feature) => {
            const Icon = feature.icon;
            
            return (
              <Card key={feature.title} className="border-dark-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{feature.title}</h4>
                        <p className="text-sm text-gray-400">{feature.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {feature.status === "active" ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
                          <Badge variant="secondary" className="bg-neon-green/20 text-neon-green">
                            Active
                          </Badge>
                        </div>
                      ) : (
                        <Button 
                          size="sm"
                          variant={feature.status === "setup" ? "default" : "outline"}
                          className={feature.status === "setup" ? "bg-crypto-blue" : "border-dark-border"}
                        >
                          {feature.action}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="mt-6">
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full bg-gradient-to-r from-crypto-blue to-crypto-green"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
