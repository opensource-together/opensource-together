"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FRONTEND_URL } from "@/config/config";
import { useCurrentUserQuery } from "@/features/auth/hooks/auth.queries";
import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/components/ui/form";
import { Modal } from "@/shared/components/ui/modal";
import { Textarea } from "@/shared/components/ui/textarea";
import { useFeatureRequest } from "@/shared/hooks/use-feature-request.hook";
import { getErrorMessage } from "@/shared/lib/get-error-message";
import {
  type FeatureRequestFormData,
  featureRequestSchema,
} from "@/shared/validations/feature-request.schema";

export function FeatureRequestButton() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const currentUser = useCurrentUserQuery().data;
  const featureRequestMutation = useFeatureRequest();

  const form = useForm<FeatureRequestFormData>({
    resolver: zodResolver(featureRequestSchema),
    defaultValues: {
      request: "",
    },
  });

  const hideFloatingButton =
    pathname?.startsWith("/auth") ||
    pathname?.startsWith("/onboarding") ||
    pathname?.startsWith("/projects/create");

  if (hideFloatingButton || !currentUser) {
    return null;
  }

  const handleSubmit = async (data: FeatureRequestFormData) => {
    const userInfo = {
      userName: currentUser.name,
      userProfileUrl: `${FRONTEND_URL}/profile/${currentUser.id}`,
    };

    try {
      await featureRequestMutation.mutateAsync({
        request: data.request,
        userInfo,
      });
      toast.success("Thank you! Your request has been sent successfully");
      form.reset();
      setIsOpen(false);
    } catch (error) {
      toast.error(
        getErrorMessage(error, "An error occurred. Please try again.")
      );
    }
  };

  const handleCancel = () => {
    form.reset();
    setIsOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed right-6 bottom-6 z-50 hidden size-[52px] items-center justify-center rounded-full bg-black p-0 shadow-lg transition-transform duration-200 ease-out hover:scale-[0.96] hover:bg-black/90 md:flex"
        aria-label="Request feature"
      >
        <Image src="/ost-logo-white.svg" alt="OST" width={31} height={31} />
      </Button>

      <Modal
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Request Feature"
        description="Have an idea to improve OpenSource Together?"
        confirmText={featureRequestMutation.isPending ? "Sending..." : "Send"}
        cancelText="Cancel"
        onConfirm={form.handleSubmit(handleSubmit)}
        onCancel={handleCancel}
        isLoading={featureRequestMutation.isPending}
        size="lg"
      >
        <Form {...form}>
          <form className="space-y-2 py-4">
            <FormField
              control={form.control}
              name="request"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your feature idea..."
                      {...field}
                      rows={10}
                      className="min-h-[200px] resize-none"
                      disabled={featureRequestMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </Modal>
    </>
  );
}
