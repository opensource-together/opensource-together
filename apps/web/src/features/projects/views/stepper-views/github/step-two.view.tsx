import StepperHeaderComponent from "@/features/projects/components/stepper/stepper-header.component";

import { StepperWrapper } from "../../../components/stepper/stepper-wrapper.component";
import StepTwoForm from "../../../forms/github/step-two.form";

export default function StepTwoView() {
  return (
    <StepperWrapper currentStep={2} method="github">
      <StepperHeaderComponent
        title="Confirmer vos informations Github"
        description="Vérifiez les informations du repository avant de continuer"
      />
      <StepTwoForm />
    </StepperWrapper>
  );
}
