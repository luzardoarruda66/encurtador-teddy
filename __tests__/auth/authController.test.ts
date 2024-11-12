import { Request, Response } from "express";
import User from "../../src/models/user";
import { login, signup } from "../../src/controllers/authController";
import bcrypt from "bcryptjs";

jest.mock("../../src/models/user.ts");

describe("Auth Controler", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    req = { body: {} };
    res = { status: jest.fn().mockReturnThis(), json: jsonMock };
  });

  describe("signup", () => {
    it("When user is created successfully", async () => {
      req.body = {
        username: "testuser",
        email: "test@test.com",
        password: "passwordMock123",
      };
      (User.create as jest.Mock).mockResolvedValue({ id: 1, ...req.body });

      await signup(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "User has been created !",
        userId: 1,
      });
    });

    it("Must return error when fail to create user", async () => {
      req.body = {
        username: "testuser",
        email: "test@test.com",
        password: "aCoolPassword",
      };
      (User.create as jest.Mock).mockRejectedValue(
        new Error("Failure to create an user")
      );

      await signup(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: "Failure to create an user",
      });
    });
  });

  describe("login", () => {
    it("When user is authenticated with success", async () => {
      req.body = { email: "test@test.com", password: "password123" };
      (User.findOne as jest.Mock).mockResolvedValue({
        id: 1,
        email: req.body.email,
        password: "$a%encrypted#p@ssw0rd",
      });
      jest
        .spyOn(bcrypt, "compare")
        .mockImplementation(() => Promise.resolve(true));
      await login(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({ message: "User logged!" })
      );
    });

    it("Must return error when credentials is invalid", async () => {
      req.body = { email: "test@example.com", password: "wrongpassword" };
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await login(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        error: "Username/password is incorrect",
      });
    });
  });
});
