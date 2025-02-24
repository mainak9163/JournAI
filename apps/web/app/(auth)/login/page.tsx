import { LoginForm } from "@/components/login-form";
import login from "@/public/login.svg";
import Image from "next/image";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="hidden h-full w-1/2 lg:block">
        <Image className="mx-auto my-auto h-[80%] w-[80%]" width={200} height={200} src={login.src} alt="login-image" />
      </div>
      <div className="w-full lg:w-1/2">
        <LoginForm />
      </div>
    </div>
  );
}
