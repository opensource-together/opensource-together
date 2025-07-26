"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Textarea } from "@/shared/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import Icon from "@/shared/components/ui/icon";

import { useCreateProject } from "@/features/projects/hooks/use-projects.hook";
import { useProjectCreateStore } from "@/features/projects/stores/project-create.store";
import {
  StepFiveFormData,
  stepFiveSchema,
} from "@/features/projects/validations/project-stepper.schema";
import { FormNavigationButtons } from "../../components/stepper/stepper-navigation-buttons.component";
import { ProjectCreationConfirmDialog } from "../../components/stepper/creation-confirmation-dialog.component";

export default function StepFiveForm() {
  const router = useRouter();
  const { formData, updateProjectInfo, resetForm } = useProjectCreateStore();
  const { createProject, isCreating } = useCreateProject();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const form = useForm<StepFiveFormData>({
    resolver: zodResolver(stepFiveSchema),
    defaultValues: {
      readme: formData.readme || "",
    },
  });

  const handleSubmit = (data: StepFiveFormData) => {
    updateProjectInfo(data);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmCreation = async () => {
    const finalData = {
      ...formData,
      ...form.getValues(),
    };

    // Get the logo file from session storage
    let logoFile: File | undefined;
    const logoData = sessionStorage.getItem('projectLogo');
    const logoName = sessionStorage.getItem('projectLogoName');
    const logoType = sessionStorage.getItem('projectLogoType');
    
    if (logoData && logoName && logoType) {
      const base64Data = logoData.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      logoFile = new File([byteArray], logoName, { type: logoType });
      
      // Clean up session storage
      sessionStorage.removeItem('projectLogo');
      sessionStorage.removeItem('projectLogoName');
      sessionStorage.removeItem('projectLogoType');
    }

    createProject({
      projectData: {
        title: finalData.title,
        shortDescription: finalData.shortDescription,
        keyFeatures: finalData.keyFeatures,
        projectGoals: finalData.projectGoals,
        techStack: finalData.techStack,
        categories: finalData.categories,
        externalLinks: finalData.externalLinks || [],
        roles: finalData.roles,
        readme: finalData.readme,
      },
      imageFile: logoFile,
    });
  };

  const handleBack = () => {
    const currentValues = form.getValues();
    updateProjectInfo(currentValues);
    router.push("/projects/create/scratch/step-four");
  };

  const handlePasteFromGitHub = (content: string) => {
    form.setValue("readme", content);
    setIsDialogOpen(false);
  };

  const watchedReadme = form.watch("readme");

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="w-full max-w-2xl space-y-6"
        >
          <FormField
            control={form.control}
            name="readme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>README du Projet</FormLabel>
                <FormDescription>
                  Ajoutez un README pour décrire votre projet en détail. Vous pouvez
                  utiliser le format Markdown.
                </FormDescription>
                <FormControl>
                  <div className="space-y-4">
                    <div className="flex justify-end">
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button type="button" variant="outline" size="sm">
                            <Icon name="github" size="sm" className="mr-2" />
                            Importer depuis GitHub
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[80vh]">
                          <DialogHeader>
                            <DialogTitle>Importer un README depuis GitHub</DialogTitle>
                            <DialogDescription>
                              Collez le contenu de votre README.md récupéré depuis GitHub
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Textarea
                              placeholder="Collez votre README ici..."
                              className="min-h-[400px] font-mono text-sm"
                              onChange={(e) => {
                                if (e.target.value) {
                                  handlePasteFromGitHub(e.target.value);
                                }
                              }}
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <Tabs defaultValue="edit" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="edit">Éditer</TabsTrigger>
                        <TabsTrigger value="preview">Aperçu</TabsTrigger>
                      </TabsList>
                      <TabsContent value="edit">
                        <Textarea
                          {...field}
                          placeholder="# Mon Projet\n\nDescription de votre projet...\n\n## Fonctionnalités\n\n- Fonctionnalité 1\n- Fonctionnalité 2\n\n## Installation\n\n```bash\nnpm install\n```"
                          className="min-h-[400px] font-mono text-sm"
                        />
                      </TabsContent>
                      <TabsContent value="preview">
                        <div className="min-h-[400px] rounded-md border p-4 prose prose-sm max-w-none overflow-auto">
                          {watchedReadme ? (
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {watchedReadme}
                            </ReactMarkdown>
                          ) : (
                            <p className="text-muted-foreground">
                              Aucun contenu à prévisualiser
                            </p>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormNavigationButtons
            onBack={handleBack}
            isSubmitting={isCreating}
            submitText="Créer le projet"
          />
        </form>
      </Form>

      <ProjectCreationConfirmDialog
        isOpen={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        onConfirm={handleConfirmCreation}
        isCreating={isCreating}
        projectTitle={formData.title}
        onSuccess={() => {
          resetForm();
          router.push("/projects/create/success");
        }}
      />
    </>
  );
}