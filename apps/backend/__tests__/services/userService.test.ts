import { userService } from '../../src/services/userService'

import { userRepository } from "../../src/repositories/userRepository";
import bcrypt from "bcrypt";
import { LoginResponse } from '../../src/dtos/users/responseDto'

// Repository をモック
jest.mock("../../src/repositories/userRepository");

// bcrypt をモック
jest.mock("bcrypt", () => ({
  compare: jest.fn(),
}));

const mockUser = {
  id: 1,
  email: "test@example.ac.jp",
  passwordHash: "hashed-password",
  name: "Test User",
};

describe("userService.login", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("ユーザーが存在しない場合はエラーを投げる", async () => {
    (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);

    await expect(
      userService.login("test@example.ac.jp", "password")
    ).rejects.toMatchObject({
      type: "authentication_error",
      message: "ユーザーが存在しません",
    });

    expect(userRepository.findByEmail).toHaveBeenCalledWith("test@example.ac.jp");
  });

  it("パスワードが一致しない場合はエラーを投げる", async () => {
    (userRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      userService.login("test@example.ac.jp", "wrong-password")
    ).rejects.toMatchObject({
      type: "authentication_error",
      message: "ユーザーが存在しません",
    });

    expect(bcrypt.compare).toHaveBeenCalledWith(
      "wrong-password",
      mockUser.passwordHash
    );
  });

  it("メールとパスワードが正しい場合はLoginResponse(DTO)を返す", async () => {

    const dbUser = {
      id: 1,
      email: "test@example.com",
      passwordHash: "hashed-password",
      handle: "test-handle",
      name: "Test User",
      avatarUrl: "https://example.com/a.png",
      profile: null,
      followersCount: 0,
      followingsCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // findByEmailで返されるコラムをdbUserとする。
    (userRepository.findByEmail as jest.Mock).mockResolvedValue(dbUser);

    // compare関数の戻り値がtrueとする
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await userService.login("test@example.ac.jp", "correct-password");

    const expected: LoginResponse = {
      handle: "test-handle",
      name: "Test User",
      avatarUrl: "https://example.com/a.png",
      profile: null,
      followersCount: 0,
      followingsCount: 0,
    };

    // login関数で返すusersテーブルのコラム
    expect(result).toEqual(expected);

    // login関数で返さないusersテーブルのコラム
    expect(Object.keys(result).sort()).toEqual(Object.keys(expected).sort());

    // findByEmail関数がしっかりと呼ばれているか
    expect(userRepository.findByEmail).toHaveBeenCalledWith("test@example.ac.jp");

    // bcryptのcompare関数がしっかりと呼ばれているか
    expect(bcrypt.compare).toHaveBeenCalledWith("correct-password", "hashed-password");
  });
});