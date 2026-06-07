"use client"
import {useRouter} from "next/navigation";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { api } from "../../../utils/axiox";

interface Ifeildvalues {
  email: string;
  password: string
}
const SignIn = () => {
  const { register, handleSubmit, reset } = useForm<Ifeildvalues>();
  const router = useRouter()
  const onSubmit: SubmitHandler<Ifeildvalues> = async (data) => {
    try {
      const response = await api.post("/user/signin", data);
      
      if (response.status === 200) {
        localStorage.setItem('token', response.data?.token)
        reset()
        router.push("/room")
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" {...register("email")} />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" {...register("password")} />
        </div>
        <button type="submit">sign in</button>
      </form>
    </div>
  );
};

export default SignIn;
