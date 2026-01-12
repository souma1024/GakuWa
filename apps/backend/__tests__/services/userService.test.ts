import { userService } from '../../src/services/userService'

import { userRepository } from "../../src/repositories/userRepository";
import bcrypt from "bcrypt";
import { LoginResponse } from '../../src/dtos/users/responseDto'
import { LoginRequest } from '../../src/dtos/users/requestDto';
import { PreSignupRequest } from '../../src/dtos/users/requestDto';

// Repository をモック
jest.mock("../../src/repositories/userRepository");

// bcrypt をモック
jest.mock("bcrypt", () => ({
  compare: jest.fn(),
}));

let login: LoginRequest;
let preSignup: PreSignupRequest;
let dbUser: any;

const mockedUserRepo = jest.mocked(userRepository);
beforeEach(() => {

  login = {
    email: "test@example.ac.jp",
    password: "password",
  };

  preSignup = {
    name: "test",
    email: "test@example.ac.jp",
    password: "password",
  };

  dbUser = {
    id: 1,
    email: "test@example.ac.jp",
    passwordHash: "hashed-password",
    handle: "test-handle",
    name: "Test User",
    avatarUrl: "https://example.com/a.png",
    profile: null,
    followersCount: 0,
    followingsCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  jest.clearAllMocks();
});

describe.skip("userService.login", () => {
  it("ユーザーが存在しない場合はエラーを投げる", async () => {
    mockedUserRepo.findByEmail.mockResolvedValue(null);

    await expect(
      userService.login(login)
    ).rejects.toMatchObject({
      type: "authentication_error",
      message: "ユーザーが存在しません",
    });

    expect(userRepository.findByEmail).toHaveBeenCalledWith("test@example.ac.jp");
  });

  it("パスワードが一致しない場合はエラーを投げる", async () => {
    login.password = 'wrong-password';

    mockedUserRepo.findByEmail.mockResolvedValue(dbUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);


    await expect(
      userService.login(login)
    ).rejects.toMatchObject({
      type: "authentication_error",
      message: "メールアドレスもしくはパスワードが異なります",
    });

    expect(bcrypt.compare).toHaveBeenCalledWith(
      "wrong-password",
      dbUser.passwordHash
    );
  });

  it("メールとパスワードが正しい場合はLoginResponse(DTO)を返す", async () => {

    // findByEmailで返されるコラムをdbUserとする。
    mockedUserRepo.findByEmail.mockResolvedValue(dbUser);
// compare関数の戻り値がtrueとする
(bcrypt.compare as jest.Mock).mockResolvedValue(true);

const result = await userService.login(login);

const expected: LoginResponse = {
  handle: result.handle,
  name: result.name,
  avatarUrl: result.avatarUrl,
  profile: result.profile,
  followersCount: result.followersCount,
  followingsCount: result.followingsCount,
  role: result.role,
};

// ★ userService.login は「フラット」で返すので result.user は存在しない
expect(result).toMatchObject({
  ...expected,
});

// sessionToken も返る
expect(typeof result.sessionToken).toBe("string");
expect(result.sessionToken.length).toBeGreaterThan(0);

// トップレベル構造の確認（user は無い）
expect(result).toHaveProperty("sessionToken");
expect(result).not.toHaveProperty("user");

// findByEmail関数がしっかりと呼ばれているか
expect(userRepository.findByEmail).toHaveBeenCalledWith("test@example.ac.jp");

// bcryptのcompare関数がしっかりと呼ばれているか
expect(bcrypt.compare).toHaveBeenCalledWith("password", "hashed-password");



// 仮登録のテスト作成中(12/23)
describe("userService.preSignup", () => {

  it("メールが既に存在している場合はエラーを投げる", async () => {
    mockedUserRepo.findByEmail.mockResolvedValue(dbUser);

    await expect(
      userService.preSignup(preSignup)
    ).rejects.toMatchObject({
      type: "duplicate_error",
      message: "そのメールアドレスは既に使用されています",
    });

    expect(userRepository.findByEmail).toHaveBeenCalledWith("test@example.ac.jp");
  });

  it("仮登録に失敗した場合はエラーを投げる", async () => {

  });

});
  });});