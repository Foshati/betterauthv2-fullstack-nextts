import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ErrorContext } from "@better-fetch/fetch";
import { authClient } from "@/lib/auth-client";
import LoadingButton from "../loading-button";

export function FacebookSignInButton() {
  const router = useRouter();
  const { toast } = useToast();
  const [pendingFacebook, setPendingFacebook] = useState(false);

  const handleSignInWithFacebook = async () => {
    await authClient.signIn.social(
      {
        provider: "facebook",
      },
      {
        onRequest: () => {
          setPendingFacebook(true);
        },
        onSuccess: async () => {
          router.push("/");
          router.refresh();
        },
        onError: (ctx: ErrorContext) => {
          toast({
            title: "Facebook Sign-In Failed",
            description: ctx.error.message ?? "Unable to sign in with Facebook.",
            variant: "destructive",
          });
          setPendingFacebook(false);
        },
      }
    );
  };

  return (
    <LoadingButton
      pending={pendingFacebook}
      onClick={handleSignInWithFacebook}
    >
      <svg 
        className="w-4 h-4 mr-2" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24"
        fill="#1877F2"
      >
        <path 
          d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
        />
      </svg>
    </LoadingButton>
  );
}