import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import UserModel, { IUserModel } from '../module/user';
import ResponseHelper from './responseHelper';

// Verifying the JWT token of user
export const isAuthenticated = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  if (
    req.headers &&
    req.headers.authorization 
  ) {
    jwt.verify(
      req.headers.authorization,
      `elSpectra`,
      (err: any, payload: any) => {
        err
          ? ResponseHelper(res, 403, false, err.message)
          : UserModel.findById(payload.id)
              .then((user: IUserModel | null) => {
                if (user) {
                  req.user = user;
                  next();
                } 
                else ResponseHelper(res, 401, false, 'Unauthorized');
              })
              .catch((err: Error) =>
                ResponseHelper(res, 500, false, err.message)
              );
      }
    );
  } else ResponseHelper(res, 401, false, 'Unauthorized');
};
// Verifying the the user admin or not
export const isAdmin = (req: any, res: Response, next: NextFunction) => {
  UserModel.findById(req.user._id)
    .select('role')
    .then((user: IUserModel | null) =>
      user && user.role === "admin"
        ? next()
        : ResponseHelper(res, 403, false, 'Forbidden')
    );
};
