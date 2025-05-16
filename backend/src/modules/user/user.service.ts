import { inject, injectable } from "tsyringe";
import { BaseService } from "../../core/base/BaseService";
import { IUser } from "./interfaces/IUserRepository";
import IUserRepository from "./interfaces/IUserRepository";
import { UserRepository } from "./user.repository";

@injectable()
export class UserService extends BaseService<IUser> {
  protected entityName = "User";

  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository,
    @inject(UserRepository) repository: UserRepository
  ) {
    super(repository);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.userRepository.findByEmail(email);
  }

  async createUser(data: { email: string; password_hash: string; username: string }): Promise<IUser> {
    return this.userRepository.createUser(data);
  }

  async updatePassword(id: string, password: string): Promise<IUser> {
    return this.userRepository.updatePassword(id, password);
  }

  async getProfile(id: string): Promise<Partial<IUser> | null> {
    return this.userRepository.getProfile(id);
  }
}
