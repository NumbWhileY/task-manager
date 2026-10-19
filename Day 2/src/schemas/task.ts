import { z } from 'zod';

const taskSchema = z.object({
    title: z.string().trim().min(1, 'title обязателен').max(255, 'Максимум 255 символов'),
    description: z.string().trim().max(1000, 'Максимум 1000 символов').optional(),
});

export type TaskInput = z.infer<typeof taskSchema>;

export { taskSchema };