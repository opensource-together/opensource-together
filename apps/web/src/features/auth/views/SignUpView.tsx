import AuthCard from "../components/AuthCard";
import SignUpForm from "../components/SignUpForm";

export default function SignUpView() {
  return (
    <AuthCard
      title="Bienvenue sur OpenSource Together"
      subtitle="Trouvez des projets, postulez à des rôles, collaborez — construisons, partageons et grandissons ensemble grâce à l’open source"
    >
      <SignUpForm />
    </AuthCard>
  );
}
