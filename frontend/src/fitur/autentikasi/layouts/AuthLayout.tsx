import { ReactNode } from "react";
import { GraduationCap, Sparkles, Star, Trophy } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
  headerTitle: string;
  headerSubtitle: string;
}

export const AuthLayout = ({
  children,
  headerTitle,
  headerSubtitle,
}: AuthLayoutProps) => {
  return (
    <div className="flex h-screen w-full bg-background font-sans overflow-hidden">
      {/* Left Section - Form */}
      <div className="flex bg-background w-full flex-col h-screen overflow-hidden lg:w-[55%] xl:w-[50%]">
        <div className="flex h-full flex-col px-6 py-4 justify-between">

          {/* Logo Section */}
          <div className="mx-auto w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md shadow-primary/20">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                ACADEMY
              </span>
            </div>
          </div>

          {/* Main Form Content - Centered */}
          <div className="flex flex-col justify-center flex-1 min-h-0 w-full">
            <div className="mx-auto w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl flex flex-col gap-4">
              <div className="flex flex-col gap-1 shrink-0 text-center sm:text-left">
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {headerTitle}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {headerSubtitle}
                </p>
              </div>

              <div className="shrink-0">
                {children}
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <div className="mx-auto w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl shrink-0">
            <div className="text-xs text-center text-muted-foreground pt-2">
              &copy; {new Date().getFullYear()} Kerjabaik Academy. All rights reserved.
            </div>
          </div>

        </div>
      </div>

      {/* Right Section - Illustration */}
      <div className="relative hidden w-0 flex-1 flex-col overflow-hidden bg-primary lg:flex">
        {/* Abstract Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-blue-900" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]" />

        {/* Decorative Orbs */}
        <div className="absolute -left-20 -top-20 h-[600px] w-[600px] rounded-full bg-blue-400/20 blur-[100px]" />
        <div className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-indigo-500/20 blur-[100px]" />

        {/* Content Container */}
        <div className="relative flex h-full flex-col items-center justify-center p-12 text-center text-primary-foreground">
          {/* Hero Image/Illustration Construction */}
          <div className="relative mb-12 flex h-[480px] w-full max-w-[480px] flex-col items-center justify-center">
            {/* Main Glass Card */}
            <div className="relative z-10 w-full overflow-hidden rounded-xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md transition-transform duration-500 hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />

              {/* Inner Content */}
              <div className="relative flex flex-col gap-6 text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-white/20 bg-blue-500/20">
                      <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                        alt="User"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Felix Tan</h3>
                      <p className="text-xs text-white/60">Product Designer</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="h-2 w-3/4 rounded-full bg-white/10" />
                  <div className="h-2 w-full rounded-full bg-white/10" />
                  <div className="h-2 w-5/6 rounded-full bg-white/10" />
                </div>

                <div className="flex items-center gap-4 rounded-xl bg-white/5 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20 text-green-400">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Course Completed</p>
                    <p className="text-xs text-white/60">UI/UX Design Mastery</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -right-8 top-12 z-20 animate-bounce duration-[4000ms]">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 shadow-xl backdrop-blur-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/20 text-yellow-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">4.9/5.0</p>
                  <p className="text-xs text-white/60">Rating</p>
                </div>
              </div>
            </div>

            <div className="absolute -left-8 bottom-20 z-20 animate-bounce delay-700 duration-[5000ms]">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 shadow-xl backdrop-blur-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">100k+</p>
                  <p className="text-xs text-white/60">Students</p>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="max-w-md space-y-4">
            <h2 className="text-3xl font-bold leading-tight tracking-tight lg:text-4xl">
              Tingkatkan Karir Anda dengan Skill Baru
            </h2>
            <p className="text-lg text-white/70">
              Bergabunglah dengan komunitas belajar terbesar. Akses ribuan materi berkualitas dari instruktur berpengalaman.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
