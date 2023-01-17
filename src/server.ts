import Fastify from "fastify";
import { PrismaClient } from "@prisma/client";

const app = Fastify();
const prisma = new PrismaClient();

app.get('/habits', async () => {
  const habits = await prisma.habits.findMany({
    where: {
      title : {
        startsWith: 'Beber'
      }
    }
  })
  
  return {habits, message: 'Bia te Amo S2!!!'};
});

app.listen({
  port: 3333,
}).then(() => {
  console.log('listening on port 3333, HTTP Server running');
})