import * as z from "zod";

export const createTodoScheam = z.object({
  title: z.string().min(3).max(150),
  description: z.string(),
  dueDate: z.coerce.date(),
  priority: z.number(),
  workspaceId: z.string().nonempty(),
});
