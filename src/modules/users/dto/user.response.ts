import { EUserRole } from "generated/prisma";

export interface UserResponse{
  id: string;
  name: string;
  email: string;
  role: EUserRole;
  isActive: boolean;
}