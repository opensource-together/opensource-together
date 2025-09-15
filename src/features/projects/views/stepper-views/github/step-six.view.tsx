import StepperHeaderComponent from "@/features/projects/components/stepper/stepper-header.component";
import { StepSixForm } from "@/features/projects/forms/github/step-six.form";

import { StepperWrapper } from "../../../components/stepper/stepper-wrapper.component";

export default function StepSixView() {
  return (
    <StepperWrapper currentStep={6} method="github">
      <StepperHeaderComponent
        title="Ajoutez des liens externes"
        description="Ajoutez des liens externes pour que les utilisateurs puissent en savoir plus sur votre projet"
      />
      <StepSixForm />
    </StepperWrapper>
  );
}
