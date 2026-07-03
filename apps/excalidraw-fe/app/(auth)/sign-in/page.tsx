"use client";
import { FeildValues } from "@/components/AuthForm";
import { api } from "@/lib/axios";
import { getToken } from "@/utils/token";
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
      localStorage.setItem("token", response.data.data);
      router.push("/room");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FeildValues
          label="Email"
          name="email"
          type="email"
          register={register}
        />
        <FeildValues
          label="password"
          type="password"
          name="password"
          register={register}
        />
        <button type="submit">sign In</button>
      </form>
    </div>
  );
};

export default SignIn;
