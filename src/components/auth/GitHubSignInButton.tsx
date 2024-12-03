import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ErrorContext } from "@better-fetch/fetch";
import { GithubIcon } from "lucide-react";
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
      <GithubIcon className="w-4 h-4 mr-2" />
      Continue with GitHub
    </LoadingButton>
  );
}
