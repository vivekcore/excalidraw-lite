"use client";
import { FeildValues } from "@/components/AuthForm";
import { api } from "@/lib/axios";
import { useForm } from "react-hook-form";

interface ISignin {
  email: string;
  password: string;
}
const SignIn = () => {
  const { register, handleSubmit } = useForm<ISignin>();
  const onSubmit = async (data: ISignin) => {
    try {
      const response = await api.post("/user/signin", data);
      const token = response.data?.data.token as string;
      localStorage.setItem("token", token);
    } catch (error) {
        console.log(error)
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
      </form>
    </div>
  );
};

export default SignIn;
