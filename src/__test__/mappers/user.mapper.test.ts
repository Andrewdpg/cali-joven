import { userMapper } from "../../mappers/user.mapper";
import { UserDocument } from "../../models";
import { UserPublic } from "../../types";

describe("UserMapper", () => {
  const mockUser: UserDocument = {
    id: "507f191e810c19729de860ea",
    name: "Test User",
    email: "test@example.com",
  } as UserDocument;

  it("debería mapear un UserDocument a UserPublic", () => {
    const result: UserPublic = userMapper.DocumentToPublic(mockUser);

    expect(result).toEqual({
      _id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
    });
  });
});
