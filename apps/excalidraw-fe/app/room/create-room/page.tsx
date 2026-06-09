"use client";
import { api } from "@/lib/axios";
import { getToken } from "@/utils/token";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

const Page = () => {
  const token = getToken();
  const router = useRouter();
  if (!token) {
    router.push("/sing-in");
  }

  const { register, handleSubmit } = useForm<{ name: string }>();
  const onSubmit = async (data: { name: string }) => {
    const response = await api.post("/room/create-room", data);
    const roomId = response.data.data.id;
    router.push(`/canvas/${roomId}`);
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name">Name</label>
        <input
          {...register("name")}
          type="text"
          id="name"
          defaultValue={"Untitled"}
        />
        <div>
          <button type="submit">create</button>
        </div>
      </form>
    </div>
  );
};

export default Page;
