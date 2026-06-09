export default function InitDraw(
  canvas: HTMLCanvasElement,

) {
  const ctx = canvas.getContext("2d");
if (!ctx) return;
 canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

let clicked = false;
let startX = 0;
let startY = 0;

canvas.addEventListener("mousedown", (e) => {
  clicked = true;
  startX = e.offsetX;
  startY = e.offsetY;
});

canvas.addEventListener("mouseup", () => {
  clicked = false;
});
canvas.addEventListener("mouseleave",() => {
    clicked = false;
})
canvas.addEventListener("mousemove", (e) => {
  if (!clicked) return;

  const width = e.offsetX - startX;
  const height = e.offsetY - startY;

  ctx.fillStyle = "black";                          
  ctx.fillRect(0, 0, canvas.width, canvas.height);  
  ctx.strokeStyle = "yellow";
  ctx.strokeRect(startX, startY, width, height);   
});

}
