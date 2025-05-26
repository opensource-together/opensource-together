import AuthCard from "../components/AuthCard";
import SignUpForm from "../components/SignUpForm";

export default function SignUpView() {
  return (
    <AuthCard 
      title="Rejoindre OpenSource Together"
      subtitle="Créez votre compte et commencez à collaborer sur des projets open source"
    >
      <SignUpForm />
    </AuthCard>
  );
} 