import axios from "axios";
import { DATABASE_URL } from "../config";

export const api = axios.create({
    baseURL: `${DATABASE_URL}`
});

if (typeof window !== "undefined") {
    api.interceptors.request.use((config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });
}