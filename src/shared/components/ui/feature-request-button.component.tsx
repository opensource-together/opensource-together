"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

import { FRONTEND_URL } from "@/config/config";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Textarea } from "@/shared/components/ui/textarea";
import { useFeatureRequest } from "@/shared/hooks/use-feature-request.hook";

import useAuth from "@/features/auth/hooks/use-auth.hook";

export function FeatureRequestButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [request, setRequest] = useState("");

  const { currentUser } = useAuth();
  const { mutate: submitFeatureRequest, isPending } = useFeatureRequest();

  const handleSubmit = () => {
    if (!request.trim()) {
      toast.error("Please enter a feature request");
      return;
    }

    const userInfo = currentUser
      ? {
          userName: currentUser.name,
          userProfileUrl: `${FRONTEND_URL}/profile/${currentUser.id}`,
        }
      : undefined;

    submitFeatureRequest(
      { request, userInfo },
      {
        onSuccess: () => {
          setRequest("");
          setIsOpen(false);
        },
      }
    );
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed right-6 bottom-6 z-50 size-14 rounded-full bg-black p-2 shadow-lg hover:bg-black/90"
        aria-label="Request a feature"
      >
        <Image
          src="/ost-logo.svg"
          alt="OST"
          width={40}
          height={40}
          className="invert"
        />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request a Feature</DialogTitle>
            <DialogDescription>
              Have an idea to improve OpenSource Together? Share it with us!
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Describe your feature idea..."
              value={request}
              onChange={(e) => setRequest(e.target.value)}
              rows={10}
              className="min-h-[200px] resize-none"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending ? "Sending..." : "Send"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
