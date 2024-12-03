import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ErrorContext } from "@better-fetch/fetch";
import { authClient } from "@/lib/auth-client";
import LoadingButton from "../loading-button";

export function GitHubSignInButton() {
    const router = useRouter();
    const { toast } = useToast();
    const [pendingGithub, setPendingGithub] = useState(false);
  
    const handleSignInWithGithub = async () => {
      await authClient.signIn.social(
        {
          provider: "github",
        },
        {
          onRequest: () => {
            setPendingGithub(true);
          },
          onSuccess: async () => {
            router.push("/");
            router.refresh();
          },
          onError: (ctx: ErrorContext) => {
            toast({
              title: "Something went wrong",
              description: ctx.error.message ?? "GitHub sign-in failed.",
              variant: "destructive",
            });
            setPendingGithub(false);
          },
        }
      );
    };
  
    return (
      <LoadingButton pending={pendingGithub} onClick={handleSignInWithGithub}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4 mr-2"
        >
          <path
            fillRule="evenodd"
            d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.112.82-.258.82-.577v-2.152c-3.338.727-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.236 1.84 1.236 1.07 1.835 2.807 1.305 3.492.998.108-.775.418-1.305.762-1.605-2.665-.3-5.467-1.332-5.467-5.932 0-1.31.468-2.38 1.236-3.22-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.3 1.23.957-.266 1.985-.398 3.007-.404 1.02.006 2.05.138 3.01.404 2.29-1.553 3.297-1.23 3.297-1.23.656 1.653.243 2.873.12 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.807 5.628-5.48 5.921.43.372.812 1.102.812 2.222v3.293c0 .323.22.693.824.576C20.565 21.797 24 17.3 24 12c0-6.63-5.37-12-12-12z"
            clipRule="evenodd"
          />
        </svg>
      </LoadingButton>
    );
  }
  