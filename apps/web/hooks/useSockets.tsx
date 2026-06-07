import { useEffect, useState } from "react";
import {  WS_URL } from "../config";
import { getToken } from "../utils/token";

export function useSocket() {
    const [loading,setLoading] = useState(true);
    const [socket,setSocket] = useState<WebSocket>();

    useEffect(() => {
        const token = getToken()
        if (!token) {
            setLoading(false);
            return;
        }
        const ws = new WebSocket(`${WS_URL}?token=${token}`);
        ws.onopen = () => {
            setLoading(false);
            setSocket(ws);
        }
    },[])

    return {
        socket,
        loading
    }
}