"use client";
import InitDraw from "@/draw";
import React, { useEffect, useRef } from "react";

const Canvas = () => {
  const cnavasref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
   
  
      if(!cnavasref.current)  return
      InitDraw(cnavasref.current);
     
  },[cnavasref]);
  return (
      <canvas ref={cnavasref}></canvas>
  );
};

export default Canvas;
