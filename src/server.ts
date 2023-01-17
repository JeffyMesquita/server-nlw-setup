import Fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';

const app = Fastify();
const prisma = new PrismaClient();

app.register(cors);

app.get('/habits', async () => {
  const habits = await prisma.habit.findMany();

  return { habits, message: 'success' };
});

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('listening on port 3333, HTTP Server running');
  });
