"use client";

import React, { useState } from "react";
import { FaReddit, FaWhatsapp } from "react-icons/fa";
import { HiMiniCheck } from "react-icons/hi2";
import { LuCopy } from "react-icons/lu";
import { RiLinkedinFill, RiTwitterXFill } from "react-icons/ri";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import { Modal } from "@/shared/components/ui/modal";

interface ShareProfileModalProps {
  url: string;
  title?: string;
  description?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  triggerIcon?: React.ComponentType<{ className?: string }>;
  triggerVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  triggerSize?: "default" | "sm" | "lg" | "icon";
  triggerClassName?: string;
}

interface SocialShareButton {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  href: string;
}

interface CopyButtonProps {
  text: string;
}

function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Link Copied");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to Copy Link", { description: err as string });
    }
  };

  return (
    <button
      onClick={handleCopyLink}
      className="bg-accent text-muted-foreground hover:bg-muted hover:text-ost-blue-three shrink-0 rounded p-1.5 transition-colors"
      aria-label={copied ? "Copied!" : "Copy to clipboard"}
      title={copied ? "Copied!" : "Copy to clipboard"}
    >
      {copied ? (
        <HiMiniCheck className="h-4 w-4" />
      ) : (
        <LuCopy className="h-4 w-4" />
      )}
    </button>
  );
}

export function ShareProfileModal({
  url,
  title,
  description,
  open,
  onOpenChange,
  trigger,
  triggerIcon: TriggerIcon,
  triggerVariant = "outline",
  triggerSize = "icon",
  triggerClassName,
}: ShareProfileModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const modalOpen = open ?? isOpen;
  const handleOpenChange = onOpenChange ?? setIsOpen;

  const handleTriggerClick = () => {
    handleOpenChange(true);
  };

  const shareText = "Check out my profile on OpenSource Together!";

  const socialButtons: SocialShareButton[] = [
    {
      name: "X (Twitter)",
      icon: RiTwitterXFill,
      color: "text-primary",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`,
    },
    {
      name: "LinkedIn",
      icon: RiLinkedinFill,
      color: "text-[#0A66C2]",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
      name: "Reddit",
      icon: FaReddit,
      color: "text-[#FF4500]",
      href: `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title || "Check out this profile")}`,
    },
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      color: "text-[#25D366]",
      href: `https://wa.me/?text=${encodeURIComponent(`${shareText}: ${url}`)}`,
    },
  ];

  const handleShare = (shareUrl: string) => {
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  const buttonTrigger = TriggerIcon ? (
    <Button
      variant={triggerVariant}
      size={triggerSize}
      className={triggerClassName}
      onClick={handleTriggerClick}
    >
      <TriggerIcon />
    </Button>
  ) : trigger && React.isValidElement(trigger) ? (
    React.cloneElement(
      trigger as React.ReactElement<{
        onClick?: (e: React.MouseEvent) => void;
      }>,
      {
        onClick: (e: React.MouseEvent) => {
          handleTriggerClick();
          const originalOnClick = (
            trigger as React.ReactElement<{
              onClick?: (e: React.MouseEvent) => void;
            }>
          ).props?.onClick;
          if (originalOnClick) {
            originalOnClick(e);
          }
        },
      }
    )
  ) : (
    trigger
  );

  return (
    <>
      {buttonTrigger}

      <Modal
        open={modalOpen}
        onOpenChange={handleOpenChange}
        title={title || "Share this content"}
        description={
          description ||
          "Choose a platform to share this content with your friends and followers."
        }
        size="lg"
        showCloseButton
      >
        <div className="space-y-6 py-4">
          {/* Social sharing buttons */}
          <div className="grid grid-cols-2 gap-3">
            {socialButtons.map((social) => {
              const Icon = social.icon;
              return (
                <Button
                  key={social.name}
                  variant="outline"
                  className="flex h-auto items-center justify-start gap-2"
                  onClick={() => handleShare(social.href)}
                >
                  <Icon className={`size-4 ${social.color}`} />
                  <span className="font-medium">{social.name}</span>
                </Button>
              );
            })}
          </div>

          {/* Link copy section */}
          <label className="text-sm font-medium">Copy URL</label>
          <div className="bg-accent text-muted-foreground flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm">
            <span className="line-clamp-1 flex-1 break-all">{url}</span>
            <CopyButton text={url} />
          </div>
        </div>
      </Modal>
    </>
  );
}
