import { User } from "@prisma/client";
import { UserRole } from "../../../types/user.types";

export interface IUser extends Omit<User, 'role'> {
  username?: string;
  password_hash?: string;
  role: UserRole;
}

export interface CreateUserData {
  email: string;
  password_hash: string;
  username: string;
  role?: UserRole;
}

export default interface IUserRepository {
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  createUser(data: CreateUserData): Promise<IUser>;
  updatePassword(id: string, password: string): Promise<IUser>;
  getProfile(id: string): Promise<Partial<IUser> | null>;
}
