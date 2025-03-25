/**
 * Tests for the AuthService class.
 */
import bcrypt from "bcrypt";
import { authService } from "../../services/auth.service";
import { UserModel } from "../../models";
import { generateToken } from "../../lib/jwt";
import { AuthLogin } from "../../types";

jest.mock("../../models");
jest.mock("bcrypt");
jest.mock("../../lib/jwt");

describe("AuthService - login", () => {
  const mockUser = {
    _id: "12345",
    name: "Test User",
    email: "test@example.com",
    password: "hashedpassword",
    authorities: ["USER"],
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test: Should throw an error if the user does not exist.
   * Scenario: The email provided does not match any user in the database.
   */
  it("debería lanzar un error si el usuario no existe", async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(null);

    const loginData: AuthLogin = {
      email: "nonexistent@example.com",
      password: "123456",
    };

    await expect(authService.login(loginData)).rejects.toThrow(
      "User with that email does not exist"
    );

    expect(UserModel.findOne).toHaveBeenCalledWith({ email: loginData.email });
  });

  /**
   * Test: Should throw an error if the password is incorrect.
   * Scenario: The email exists, but the password provided does not match.
   */
  it("debería lanzar un error si la contraseña es incorrecta", async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const loginData: AuthLogin = {
      email: mockUser.email,
      password: "wrongpassword",
    };

    await expect(authService.login(loginData)).rejects.toThrow(
      "Incorrect password"
    );

    expect(bcrypt.compare).toHaveBeenCalledWith(
      loginData.password,
      mockUser.password
    );
  });

  /**
   * Test: Should return a token and user data if credentials are correct.
   * Scenario: The email and password provided are valid.
   */
  it("debería devolver un token y datos del usuario si las credenciales son correctas", async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (generateToken as jest.Mock).mockResolvedValue("mockedToken");

    const loginData: AuthLogin = {
      email: mockUser.email,
      password: "123456",
    };

    const result = await authService.login(loginData);

    expect(result).toEqual({
      user: {
        name: mockUser.name,
        email: mockUser.email,
      },
      token: "mockedToken",
      message: {
        content: "Login successful",
        code: 200,
      },
    });

    expect(UserModel.findOne).toHaveBeenCalledWith({ email: loginData.email });
    expect(bcrypt.compare).toHaveBeenCalledWith(
      loginData.password,
      mockUser.password
    );
    expect(generateToken).toHaveBeenCalledWith({
      user_id: mockUser._id.toString(),
      authorities: mockUser.authorities,
    });
  });

  /**
   * Test: Should handle unexpected errors.
   * Scenario: An unexpected error occurs during the login process.
   */
  it("debería manejar errores inesperados", async () => {
    (UserModel.findOne as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    const loginData: AuthLogin = {
      email: mockUser.email,
      password: "123456",
    };

    await expect(authService.login(loginData)).rejects.toThrow(
      "Database error"
    );

    expect(UserModel.findOne).toHaveBeenCalledWith({ email: loginData.email });
  });
});
