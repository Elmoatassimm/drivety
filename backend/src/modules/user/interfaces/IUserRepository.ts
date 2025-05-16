import { User } from "@prisma/client";

export interface IUser extends User {
  username?: string;
  password_hash?: string;
}

export default interface IUserRepository {
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  createUser(data: { email: string; password_hash: string; username: string }): Promise<IUser>;
  updatePassword(id: string, password: string): Promise<IUser>;
  getProfile(id: string): Promise<Partial<IUser> | null>;
}
