import Image from "next/image";
import AuthCard from "../components/AuthCard";
import SignUpForm from "../components/SignUpForm";

export default function SignUpView() {
  return (
    <div className="flex h-screen">
      <div className="flex flex-col">
        <div className="mb-[400px] ml-8 mt-8">
          <Image 
            src="/icons/ost-logo-login.svg" 
            alt="OpenSource Together Logo" 
            width={210} 
            height={35} 
            priority
          />
        </div>

        <div className="">
          <div className="ml-[87px]">
            <AuthCard
              title="Bienvenue sur OpenSource Together"
              subtitle="Trouvez des projets, postulez à des rôles, collaborez — construisons, partageons et grandissons ensemble grâce à l'open source"
            >
              <SignUpForm />
            </AuthCard>
          </div>
        </div>
        
        {/* Layout à droite avec background et app screen */}
        <div className="relative mt-7 flex-1 h-[95%] border-l-4 border-black/5 rounded-lg overflow-hidden">
          {/* Background image */}
          <Image 
            src="/icons/background-login-page.svg" 
            alt="Background" 
            fill
            className="object-cover"
            priority
          />
          
          {/* App screen */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Image 
              src="/icons/screen-login-page.svg" 
              alt="Application screen" 
              width={900} 
              height={600} 
              className="h-[95%] w-auto max-w-none"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
