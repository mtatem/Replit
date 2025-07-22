import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  Key, 
  Atom, 
  Users, 
  Cpu, 
  Eye, 
  EyeOff, 
  Smartphone, 
  Lock, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Security() {
  const { toast } = useToast();
  const [showRecovery, setShowRecovery] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const securityFeatures = [
    {
      title: "Passkey Authentication",
      description: "Biometric and hardware security keys for passwordless authentication",
      icon: Key,
      status: "active",
      color: "from-green-500 to-emerald-500",
      setupProgress: 100,
      details: "Face ID, Touch ID, and hardware keys enabled",
    },
    {
      title: "Quantum Encryption",
      description: "Post-quantum cryptography protection against future quantum computers",
      icon: Atom,
      status: "active",
      color: "from-blue-500 to-purple-500",
      setupProgress: 100,
      details: "Lattice-based encryption algorithms active",
    },
    {
      title: "Multi-Signature Wallet",
      description: "Require multiple approvals for high-value transactions",
      icon: Users,
      status: "setup",
      color: "from-orange-500 to-red-500",
      setupProgress: 0,
      details: "Configure multiple signing keys for enhanced security",
    },
    {
      title: "Hardware Wallet Integration",
      description: "Connect Ledger, Trezor, or other hardware security devices",
      icon: Cpu,
      status: "partial",
      color: "from-gray-500 to-gray-700",
      setupProgress: 50,
      details: "1 device connected, configure backup device",
    },
  ];

  const securityScore = 85;
  
  const recentActivity = [
    { action: "Passkey authentication", location: "New York, US", time: "2 minutes ago", status: "success" },
    { action: "Password change attempt", location: "Unknown location", time: "1 hour ago", status: "blocked" },
    { action: "Hardware wallet connected", location: "New York, US", time: "3 hours ago", status: "success" },
    { action: "Multi-sig setup initiated", location: "New York, US", time: "1 day ago", status: "pending" },
  ];

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Password updated successfully",
    });
    
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handlePasskeySetup = () => {
    toast({
      title: "Passkey Setup",
      description: "Please use your device's biometric authentication",
    });
  };

  const handleHardwareWalletConnect = () => {
    toast({
      title: "Hardware Wallet",
      description: "Please connect your hardware wallet",
    });
  };

  return (
    <div className="p-6 space-y-8">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-crypto-blue/20 to-crypto-green/20 border-crypto-blue/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Security Score</h3>
              <Shield className="h-5 w-5 text-crypto-blue" />
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-neon-green">{securityScore}/100</p>
              <Progress value={securityScore} className="h-2" />
              <p className="text-sm text-gray-400">Excellent security level</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-dark-surface border-dark-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Active Protections</h3>
              <CheckCircle className="h-5 w-5 text-neon-green" />
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-neon-green">4</p>
              <p className="text-sm text-gray-400">Security features enabled</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-dark-surface border-dark-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Threats Blocked</h3>
              <AlertTriangle className="h-5 w-5 text-neon-orange" />
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-neon-orange">247</p>
              <p className="text-sm text-gray-400">This month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="features" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-dark-surface">
          <TabsTrigger value="features">Security Features</TabsTrigger>
          <TabsTrigger value="authentication">Authentication</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
          <TabsTrigger value="settings">Advanced Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-6">
          {/* Security Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {securityFeatures.map((feature) => {
              const Icon = feature.icon;
              
              return (
                <Card key={feature.title} className="bg-dark-surface border-dark-border">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{feature.title}</h4>
                          <p className="text-sm text-gray-400">{feature.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {feature.status === "active" ? (
                          <Badge variant="secondary" className="bg-neon-green/20 text-neon-green">
                            Active
                          </Badge>
                        ) : feature.status === "partial" ? (
                          <Badge variant="secondary" className="bg-warning-yellow/20 text-warning-yellow">
                            Partial
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-gray-500/20 text-gray-500">
                            Setup Required
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Setup Progress</span>
                        <span>{feature.setupProgress}%</span>
                      </div>
                      <Progress value={feature.setupProgress} className="h-2" />
                      <p className="text-sm text-gray-400">{feature.details}</p>
                    </div>
                    
                    <div className="mt-4">
                      {feature.status === "active" ? (
                        <Button variant="outline" size="sm" className="w-full border-dark-border">
                          <Settings className="w-4 h-4 mr-2" />
                          Configure
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          className="w-full bg-gradient-to-r from-crypto-blue to-crypto-green"
                          onClick={feature.title === "Hardware Wallet Integration" ? handleHardwareWalletConnect : undefined}
                        >
                          {feature.status === "partial" ? "Complete Setup" : "Set Up Now"}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="authentication" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Passkey Management */}
            <Card className="bg-dark-surface border-dark-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Key className="h-5 w-5" />
                  <span>Passkey Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { name: "MacBook Pro Touch ID", type: "Biometric", added: "2 days ago", active: true },
                    { name: "iPhone Face ID", type: "Biometric", added: "1 week ago", active: true },
                    { name: "YubiKey 5 NFC", type: "Hardware", added: "2 weeks ago", active: false },
                  ].map((passkey, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-dark-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${passkey.active ? 'bg-neon-green' : 'bg-gray-500'} rounded-full flex items-center justify-center`}>
                          {passkey.type === "Biometric" ? <Smartphone className="w-5 h-5" /> : <Key className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-medium">{passkey.name}</p>
                          <p className="text-sm text-gray-400">{passkey.type} • Added {passkey.added}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {passkey.active && (
                          <Badge variant="secondary" className="bg-neon-green/20 text-neon-green text-xs">
                            Active
                          </Badge>
                        )}
                        <Button variant="ghost" size="sm">
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button 
                  onClick={handlePasskeySetup}
                  className="w-full bg-gradient-to-r from-crypto-blue to-crypto-green"
                >
                  Add New Passkey
                </Button>
              </CardContent>
            </Card>

            {/* Password Security */}
            <Card className="bg-dark-surface border-dark-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="h-5 w-5" />
                  <span>Password Security</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="bg-dark-bg border-dark-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-dark-bg border-dark-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-dark-bg border-dark-border"
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={handlePasswordChange}
                  disabled={!currentPassword || !newPassword || !confirmPassword}
                  className="w-full"
                >
                  Update Password
                </Button>

                <div className="pt-4 border-t border-dark-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Recovery Phrase</p>
                      <p className="text-sm text-gray-400">Backup your wallet recovery phrase</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowRecovery(!showRecovery)}
                      className="border-dark-border"
                    >
                      {showRecovery ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {showRecovery && (
                    <Alert className="mt-3 border-warning-yellow/30 bg-warning-yellow/10">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-warning-yellow">
                        Keep your recovery phrase secure. Anyone with access to it can control your wallet.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card className="bg-dark-surface border-dark-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Recent Security Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-dark-border rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 ${
                        activity.status === 'success' ? 'bg-profit-green' : 
                        activity.status === 'blocked' ? 'bg-loss-red' : 'bg-warning-yellow'
                      } rounded-full flex items-center justify-center`}>
                        {activity.status === 'success' ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : activity.status === 'blocked' ? (
                          <AlertTriangle className="w-5 h-5 text-white" />
                        ) : (
                          <Clock className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-gray-400">{activity.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant="secondary" 
                        className={`${
                          activity.status === 'success' ? 'bg-profit-green/20 text-profit-green' : 
                          activity.status === 'blocked' ? 'bg-loss-red/20 text-loss-red' : 
                          'bg-warning-yellow/20 text-warning-yellow'
                        }`}
                      >
                        {activity.status}
                      </Badge>
                      <p className="text-sm text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-dark-surface border-dark-border">
              <CardHeader>
                <CardTitle>Login Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-400">Additional security layer for login</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Login Notifications</p>
                    <p className="text-sm text-gray-400">Get notified of new device logins</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto Lock</p>
                    <p className="text-sm text-gray-400">Lock wallet after inactivity</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label>Auto Lock Timeout (minutes)</Label>
                  <Input type="number" defaultValue="15" className="bg-dark-bg border-dark-border" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-dark-surface border-dark-border">
              <CardHeader>
                <CardTitle>Transaction Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Transaction Confirmations</p>
                    <p className="text-sm text-gray-400">Require confirmation for all transactions</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Large Transaction Alerts</p>
                    <p className="text-sm text-gray-400">Alert for transactions above threshold</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label>Large Transaction Threshold (USD)</Label>
                  <Input type="number" defaultValue="1000" className="bg-dark-bg border-dark-border" />
                </div>
                <div className="space-y-2">
                  <Label>Daily Transaction Limit (USD)</Label>
                  <Input type="number" defaultValue="50000" className="bg-dark-bg border-dark-border" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
