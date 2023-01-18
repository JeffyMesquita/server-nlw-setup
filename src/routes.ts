import dayjs from 'dayjs';
import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from './lib/prisma';

export async function appRoutes(app: FastifyInstance) {
  app.post('/habits', async (request, response) => {
    const createHabitBody = z.object({
      title: z.string(),
      weekDays: z.array(z.number().min(0).max(6)),
    });

    const { title, weekDays } = createHabitBody.parse(request.body);

    const today = dayjs().startOf('day').toDate();

    const habit = await prisma.habit.create({
      data: {
        title,
        created_at: today,
        weekDays: {
          create: weekDays.map((weekDay) => {
            return {
              week_day: weekDay,
            };
          }),
        },
      },
    });

    return response.status(201).send({
      message: 'Sucesso ao criar hábito',
      result: 'success',
      data: habit,
    });
  });

  app.get('/day', async (request, response) => {
    const getDayParams = z.object({
      date: z.coerce.date(),
      // coerce -> converte o parâmetro de string para data
    });

    const { date } = getDayParams.parse(request.query);
    const parsedDate = dayjs().startOf('day');
    const weekDay = parsedDate.get('day');

    const possibleHabits = await prisma.habit.findMany({
      where: {
        created_at: {
          lte: date,
          // verifica se data é menor ou igual
        },
        weekDays: {
          some: {
            week_day: weekDay,
          },
        },
      },
    });

    const day = await prisma.day.findUnique({
      where: {
        date: parsedDate.toDate(),
      },
      include: {
        dayHabits: true,
      },
    });

    const completedHabits = day?.dayHabits.map((dayHabit) => {
      return dayHabit.habit_id;
    });

    return response.status(200).send({
      message: 'Sucesso listar hábitos',
      result: 'success',
      data: { possibleHabits, completedHabits },
    });
  });
}
