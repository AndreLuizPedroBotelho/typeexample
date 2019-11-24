import { User } from './../models/user.model';
import { check } from 'express-validator';


export class UserValidation {
  public validation = [
    check('name', 'Name must be less than 255 characters').optional().isLength({ max: 255 }),
    check('name', 'Invalid name').optional().isString(),
    check('email', 'Email must be less than 255 characters').optional().isLength({ max: 128 }),
    check('email', 'Invalid email').optional().isEmail(),
    check('email', 'User with this email already exists').optional().custom((value) => {
      return new Promise((resolve, reject) => {
        if (typeof value === 'string') {
          User.findOne({
            where: {
              email: value
            }
          }).then((user: User) => (user) ? reject() : resolve())
        } else {
          resolve()
        }

      })
    }),
    check('password', 'Password must be less than 255 characters').optional().isLength({ max: 128 }),
    check('password', 'The password must be at least 6 characters').optional().isLength({ min: 6 }),
    check('password', 'Invalid password').optional().isString(),
  ];

  public validationCreate = [
    check('name', 'Name is required').exists(),
    check('email', 'Email is required').exists(),
    check('password', 'Password is required').exists(),
    ...this.validation
  ]

}