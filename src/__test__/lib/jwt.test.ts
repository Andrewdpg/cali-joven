import jwt from "jsonwebtoken";
import { generateToken } from "../../lib/jwt";
import { env } from "../../config";

jest.mock("jsonwebtoken");

describe("generateToken", () => {
  const mockPayload = { user_id: "123", authorities: ["user"] };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debería generar un token si JWT_SECRET está definido", async () => {
    const mockToken = "mocked.jwt.token";
    (jwt.sign as jest.Mock).mockImplementation(
      (payload, secret, options, callback) => {
        callback(null, mockToken);
      }
    );

    const result = await generateToken(mockPayload);

    expect(result).toBe(mockToken);
    expect(jwt.sign).toHaveBeenCalledWith(
      mockPayload,
      env.JWT_SECRET,
      { expiresIn: "30d" },
      expect.any(Function)
    );
  });

  it("debería lanzar un error si jwt.sign falla", async () => {
    (jwt.sign as jest.Mock).mockImplementation(
      (payload, secret, options, callback) => {
        callback(new Error("Token generation error"), null);
      }
    );

    await expect(generateToken(mockPayload)).rejects.toThrow(
      "Token generation error"
    );
  });

  it("debería lanzar un error si no se genera un token", async () => {
    (jwt.sign as jest.Mock).mockImplementation(
      (payload, secret, options, callback) => {
        callback(null, null); // Simula que no se genera un token
      }
    );

    await expect(generateToken(mockPayload)).rejects.toThrow(
      "Token generation failed"
    );
  });
});
