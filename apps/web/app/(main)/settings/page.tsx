"use client";
import { Alert, AlertDescription } from "@/components/tailwind/ui/alert";
import { Button } from "@/components/tailwind/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/tailwind/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/tailwind/ui/dialog";
import { Input } from "@/components/tailwind/ui/input";
import { Label } from "@/components/tailwind/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/tailwind/ui/select";
import Cookies from "js-cookie";
import { Bot, HelpCircle, Key, Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import APIKeyGuide from "../components/key-guide";

const SettingsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    model: "",
    apiKey: "",
  });
  const [errors, setErrors] = useState({
    model: "",
    apiKey: "",
  });

  useEffect(() => {
    const savedModel = Cookies.get("model");
    const savedApiKey = Cookies.get("apiKey");

    if (savedModel || savedApiKey) {
      setFormData({
        model: savedModel || "",
        apiKey: savedApiKey || "",
      });
    }
  }, []);

  const validateForm = () => {
    const newErrors = {
      model: "",
      apiKey: "",
    };

    if (!formData.model) {
      newErrors.model = "Please select a model";
    }

    if (!formData.apiKey) {
      newErrors.apiKey = "API key is required";
    } else if (formData.apiKey.length < 20) {
      newErrors.apiKey = "API key seems too short";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      Cookies.set("model", formData.model);
      Cookies.set("apiKey", formData.apiKey);
      toast.success("Your changes have been saved successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModelChange = (value) => {
    setFormData((prev) => ({ ...prev, model: value }));
    if (errors.model) setErrors((prev) => ({ ...prev, model: "" }));
  };

  const handleApiKeyChange = (e) => {
    setFormData((prev) => ({ ...prev, apiKey: e.target.value }));
    if (errors.apiKey) setErrors((prev) => ({ ...prev, apiKey: "" }));
  };

  return (
    <div className="flex flex-1 items-center justify-center h-full bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-primary" />
              <CardTitle className="text-2xl">AI Settings</CardTitle>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <APIKeyGuide />
              </DialogContent>
            </Dialog>
          </div>
          <CardDescription>Configure your Language Model preferences and API keys</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="model">Language Model</Label>
            <Select value={formData.model} onValueChange={handleModelChange}>
              <SelectTrigger id="model" className={errors.model ? "border-destructive" : ""}>
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini">Gemini</SelectItem>
                <SelectItem value="openai">OpenAI</SelectItem>
              </SelectContent>
            </Select>
            {errors.model && <p className="text-sm text-destructive mt-1">{errors.model}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <div className="relative">
              <Input
                id="api-key"
                type="password"
                value={formData.apiKey}
                onChange={handleApiKeyChange}
                className={`pl-8 ${errors.apiKey ? "border-destructive" : ""}`}
                placeholder="Enter your API key"
              />
              <Key className="h-4 w-4 absolute left-2 top-3 text-muted-foreground" />
            </div>
            {errors.apiKey && <p className="text-sm text-destructive mt-1">{errors.apiKey}</p>}
          </div>

          {(formData.model || formData.apiKey) && (
            <Alert className="bg-secondary border-secondary">
              <AlertDescription>Your settings will be securely stored in browser cookies.</AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter>
          <Button onClick={handleSave} className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SettingsPage;
