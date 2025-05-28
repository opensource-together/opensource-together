import Image from "next/image";
import AuthCard from "../components/AuthCard";
import LoginForm from "../components/LoginForm";

export default function LoginView() {
  return (
    <div className="flex h-screen">
      <div className="flex flex-col">
        <div className="mb-[200px] ml-8 mt-8">
          <Image 
            src="/icons/ost-logo-login.svg" 
            alt="OpenSource Together Logo" 
            width={210} 
            height={35} 
            priority
          />
        </div>


        <div className="ml-[107px]">
          <AuthCard
            title="Bienvenue sur OpenSource Together"
            subtitle="Trouvez des projets, postulez à des rôles, collaborez — construisons, partageons et grandissons ensemble grâce à l'open source"
          >
            <LoginForm />
          </AuthCard>
        </div>
      </div>
      
      {/* Layout à droite avec background et app screen */}
      <div className="relative mt-7 h-[729px] ml-[107px] w-[1146px] border-1 border-black/5 rounded-[25px] overflow-hidden">
        {/* Background image */}
        <Image 
          src="/icons/background-login-page.svg" 
          alt="Background" 
          fill
          className="object-cover"
          priority
        />
        
        {/* App screen */}
        <div className="absolute inset-0 top-[70px] left-[600px] flex items-center justify-center">
          <Image 
            src="/icons/screen-login-page.svg" 
            alt="Application screen" 
            width={1000} 
            height={1000} 
            className="h-[973px] w-auto max-w-none"
            priority
          />
        </div>
      </div>


    </div>
  );
}
