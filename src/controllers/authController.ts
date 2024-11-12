import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/user";
import jwt from "jsonwebtoken";

export const signup = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    res.status(201).json({ message: "User has been created !", userId: user.id });
  } catch (error) {
    res.status(500).json({ error: "Failure to create an user" });
  }
};

export const login = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ error: "Username/password is incorrect" });
      return;
    }
    const token = jwt.sign({ userId: user.id }, "sua_chave_secreta", {
      expiresIn: "1h",
    });
    res.status(200).json({ message: "User logged!", token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
