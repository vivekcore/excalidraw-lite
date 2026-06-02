import { prisma } from "@repo/db";

export async function GenerateSlug(){
  
    const string = "abcdefghijklmnopqrstuvwxyz1234567890";
    let slug = "";
    for (let i = 0; i < 10; i++) {
      const index = Math.floor(Math.random() * 36);
      slug += string[index];
    }
    
    let counter = 1;
    while(await prisma.room.findUnique({where:{slug}})){
        slug += counter
        counter++;
    }
    return slug;

}
