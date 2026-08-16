"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { HiInformationCircle } from "react-icons/hi2";
import { toast } from "sonner";
import type { Profile } from "@/features/profile/types/profile.type";
import { Button } from "@/shared/components/ui/button";
import { Combobox } from "@/shared/components/ui/combobox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { useCategories } from "@/shared/hooks/use-category.hook";
import { useTechStack } from "@/shared/hooks/use-tech-stack.hook";
import { getErrorMessage } from "@/shared/lib/get-error-message";
import { useCompleteOnboardingMutation } from "../hooks/onboarding.mutations";
import {
  type OnboardingFormValues,
  onboardingSchema,
} from "../validations/onboarding.schema";

export default function OnboardingForm({ user }: { user: Profile }) {
  const router = useRouter();
  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      jobTitle: "",
      techStacks: [],
      userCategories: [],
    },
    mode: "onChange",
  });

  const { techStackOptions, isLoading: techStacksLoading } = useTechStack();
  const { categoryOptions, isLoading: categoriesLoading } = useCategories();
  const completeOnboardingMutation = useCompleteOnboardingMutation();

  const { control, handleSubmit } = form;

  const onSubmit = handleSubmit(async (values) => {
    try {
      await completeOnboardingMutation.mutateAsync({
        userId: user.id,
        userName: user.name,
        values,
      });
      toast.success("Profile completed. Welcome to OpenSource Together 🎉!");
      router.push("/");
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Failed to complete onboarding. Please try again."
        )
      );
    }
  });

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-lg">
        <div className="p-4">
          <div className="mb-7 text-center">
            <h1 className="mb-2 text-2xl tracking-[-5%]">
              Let’s get you started
            </h1>
            <p className="text-muted-foreground text-sm">
              Share a few details to get personalized recommendations.
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
                      <Input
                        placeholder="Example: Fullstack Developer"
                        {...field}
                      />
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
                    <FormLabel className="gap-1.5">
                      Technical Skills
                      <span className="font-normal text-muted-foreground">
                        • 10 max
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Combobox
                        options={techStackOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={
                          techStacksLoading
                            ? "Loading technologies..."
                            : "Select your tech stack"
                        }
                        searchPlaceholder="Search technologies..."
                        disabled={techStacksLoading}
                        maxSelections={10}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="userCategories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="gap-1.5">
                      Your Interests
                      <span className="font-normal text-muted-foreground">
                        • 6 max
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Combobox
                        options={categoryOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={
                          categoriesLoading
                            ? "Loading categories..."
                            : "Select your interests"
                        }
                        searchPlaceholder="Search categories..."
                        emptyText="No interests found."
                        disabled={categoriesLoading}
                        maxSelections={6}
                      />
                    </FormControl>
                    <FormDescription className="mt-1.5 flex items-start gap-1.5 text-xs">
                      <HiInformationCircle className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
                      <span>
                        AI-suggested categories may not be perfectly accurate
                        yet and will improve over time.
                      </span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={completeOnboardingMutation.isPending}
              >
                {completeOnboardingMutation.isPending
                  ? "Completing..."
                  : "Continue"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
