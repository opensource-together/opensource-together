"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";
import { Combobox } from "@/shared/components/ui/combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { useTechStack } from "@/shared/hooks/use-tech-stack.hook";

import { useOnboarding } from "@/features/auth/hooks/use-onboarding.hook";

import {
  OnboardingSchema,
  onboardingSchema,
} from "../validations/onboarding.schema";

export default function OnboardingForm() {
  const form = useForm<OnboardingSchema>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      jobTitle: "",
      techStacks: [],
    },
    mode: "onChange",
  });

  const { techStackOptions } = useTechStack();
  const { completeOnboarding, isCompletingOnboarding } = useOnboarding();

  const { control, handleSubmit } = form;

  const onSubmit = handleSubmit(async (values) => {
    completeOnboarding(values);
  });

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="p-4">
          <div className="mb-7 text-center">
            <h1 className="mb-2 text-2xl">Let’s get you started</h1>
            <p className="mt-0 text-sm text-black/70">
              Enter your information to get top project picks.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={onSubmit} className="flex flex-col gap-5">
              <FormField
                control={control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Title</FormLabel>
                    <FormControl>
                      <Input placeholder="eg; Fullstack Developer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="techStacks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technical Skills</FormLabel>
                    <FormControl>
                      <Combobox
                        options={techStackOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select Technologies"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isCompletingOnboarding}
              >
                Continue
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
