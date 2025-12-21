import bcrypt from 'bcrypt'

import { ApiError } from "../errors/apiError";
import { userRepository } from "../repositories/userRepository"

type user = {
  handle: string;
  name: string;
  avatarUrl: string;
  profile: string | null;
  followersCount: number;
  followingsCount: number;
}

export const userService = {
  async login(email: string, password: string): Promise<user> {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new ApiError('authentication_error', 'ユーザーが存在しません');
    }

    const ok =  bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      throw new ApiError('authentication_error', 'ユーザーが存在しません');
    }
    return user;
  },

  async signup(name: string, email: string, password: string) {
    const handle = name + Math.random();
    const user = await userRepository.insertUser(name, handle, email, password);
    if (!user) {
      throw new ApiError('database_error', '新規登録に失敗しました');
    }

    const sameEmail = await userRepository.findByEmail(email);
    if (!sameEmail) {
      throw new ApiError('duplicate_error', 'そのメールアドレスは既に使用されています');
    }

    return user;
  } 
}