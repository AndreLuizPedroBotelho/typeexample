import { Request, Response, NextFunction } from "express";
import { User, UserInterface } from "../models/user.model";
import { FindOptions } from "sequelize";
import bcrypt from "bcryptjs";
import "../config/env";
import jwt from "jsonwebtoken";

export class AuthController {

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { password, email }: UserInterface = req.body;

      const options: FindOptions = {
        where: { email: email }
      };

      const user: User = await User.findOne<User>(options);

      if (!bcrypt.compareSync(password, user.passwordHash)) {
        res.status(401).json({ data: "User not found" });
        return;
      }
      //Sing JWT, valid for 1 hour
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.json({
        'id': user.id,
        'name': user.name,
        'token': token
      })

      return next();

    } catch (err) {
      res.status(500).json(err);
    }
  }

}