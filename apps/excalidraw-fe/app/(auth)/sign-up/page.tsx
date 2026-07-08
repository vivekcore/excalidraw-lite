"use client";
import { FeildValues } from "@/components/AuthForm";
import { api } from "@/lib/axios";
import { getToken } from "@/utils/token";
import { ArrowRight, LogIn, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface ISignUp {
  name: string;
  email: string;
  password: string;
}
const SignUp = () => {
  const router = useRouter();
  useEffect(() => {
    const token = getToken();
    if (token) {
      router.push("/room");
    }
  }, [router]);
  const { register, handleSubmit } = useForm<ISignUp>();
  const onSubmit = async (data: ISignUp) => {
    try {
      const response = await api.post("/auth/signup", data);
      localStorage.setItem("token", response.data.data.token);
      router.push("/room");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="pixel-page flex flex-1 items-center justify-center px-5 py-8">
      <main className="grid w-full max-w-5xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="pixel-panel p-5 sm:p-7">
          <p className="pixel-kicker">New player</p>
          <h1 className="pixel-title mt-4 text-3xl font-black uppercase text-[var(--pixel-yellow)] sm:text-5xl">
            Register
          </h1>
          <p className="mt-4 text-sm leading-6 text-[var(--pixel-muted)] sm:text-base">
            Start a room, invite another cursor, and draw synced shapes with a
            side-channel chat.
          </p>
          <button
            type="button"
            onClick={() => router.push("/sign-in")}
            className="pixel-button mt-6 px-4 py-3"
          >
            <LogIn className="h-4 w-4" />
            Sign in
          </button>
        </section>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="pixel-panel-strong space-y-5 p-5 sm:p-7"
        >
          <div className="flex items-center gap-3 border-b-2 border-[var(--pixel-line)] pb-4">
            <div className="grid h-11 w-11 place-items-center border-2 border-[var(--pixel-pink)] bg-[#0f1320] shadow-[4px_4px_0_var(--pixel-ink)]">
              <UserPlus className="h-5 w-5 text-[var(--pixel-pink)]" />
            </div>
            <div>
              <p className="pixel-label">Account boot</p>
              <p className="font-mono text-xs font-bold uppercase text-[var(--pixel-muted)]">
                Create profile
              </p>
            </div>
          </div>

          <FeildValues label="Name" name="name" type="text" register={register} />
          <FeildValues
            label="Email"
            name="email"
            type="email"
            register={register}
          />
          <FeildValues
            label="Password"
            name="password"
            type="password"
            register={register}
          />
          <button
            type="submit"
            className="pixel-button pixel-button-primary w-full px-5 py-3"
          >
            Create account
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </main>
    </div>
  );
};

export default SignUp;
