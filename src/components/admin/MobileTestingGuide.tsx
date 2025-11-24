import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import QRCode from "qrcode";
import { useEffect } from "react";

interface TestItem {
  id: string;
  device: 'iPhone' | 'Android';
  item: string;
  checked: boolean;
}

export const MobileTestingGuide = () => {
  const [qrCode, setQrCode] = useState<string>("");
  const [items, setItems] = useState<TestItem[]>([
    { id: "iphone-layout", device: "iPhone", item: "Responsive layout renders correctly", checked: false },
    { id: "iphone-navigation", device: "iPhone", item: "Navigation menu works", checked: false },
    { id: "iphone-forms", device: "iPhone", item: "Forms and inputs are usable", checked: false },
    { id: "iphone-images", device: "iPhone", item: "Images load and display properly", checked: false },
    { id: "android-layout", device: "Android", item: "Responsive layout renders correctly", checked: false },
    { id: "android-navigation", device: "Android", item: "Navigation menu works", checked: false },
    { id: "android-forms", device: "Android", item: "Forms and inputs are usable", checked: false },
    { id: "android-images", device: "Android", item: "Images load and display properly", checked: false }
  ]);

  useEffect(() => {
    const generateQR = async () => {
      try {
        const url = window.location.origin;
        const qr = await QRCode.toDataURL(url, {
          width: 256,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        });
        setQrCode(qr);
      } catch (err) {
        console.error("Failed to generate QR code");
      }
    };
    generateQR();
  }, []);

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const saveProgress = async () => {
    try {
      const iPhoneComplete = items.filter(i => i.device === 'iPhone').every(i => i.checked);
      const androidComplete = items.filter(i => i.device === 'Android').every(i => i.checked);

      await Promise.all([
        supabase.from('production_test_status').upsert({
          test_category: 'Mobile',
          test_item: 'Test on iPhone',
          status: iPhoneComplete ? 'pass' : 'pending',
          notes: JSON.stringify(items.filter(i => i.device === 'iPhone')),
          completed_by: (await supabase.auth.getUser()).data.user?.id,
          completed_at: iPhoneComplete ? new Date().toISOString() : null
        }),
        supabase.from('production_test_status').upsert({
          test_category: 'Mobile',
          test_item: 'Test on Android',
          status: androidComplete ? 'pass' : 'pending',
          notes: JSON.stringify(items.filter(i => i.device === 'Android')),
          completed_by: (await supabase.auth.getUser()).data.user?.id,
          completed_at: androidComplete ? new Date().toISOString() : null
        })
      ]);

      toast.success("Progress saved!");
    } catch (error: any) {
      toast.error("Failed to save: " + error.message);
    }
  };

  const iPhoneProgress = (items.filter(i => i.device === 'iPhone' && i.checked).length / items.filter(i => i.device === 'iPhone').length) * 100;
  const androidProgress = (items.filter(i => i.device === 'Android' && i.checked).length / items.filter(i => i.device === 'Android').length) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          Mobile Testing Guide
        </CardTitle>
        <CardDescription>
          Test responsive design on actual devices
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {qrCode && (
          <div className="flex flex-col items-center space-y-3 p-4 border rounded-lg bg-card">
            <img src={qrCode} alt="QR Code" className="w-48 h-48" />
            <p className="text-sm text-muted-foreground text-center">
              Scan this QR code with your phone to access the app
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">iPhone Testing</h3>
            <Badge variant={iPhoneProgress === 100 ? "default" : "outline"}>
              {Math.round(iPhoneProgress)}%
            </Badge>
          </div>
          <div className="space-y-2">
            {items.filter(i => i.device === 'iPhone').map((item) => (
              <div key={item.id} className="flex items-center space-x-3 p-2 rounded-lg border">
                <Checkbox
                  id={item.id}
                  checked={item.checked}
                  onCheckedChange={() => toggleItem(item.id)}
                />
                <label htmlFor={item.id} className="text-sm cursor-pointer flex-1">
                  {item.item}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Android Testing</h3>
            <Badge variant={androidProgress === 100 ? "default" : "outline"}>
              {Math.round(androidProgress)}%
            </Badge>
          </div>
          <div className="space-y-2">
            {items.filter(i => i.device === 'Android').map((item) => (
              <div key={item.id} className="flex items-center space-x-3 p-2 rounded-lg border">
                <Checkbox
                  id={item.id}
                  checked={item.checked}
                  onCheckedChange={() => toggleItem(item.id)}
                />
                <label htmlFor={item.id} className="text-sm cursor-pointer flex-1">
                  {item.item}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={saveProgress} className="w-full">
          Save Progress
        </Button>
      </CardContent>
    </Card>
  );
};