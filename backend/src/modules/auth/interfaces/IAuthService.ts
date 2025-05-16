import { TAuthToken } from "../../../types/types";

export default interface IAuthService {
  register(email: string, password: string, username: string): Promise<TAuthToken>;
  login(email: string, password: string): Promise<TAuthToken>;
  refreshTokens(refreshToken: string): Promise<TAuthToken>;
  logout(token: string): Promise<void>;
}
