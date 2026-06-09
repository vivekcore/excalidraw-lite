"use client";
import { FeildValues } from "@/components/AuthForm";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface ISignUp {
  name: string;
  email: string;
  password: string;
}
const SignUp = () => {
  const { register, handleSubmit } = useForm<ISignUp>();
  const router = useRouter();
  const onSubmit = async (data: ISignUp) => {
    try {
      const response = await api.post("/user/signup", data);
      localStorage.setItem("token",response.data.data.token)
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
