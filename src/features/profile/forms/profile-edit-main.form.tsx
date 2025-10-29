import Link from "next/link";
import { UseFormReturn, useFieldArray } from "react-hook-form";

import { AvatarUpload } from "@/shared/components/ui/avatar-upload";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Separator } from "@/shared/components/ui/separator";
import { Textarea } from "@/shared/components/ui/textarea";

import { Profile } from "../types/profile.type";
import { ProfileSchema } from "../validations/profile.schema";

/**
 * Format a Date object to YYYY-MM-DD string in local timezone
 * This avoids timezone issues when using toISOString() which converts to UTC
 */
function formatDateLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

interface ProfileEditMainFormProps {
  profile: Profile;
  form: UseFormReturn<ProfileSchema>;
  onSubmit: () => void;
  onImageSelect: (file: File | null) => void;
  isUpdating: boolean;
}

export default function ProfileEditMainForm({
  profile,
  form,
  onSubmit,
  onImageSelect,
  isUpdating,
}: ProfileEditMainFormProps) {
  const { control } = form;
  const experiencesArray = useFieldArray({
    control,
    name: "experiences" as const,
  });

  return (
    <div className="mb-30 flex w-full flex-col gap-8 lg:max-w-xl">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-8 lg:w-[648px]">
          <FormField
            control={control}
            name="image"
            render={() => (
              <FormItem>
                <FormLabel>Choose an avatar</FormLabel>
                <FormControl>
                  <AvatarUpload
                    currentImageUrl={profile.image}
                    onFileSelect={onImageSelect}
                    name={profile.name}
                    fallback={profile.name}
                    accept="image/*"
                    maxSize={5}
                    size="xl"
                    className="mt-4"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Your name"
                    className="bg-white text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Job Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Ex: Full Stack Developer"
                    className="bg-white text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Tell us about yourself, your passions, your experience..."
                    className="min-h-[120px] w-full resize-none bg-white text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-10 space-y-4">
            <div className="flex items-center justify-between">
              <FormLabel>Work Experience</FormLabel>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  experiencesArray.append({
                    title: "",
                    startAt: "",
                    endAt: null,
                    url: "",
                  })
                }
              >
                Add experience
              </Button>
            </div>

            {experiencesArray.fields.length === 0 && (
              <p className="text-muted-foreground text-sm">
                No experiences added.
              </p>
            )}

            <div className="flex flex-col gap-6">
              {experiencesArray.fields.map((field, index) => (
                <div key={field.id} className="rounded-2xl border p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={control}
                        name={`experiences.${index}.title` as const}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>Title</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Backend Dev @ PrimeIntellect"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name={`experiences.${index}.url` as const}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Link (optional)</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                value={field.value ?? ""}
                                placeholder="https://company.com"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name={`experiences.${index}.startAt` as const}
                        render={({ field }) => {
                          const selectedDate = field.value
                            ? new Date(field.value + "T00:00:00")
                            : undefined;
                          const endVal = form.getValues(
                            `experiences.${index}.endAt` as const
                          ) as string | null | undefined;
                          const endDate = endVal
                            ? new Date(endVal + "T00:00:00")
                            : undefined;
                          return (
                            <FormItem>
                              <FormLabel required>Start date</FormLabel>
                              <FormControl>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className="justify-start rounded-md"
                                    >
                                      {selectedDate
                                        ? formatDateLocal(selectedDate)
                                        : "Select date"}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={selectedDate}
                                      disabled={
                                        endDate ? { after: endDate } : undefined
                                      }
                                      onSelect={(date) => {
                                        const formatted = date
                                          ? formatDateLocal(date)
                                          : "";
                                        field.onChange(formatted);
                                      }}
                                    />
                                  </PopoverContent>
                                </Popover>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />

                      <FormField
                        control={control}
                        name={`experiences.${index}.endAt` as const}
                        render={({ field }) => {
                          const selectedDate = field.value
                            ? new Date((field.value as string) + "T00:00:00")
                            : undefined;
                          const startVal = form.getValues(
                            `experiences.${index}.startAt` as const
                          ) as string | undefined;
                          const startDate = startVal
                            ? new Date(startVal + "T00:00:00")
                            : undefined;
                          return (
                            <FormItem>
                              <FormLabel>
                                End date (or leave empty for current)
                              </FormLabel>
                              <FormControl>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className="justify-start rounded-md"
                                    >
                                      {selectedDate
                                        ? formatDateLocal(selectedDate)
                                        : "Select date"}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={selectedDate}
                                      disabled={
                                        startDate
                                          ? { before: startDate }
                                          : undefined
                                      }
                                      onSelect={(date) => {
                                        const formatted = date
                                          ? formatDateLocal(date)
                                          : null;
                                        field.onChange(formatted);
                                      }}
                                    />
                                  </PopoverContent>
                                </Popover>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => experiencesArray.remove(index)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator className="mt-20" />

          <div className="sticky bottom-0 z-50 bg-white">
            <div className="-mx-4.5">
              <div className="flex items-center justify-end gap-4 px-6 pt-4">
                <Link href="/profile/me">
                  <Button variant="secondary" disabled={isUpdating}>
                    Return
                  </Button>
                </Link>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Confirm"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
