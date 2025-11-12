"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { FRONTEND_URL } from "@/config/config";

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
import {
  type FeatureRequestFormData,
  featureRequestSchema,
} from "@/shared/validations/feature-request.schema";

import useAuth from "@/features/auth/hooks/use-auth.hook";

export function FeatureRequestButton() {
  const [isOpen, setIsOpen] = useState(false);

  const { currentUser } = useAuth();
  const { submitFeatureRequest, isSubmitting } = useFeatureRequest();

  const form = useForm<FeatureRequestFormData>({
    resolver: zodResolver(featureRequestSchema),
    defaultValues: {
      request: "",
    },
  });

  if (!currentUser) {
    return null;
  }

  const handleSubmit = (data: FeatureRequestFormData) => {
    const userInfo = {
      userName: currentUser.name,
      userProfileUrl: `${FRONTEND_URL}/profile/${currentUser.id}`,
    };

    submitFeatureRequest(
      { request: data.request, userInfo },
      {
        onSuccess: () => {
          form.reset();
          setIsOpen(false);
        },
      }
    );
  };

  const handleCancel = () => {
    form.reset();
    setIsOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed right-6 bottom-6 z-50 flex size-14 items-center justify-center rounded-full bg-black p-0 shadow-lg hover:bg-black/90"
        aria-label="Request a feature"
      >
        <Image src="/ost-logo-white.svg" alt="OST" width={35} height={35} />
      </Button>

      <Modal
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Request a Feature"
        description="Have an idea to improve OpenSource Together? Share it with us!"
        confirmText={isSubmitting ? "Sending..." : "Send"}
        cancelText="Cancel"
        onConfirm={form.handleSubmit(handleSubmit)}
        onCancel={handleCancel}
        isLoading={isSubmitting}
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
                      disabled={isSubmitting}
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
