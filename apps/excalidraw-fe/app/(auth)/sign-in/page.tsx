"use client";
import { FeildValues } from "@/components/AuthForm";
import { api } from "@/lib/axios";
import { getToken } from "@/utils/token";
import { ArrowRight, KeyRound, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface ISignin {
  email: string;
  password: string;
}
const SignIn = () => {
  const router = useRouter();
  useEffect(() => {
    const token = getToken();
    if (token) {
      router.push("/room");
    }
  }, [router]);
  const { register, handleSubmit } = useForm<ISignin>();
  const onSubmit = async (data: ISignin) => {
    try {
      const response = await api.post("/auth/signin", data);
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem('userId',response.data.data.user.id)
      router.push("/room");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="pixel-page flex flex-1 items-center justify-center px-5 py-8">
      <main className="grid w-full max-w-5xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="pixel-panel p-5 sm:p-7">
          <p className="pixel-kicker">Player access</p>
          <h1 className="pixel-title mt-4 text-3xl font-black uppercase text-[var(--pixel-yellow)] sm:text-5xl">
            Sign in
          </h1>
          <p className="mt-4 text-sm leading-6 text-[var(--pixel-muted)] sm:text-base">
            Return to your drawing rooms and continue live sketch sessions with
            chat beside the board.
          </p>
          <button
            type="button"
            onClick={() => router.push("/sign-up")}
            className="pixel-button mt-6 px-4 py-3"
          >
            <UserPlus className="h-4 w-4" />
            Create account
          </button>
        </section>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="pixel-panel-strong space-y-5 p-5 sm:p-7"
        >
          <div className="flex items-center gap-3 border-b-2 border-[var(--pixel-line)] pb-4">
            <div className="grid h-11 w-11 place-items-center border-2 border-[var(--pixel-cyan)] bg-[#0f1320] shadow-[4px_4px_0_var(--pixel-ink)]">
              <KeyRound className="h-5 w-5 text-[var(--pixel-cyan)]" />
            </div>
            <div>
              <p className="pixel-label">Secure gate</p>
              <p className="font-mono text-xs font-bold uppercase text-[var(--pixel-muted)]">
                Existing account
              </p>
            </div>
          </div>

          <FeildValues
            label="Email"
            name="email"
            type="email"
            register={register}
          />
          <FeildValues
            label="Password"
            type="password"
            name="password"
            register={register}
          />
          <button
            type="submit"
            className="pixel-button pixel-button-primary w-full px-5 py-3"
          >
            Sign in
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </main>
    </div>
  );
};

export default SignIn;
