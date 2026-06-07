"use client";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { api } from "../../../utils/axiox";

interface Ifeildvalues {
  name: string;
  email: string;
  password: string;
}
const SignUp = () => {
  const { register, handleSubmit, reset } = useForm<Ifeildvalues>();
  const onSubmit: SubmitHandler<Ifeildvalues> = async (data) => {
    try {
      const response = await api.post("/user/signup", data);

      if (response.status === 200) {
        reset();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" {...register("name")} />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" {...register("email")} />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" {...register("password")} />
        </div>
        <button type="submit">Sign up</button>
      </form>
    </div>
  );
};

export default SignUp;
