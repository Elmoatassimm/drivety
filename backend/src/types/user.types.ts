export enum UserRole {
  ADMIN = 'ADMIN',
  DRIVER = 'DRIVER',
  MANAGER = 'MANAGER',
  TECHNICIAN = 'TECHNICIAN',
  USER = 'USER'
}

export interface IAuthUser {
  id: string;
  email: string;
  role: UserRole;
  username?: string;
}
