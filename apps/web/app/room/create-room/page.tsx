"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "../../../utils/axiox";
interface ICreateRoom {
  name: string;
}
interface IRooms {
  id:number,
  slug:string,
  name:string,
  createdAt:string
}
const CreateRoom = () => {
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<ICreateRoom>();
  const [slug, setSlug] = useState();
  const [isRoomCreated, setIsRoomCreated] = useState<boolean>(true);
  const [rooms, setRooms] = useState<IRooms[]>([]);
  const [host,setHost] = useState<string>()
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || token === null) {
      router.push("/auth");
      return;
    }
    setHost(window.location.host);
  }, [router]);

  useEffect(() => {
    const GetMyRooms = async () => {
      try {
        const myRoom = await api.get("/room/my-rooms");
        setRooms(myRoom.data?.data);
      } catch (error) {
        console.log(error);
      }
    };
    GetMyRooms();
  }, [slug]);

  const onSubmit = async (data: ICreateRoom) => {
    try {
      const response = await api.post("/room/create-room", {
        name: data.name,
      });
      setSlug(response.data?.data?.slug);
      setIsRoomCreated(!isRoomCreated);
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <button onClick={() => router.push("/room")}>{"<-- Back"}</button>
      <div>
        <div>
          <h1>Create Room</h1>
        </div>
        <button onClick={() => router.push("/room/join-room")}>JOIN ROOM </button>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="name">Room Namt</label>
              <input
                type="text"
                id="name"
                defaultValue={"Untitled"}
                {...register("name")}
              />
            </div>
            <button type="submit">create</button>
          </form>
        </div>
      </div>
      <div>
        <div hidden={isRoomCreated}>
          <div>
            <input type="text" defaultValue={slug} disabled />
            <button
              onClick={async () => {
                await navigator.clipboard.writeText(slug || "");
                window.alert(slug + " copied to clipboard");
              }}
            >
              Copy
            </button>
          </div>
          <input type="text" defaultValue={`${host}/slug/${slug}`} disabled />
          <button onClick={() => router.push(`/slug/${slug}`)}>
            vist
          </button>
        </div>
      </div>
      <div>
        <div>
          <h1>Your Rooms</h1>
          <div>
            {rooms.length === 0 ? (
              <div>
                <div>You did not created any room create one</div>
              </div>
            ) : (
              <div>
                {
                  rooms.map((val) => (
                    <div key={val?.id}>
                      <div>
                        <p>name: {val?.name}</p>
                        <input value={val?.slug} disabled/>
                        <button onClick={ async() => {
                          await navigator.clipboard.writeText(val.slug);
                          window.alert(val.slug + " copied to clipboard")
                        }}>Copy</button>
                      </div>
                        <p>CreatedAt: {val.createdAt}</p>
                        <br/>
                        <br />
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
