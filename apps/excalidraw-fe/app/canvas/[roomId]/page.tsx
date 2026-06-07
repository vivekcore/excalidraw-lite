


"use client";
import React, { useEffect, useRef } from 'react'

const Canvas = () => {
const cnavasref = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if(cnavasref.current){
            const canvas = cnavasref.current;
            const ctx = canvas.getContext("2d");
            ctx?.fillRect(25,25,100,100);
        }
    })
  return (
    <div>page</div>
  )
}

export default Canvas