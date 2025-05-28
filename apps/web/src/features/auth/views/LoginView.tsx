import AuthCard from "../components/AuthCard";
import LoginForm from "../components/LoginForm";

export default function LoginView() {
  return (
    <AuthCard
      title="Bienvenue sur OpenSource Together"
      subtitle="Trouvez des projets, postulez à des rôles, collaborez — construisons, partageons et grandissons ensemble grâce à l’open source"
    >
      <LoginForm />
    </AuthCard>
  );
}
