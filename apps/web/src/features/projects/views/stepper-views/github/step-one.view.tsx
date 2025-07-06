import StepperHeaderComponent from "@/features/projects/components/stepper/stepper-header.component";

import { StepperWrapper } from "../../../components/stepper/stepper-wrapper.component";
import StepOneForm from "../../../forms/github/step-one.form";

export default function StepOneView() {
  return (
    <StepperWrapper currentStep={1} method="github">
      <StepperHeaderComponent
        title="Importer un repository Github"
        description="Choisissez le repository Github que vous souhaitez importer."
      />
      <StepOneForm />
    </StepperWrapper>
  );
}
