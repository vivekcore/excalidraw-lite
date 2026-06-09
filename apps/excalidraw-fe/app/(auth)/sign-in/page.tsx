"use client";
import { FeildValues } from "@/components/AuthForm";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface ISignin {
  email: string;
  password: string;
}
const SignIn = () => {
  const { register, handleSubmit } = useForm<ISignin>();
  const router =  useRouter()
  const onSubmit = async (data: ISignin) => {
    try {
      const response = await api.post("/user/signin", data);
      localStorage.setItem("token",response.data.data)
      router.push("/room")
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
        <button type="submit">
          sign In
        </button>
      </form>
    </div>
  );
};

export default SignIn;
