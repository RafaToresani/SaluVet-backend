import { User } from "generated/prisma";
import { UserResponse } from "src/modules/users/dto/user.response";

export function userToUserResponse(user:User): UserResponse {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
  }
}