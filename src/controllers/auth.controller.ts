import { AuthInterface } from './../models/user.model';
import * as express from 'express';
import { User, UserInterface } from "../models/user.model";
import { FindOptions } from "sequelize";
import bcrypt from "bcryptjs";
import "../config/env";
import jwt from "jsonwebtoken";
import { Body, Delete, Request, Response, Example, Get, Patch, Post, Route } from 'tsoa';

export class AuthController {

  /**
   * @method POST
   * @params JSON [[AuthInterface]]
   * @route /login
   * @acces public
   * @async
   */
  public async login(@Body() req: express.Request, @Response('') res: express.Response, next: express.NextFunction) {
    try {

      const { password, email }: AuthInterface = req.body;

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