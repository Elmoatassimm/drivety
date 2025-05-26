export enum UserRole {
  ADMIN = 'ADMIN',
  DRIVER = 'DRIVER'
}

export interface IAuthUser {
  id: string;
  email: string;
  role: UserRole;
  username?: string;
}
