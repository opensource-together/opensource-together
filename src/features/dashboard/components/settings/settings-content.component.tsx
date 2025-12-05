import { useState } from "react";
import { RiGithubFill, RiGitlabFill } from "react-icons/ri";

import { Avatar } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";
import { ErrorState } from "@/shared/components/ui/error-state";
import { formatExternalUrl } from "@/shared/lib/utils/format-external-url";

import useAuth from "@/features/auth/hooks/use-auth.hook";

import { SettingsSkeleton } from "../skeletons/settings-skeletons.component";

export function SettingsContent() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [unlinkProviderId, setUnlinkProviderId] = useState<string | null>(null);
  const {
    currentUser,
    isLoading,
    isError,
    logout,
    isLoggingOut,
    deleteAccount,
    isDeletingAccount,
    linkSocialAccount,
    isLinkingSocialAccount,
    unlinkSocialAccount,
    isUnlinkingSocialAccount,
  } = useAuth();

  if (isLoading) {
    return <SettingsSkeleton />;
  }

  if (isError || !currentUser) {
    return (
      <ErrorState
        message="We couldn't load your settings. Please sign in again."
        queryKey={["user", "me"]}
        className="mt-20 mb-28"
        buttonText="Go to login"
        href="/auth/login"
      />
    );
  }

  const handleLogout = () => {
    logout();
  };

  const handleConfirmDelete = () => {
    deleteAccount();
  };

  const handleConfirmUnlink = () => {
    if (unlinkProviderId) {
      unlinkSocialAccount(unlinkProviderId);
      setUnlinkProviderId(null);
    }
  };

  const providers = [
    {
      id: "github",
      name: "GitHub",
      description:
        "Connect GitHub to import your repositories and sync contributions.",
      connected: currentUser.connectedProviders?.includes("github") || false,
      url: currentUser.githubUrl,
      icon: RiGithubFill,
    },
    {
      id: "gitlab",
      name: "GitLab",
      description:
        "Connect GitLab to import your projects and sync contributions.",
      connected: currentUser.connectedProviders?.includes("gitlab") || false,
      url: currentUser.gitlabUrl,
      icon: RiGitlabFill,
    },
  ] as const;

  return (
    <div>
      <div className="space-y-6">
        {/* Profile Section */}
        <section>
          <div className="flex items-center gap-4">
            <Avatar
              src={currentUser.image}
              alt={currentUser.name}
              name={currentUser.name}
              size="xl"
            />
            <div className="flex-1">
              <h3 className="text-2xl font-medium">{currentUser.name}</h3>
              <p className="text-muted-foreground text-sm">
                {currentUser.email}
              </p>
            </div>
          </div>
        </section>

        {/* Integrations Section */}
        <section className="mt-10">
          <h3 className="mb-4 font-medium">Connected Integrations</h3>
          <div className="space-y-4">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className="border-muted-black-stroke flex items-center justify-between rounded-3xl border p-5 md:max-w-2/3"
              >
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="flex items-center gap-2 font-medium">
                      <provider.icon size={24} /> {provider.name}
                    </span>
                    <Badge variant={provider.connected ? "info" : "gray"}>
                      {provider.connected ? "Connected" : "Not connected"}
                    </Badge>
                  </div>
                  {!provider.connected && (
                    <p className="text-muted-foreground mt-2 ml-1 text-sm">
                      {provider.description}
                    </p>
                  )}
                  {provider.connected && provider.url && (
                    <p className="text-muted-foreground mt-2 ml-1 text-sm">
                      Linked as&nbsp;
                      {formatExternalUrl(
                        provider.url,
                        provider.id === "github" ? "githubUrl" : "gitlabUrl"
                      )}
                    </p>
                  )}
                </div>
                {!provider.connected && (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isLinkingSocialAccount}
                    onClick={() => linkSocialAccount(provider.id)}
                  >
                    {isLinkingSocialAccount ? "Linking..." : "Link"}
                  </Button>
                )}
                {provider.connected &&
                  (currentUser.connectedProviders?.length ?? 0) > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isUnlinkingSocialAccount}
                      onClick={() => setUnlinkProviderId(provider.id)}
                    >
                      {isUnlinkingSocialAccount ? "Unlinking..." : "Unlink"}
                    </Button>
                  )}
              </div>
            ))}
          </div>
          {unlinkProviderId && (
            <ConfirmDialog
              open={!!unlinkProviderId}
              onOpenChange={(open) => {
                if (!open) setUnlinkProviderId(null);
              }}
              title={`Unlink ${providers.find((p) => p.id === unlinkProviderId)?.name}?`}
              description={`Are you sure you want to unlink your ${providers.find((p) => p.id === unlinkProviderId)?.name} account? You will no longer be able to sign in using this provider.`}
              isLoading={isUnlinkingSocialAccount}
              onConfirm={handleConfirmUnlink}
              onCancel={() => setUnlinkProviderId(null)}
              confirmText={
                isUnlinkingSocialAccount ? "Unlinking..." : "Confirm unlink"
              }
              confirmVariant="destructive"
            />
          )}
        </section>

        {/* Danger Zone */}
        <section className="my-10">
          <h3 className="text-destructive mb-2 font-medium">Danger Zone</h3>
          <p className="text-destructive/80 mb-6 text-sm">
            Sign out of your current session. Contact support to request account
            deletion if needed.
          </p>
          <div className="flex gap-3">
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Signing out..." : "Sign out"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              Delete account
            </Button>
            <ConfirmDialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
              title="Delete account?"
              description="This action is permanent and will remove your account and related data. Depending on your sign-in method, an email confirmation may be required."
              isLoading={isDeletingAccount}
              onConfirm={handleConfirmDelete}
              onCancel={() => setIsDeleteDialogOpen(false)}
              confirmText={isDeletingAccount ? "Deleting..." : "Confirm delete"}
              confirmVariant="destructive"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
