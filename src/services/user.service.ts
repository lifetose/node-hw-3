import { ApiError } from "../errors/api-error";
import { IUser } from "../interfaces/user.interface";
import { userRepository } from "../repositories/user.repository";

class UserService {
  public async getList(): Promise<IUser[]> {
    return await userRepository.getList();
  }

  public async create(dto: Partial<IUser>): Promise<IUser> {
    if (!dto.name || dto.name.length < 3) {
      throw new ApiError(
        "Name is required and should be at least 3 characters long",
        400,
      );
    }
    if (!dto.email || !dto.email.includes("@")) {
      throw new ApiError("Email is required and should be valid", 400);
    }
    if (!dto.password || dto.password.length < 6) {
      throw new ApiError(
        "Password is required and should be at least 6 characters long",
        400,
      );
    }
    return await userRepository.create(dto);
  }

  public async getById(userId: number): Promise<IUser> {
    const user = await userRepository.getById(userId);
    if (!user) {
      throw new ApiError("User not found", 404);
    }
    return user;
  }

  public async update(userId: number, dto: Partial<IUser>): Promise<IUser> {
    const user = await userRepository.getById(userId);
    if (!user) {
      throw new ApiError("User not found", 404);
    }

    if (dto.name && dto.name.length < 3) {
      throw new ApiError("Name should be at least 3 characters long", 400);
    }
    if (dto.email && !dto.email.includes("@")) {
      throw new ApiError("Email should be valid", 400);
    }
    if (dto.password && dto.password.length < 6) {
      throw new ApiError("Password should be at least 6 characters long", 400);
    }

    const updatedUser = {
      ...user,
      ...dto,
    };

    return await userRepository.update(userId, updatedUser);
  }

  public async delete(userId: number): Promise<void> {
    const user = await userRepository.getById(userId);
    if (!user) {
      throw new ApiError("User not found", 404);
    }
    await userRepository.delete(userId);
  }
}

export const userService = new UserService();
