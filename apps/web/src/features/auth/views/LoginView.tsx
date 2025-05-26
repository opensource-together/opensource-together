import AuthCard from "../components/AuthCard";
import LoginForm from "../components/LoginForm";

export default function LoginView() {
  return (
    <AuthCard 
      title="Se connecter à OpenSource Together"
      subtitle="Rejoignez la communauté et collaborez sur des projets open source"
    >
      <LoginForm />
    </AuthCard>
  );
}
