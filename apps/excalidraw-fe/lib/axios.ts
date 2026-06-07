import { BACKEND_URL } from "@/config";
import axios from "axios";

export const api = axios.create({
    baseURL: BACKEND_URL
})

if(typeof window !== undefined){
    api.interceptors.request.use((config) => {
        const token = localStorage.getItem("token");
        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config;
    })
}