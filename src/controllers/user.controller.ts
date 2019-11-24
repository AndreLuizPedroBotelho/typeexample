import { Request, Response } from "express";
import { User, UserInterface } from "../models/user.model";
import { UpdateOptions, DestroyOptions } from "sequelize";
import bcrypt from "bcryptjs";
import { check, validationResult } from 'express-validator';

export class UserController {
  public async index(req: Request, res: Response) {
    try {
      const user: Array<User> = await User.findAll<User>({
        attributes: {
          exclude: ['passwordHash']
        }
      })
      res.json(user);

    } catch (err) {
      res.status(500).json(err);
    }
  }

  public async create(req: Request, res: Response) {

    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
      }

      const params: UserInterface = req.body;
      params.passwordHash = bcrypt.hashSync(params.password, 8);

      const user: User = await User.create<User>(params);

      (user) ? res.status(200).json({ data: "User create with success" }) : res.status(404).json({ errors: ["User doesn't create"] });

    } catch (err) {
      res.status(500).json(err);
    }
  }

  public async show(req: Request, res: Response) {
    try {
      const userId: number = parseInt(req.params.id);

      const user: User | null = await User.findByPk<User>(userId, {
        attributes: { exclude: ['passwordHash'] }
      });

      (user) ? res.json(user) : res.status(404).json({ errors: ["User not found"] });

    } catch (err) {
      res.status(500).json(err);
    }

  }

  public async update(req: Request, res: Response) {
    try {
      const userId: number = parseInt(req.params.id);
      const params: UserInterface = req.body;

      if (params.password) {
        params.passwordHash = bcrypt.hashSync(params.password, 8);
      }

      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
      }

      const options: UpdateOptions = {
        where: { id: userId },
        returning: true,
        limit: 1
      };

      const [_, user] = await User.update(params, options);
      (user) ? res.status(202).json({ data: "User update with success" }) : res.status(404).json({ errors: ["User not found"] });

    } catch (err) {
      res.status(500).json(err);

    }

  }

  public async delete(req: Request, res: Response) {
    try {
      const userId: number = parseInt(req.params.id);

      const options: DestroyOptions = {
        where: { id: userId },
        limit: 1
      };

      const user = await User.destroy(options);

      (user) ? res.status(202).json({ data: "User delete with success" }) : res.status(404).json({ errors: ["User not found"] });


    } catch (err) {
      res.status(500).json(err);

    }
  }
}