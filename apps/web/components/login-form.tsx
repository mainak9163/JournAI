import { signIn } from "@/auth";
import { Button } from "@/components/tailwind/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/tailwind/ui/card";
import { Input } from "@/components/tailwind/ui/input";
import { Label } from "@/components/tailwind/ui/label";
import { cn } from "@/lib/utils";
import { ChromeIcon as Google } from "lucide-react";

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("mx-auto w-full max-w-md", className)} {...props}>
      <Card className="border-none shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl font-bold">Login</CardTitle>
          <CardDescription className="text-center">Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={async (formData) => {
              "use server";
              await signIn("mailgun", formData);
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" name="email" placeholder="m@example.com" required className="w-full" />
            </div>
            <Button type="submit" className="w-full">
              Login with Email
            </Button>
          </form>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <Google className="mr-2 h-5 w-5" />
            Login with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
