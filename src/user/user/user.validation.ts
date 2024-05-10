import { ZodType, z } from 'zod';

export class UserValidation {
  static readonly CREATE: ZodType = z.object({
    full_name: z.string().min(3),
    email: z.string().email(),
    username: z.string().min(6),
    password: z.string().min(6),
    avatar_path: z
      .any()
      .optional()
      .transform((value: unknown) => <Express.Multer.File>value),
  });
}
