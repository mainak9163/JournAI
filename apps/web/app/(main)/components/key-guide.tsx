import { Alert, AlertDescription } from "@/components/tailwind/ui/alert";
import { Button } from "@/components/tailwind/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/tailwind/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tailwind/ui/tabs";
import { AlertCircle, CheckCircle2, ExternalLink } from "lucide-react";
import { useState } from "react";

const APIKeyGuide = () => {
  const [activeTab, setActiveTab] = useState("gemini");

  const openInNewTab = (url: string) => {
    window.open(url, "_blank", "noopener noreferrer");
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <AlertCircle className="h-6 w-6 text-primary" />
          How to Get Your API Key
        </CardTitle>
        <CardDescription>Follow these simple steps to get started with AI models</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Alert className="bg-secondary border-secondary">
          <AlertDescription className="flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
            <span>
              We recommend starting with Gemini as it offers free credits and is easier to set up for beginners.
            </span>
          </AlertDescription>
        </Alert>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gemini">Gemini (Recommended)</TabsTrigger>
            <TabsTrigger value="openai">OpenAI</TabsTrigger>
          </TabsList>

          <TabsContent value="gemini" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <h3 className="font-semibold text-lg text-foreground">Getting a Gemini API Key (Free)</h3>
                <ol className="space-y-4 list-decimal pl-4">
                  <li>
                    Go to Google AI Studio (formerly MakerSuite)
                    <Button
                      variant="link"
                      className="ml-2 text-primary"
                      onClick={() => openInNewTab("https://makersuite.google.com/app/apikey")}
                    >
                      Visit Website <ExternalLink className="h-4 w-4 ml-1" />
                    </Button>
                  </li>
                  <li>Sign in with your Google account (create one if needed)</li>
                  <li>Click on &quot;Get API key&quot; in the top navigation</li>
                  <li>Either select an existing project or create a new one</li>
                  <li>Your API key will be generated and displayed</li>
                  <li>Copy the API key and paste it in the settings above</li>
                </ol>
              </div>

              <Alert>
                <AlertDescription>
                  <strong>Free Tier Benefits:</strong>
                  <ul className="list-disc pl-4 mt-2">
                    <li>60 requests per minute</li>
                    <li>No credit card required</li>
                    <li>Perfect for testing and personal projects</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>

          <TabsContent value="openai" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <h3 className="font-semibold text-lg text-foreground">Getting an OpenAI API Key (Paid)</h3>
                <ol className="space-y-4 list-decimal pl-4">
                  <li>
                    Visit OpenAI&apos;s website
                    <Button
                      variant="link"
                      className="ml-2 text-primary"
                      onClick={() => openInNewTab("https://platform.openai.com/api-keys")}
                    >
                      Visit Website <ExternalLink className="h-4 w-4 ml-1" />
                    </Button>
                  </li>
                  <li>Create an account or sign in</li>
                  <li>Add payment method (required for API access)</li>
                  <li>Go to API section in your account</li>
                  <li>Click &quot;Create new secret key&quot;</li>
                  <li>Give your key a name and create it</li>
                  <li>Copy the API key immediately (you won&apos;t be able to see it again)</li>
                </ol>
              </div>

              <Alert>
                <AlertDescription>
                  <strong>Important Notes:</strong>
                  <ul className="list-disc pl-4 mt-2">
                    <li>Requires a valid payment method</li>
                    <li>Pay-as-you-go pricing based on usage</li>
                    <li>Set usage limits in your account to control costs</li>
                    <li>Keep your API key secure and never share it</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-sm text-muted-foreground">
          <p className="font-medium">🔒 Security Note:</p>
          <p>
            Never share your API key with anyone. If you accidentally expose your key, immediately rotate it in your
            account settings.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default APIKeyGuide;
