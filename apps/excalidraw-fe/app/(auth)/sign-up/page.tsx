"use client";
import { FeildValues } from "@/components/AuthForm";
import { api } from "@/lib/axios";
import { getToken } from "@/utils/token";
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
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
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
        <button type="submit">submit</button>
      </form>
    </div>
  );
};

export default SignUp;
