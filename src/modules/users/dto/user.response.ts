import { EUserRole } from "generated/prisma";

export interface UserResponse{
  name: string;
  email: string;
  role: EUserRole;
  isActive: boolean;
}