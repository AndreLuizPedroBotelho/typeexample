import { User } from './../models/user.model';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import "../config/env";

export const checkJwt = async (req: Request, res: Response, next: NextFunction) => {
  // Get the jwt token from the head
  try {
    const token = <string>req.headers.auth;
    let jwtPayload;

    // Try to validate the token and get data
    jwtPayload = <any>jwt.verify(token, process.env.JWT_SECRET);
    res.locals.jwtPayload = jwtPayload;
    // We want to send a new token on every request
    const { id, email } = jwtPayload;
    const user = await User.findByPk(id);

    if (!user) {
      throw "User not found";
    }
    const newToken = jwt.sign({ id, email }, process.env.JWT_SECRET, {});

    res.setHeader('token', newToken);

    // Call the next middleware or controller
    next();
  } catch (error) {

    // If token is not valid, respond with 401 (unauthorized)
    res.status(401).json('Not authorized');
    return;
  }


};
