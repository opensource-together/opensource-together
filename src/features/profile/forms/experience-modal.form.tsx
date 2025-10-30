"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormReturn, useForm } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Modal } from "@/shared/components/ui/modal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";

import { experienceSchema } from "../validations/profile.schema";

type ExperienceFormData = typeof experienceSchema._type;

interface ExperienceModalFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: (values: ExperienceFormData) => void;
  onCancel: () => void;
  /**
   * If provided, this external form instance will be used.
   * Otherwise the component will create its own internal form.
   */
  form?: UseFormReturn<ExperienceFormData>;
  defaultValues?: Partial<ExperienceFormData>;
}

function formatDateLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function ExperienceModalForm({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Add Experience",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  form,
  defaultValues,
}: ExperienceModalFormProps) {
  const createdForm = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      title: "",
      startAt: "",
      endAt: undefined,
      url: undefined,
      ...defaultValues,
    },
  });
  const internalForm = form ?? createdForm;

  const handleConfirm = () =>
    internalForm.handleSubmit((values) => onConfirm(values))();

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      size="lg"
      confirmText={confirmText}
      cancelText={cancelText}
      onConfirm={handleConfirm}
      onCancel={onCancel}
    >
      <Form {...internalForm}>
        <form className="space-y-4 pt-4">
          <FormField
            control={internalForm.control}
            name="title"
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
            control={internalForm.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link</FormLabel>
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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={internalForm.control}
              name="startAt"
              render={({ field }) => {
                const selectedDate = field.value
                  ? new Date(field.value + "T00:00:00")
                  : undefined;
                const endVal = internalForm.getValues("endAt");
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
                            className="w-full justify-start rounded-md"
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
                            disabled={endDate ? { after: endDate } : undefined}
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
              control={internalForm.control}
              name="endAt"
              render={({ field }) => {
                const selectedDate = field.value
                  ? new Date((field.value as string) + "T00:00:00")
                  : undefined;
                const startVal = internalForm.getValues("startAt");
                const startDate = startVal
                  ? new Date(startVal + "T00:00:00")
                  : undefined;
                const isCurrent = internalForm.watch("endAt") === null;
                return (
                  <FormItem>
                    <div className="flex items-center justify-between gap-3">
                      <FormLabel>End date</FormLabel>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="is-current"
                          checked={isCurrent}
                          onCheckedChange={(checked) => {
                            const isChecked = checked === true;
                            internalForm.setValue(
                              "endAt",
                              isChecked ? null : undefined,
                              { shouldValidate: true }
                            );
                          }}
                        />
                        <label htmlFor="is-current" className="text-sm">
                          Currently
                        </label>
                      </div>
                    </div>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start rounded-md"
                            disabled={isCurrent}
                          >
                            {isCurrent
                              ? "Current"
                              : selectedDate
                                ? formatDateLocal(selectedDate)
                                : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={isCurrent ? undefined : selectedDate}
                            disabled={
                              isCurrent
                                ? true
                                : startDate
                                  ? { before: startDate }
                                  : undefined
                            }
                            onSelect={(date) => {
                              if (isCurrent) return;
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
        </form>
      </Form>
    </Modal>
  );
}
