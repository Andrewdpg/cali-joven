import bcrypt from "bcrypt";
import { authService } from "../../services/auth.service";
import { UserModel } from "../../models";
import { generateToken } from "../../lib/jwt";
import { AuthLogin } from "../../types";

jest.mock("../../models"); // Mock del modelo de usuario
jest.mock("bcrypt"); // Mock de bcrypt
jest.mock("../../lib/jwt"); // Mock de la función generateToken

describe("AuthService - login", () => {
  const mockUser = {
    name: "Test User",
    email: "test@example.com",
    password: "hashedpassword",
    authorities: ["USER"],
  };

  it("debería lanzar un error si el usuario no existe", async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(null);

    const loginData: AuthLogin = {
      email: "nonexistent@example.com",
      password: "123456",
    };

    await expect(authService.login(loginData)).rejects.toThrow(
      "User with that email does not exist"
    );
  });

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
  });

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
  });
});
