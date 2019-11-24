import { UserValidation } from './../validations/user.validation';

import { UserController } from "../controllers/user.controller";
import { AuthController } from "../controllers/auth.controller";


import { checkJwt } from "../middlewares/checkJwt";

export class Routes {
  //Controllers
  public usersController: UserController = new UserController();
  public authController: AuthController = new AuthController();

  //Validations
  public userValidation: UserValidation = new UserValidation();

  public routes(app): void {
    //Public
    app.route("/login")
      .post(this.authController.login);

    app
      .route("/users")
      .post(this.userValidation.validationCreate, this.usersController.create);

    //Private
    app
      .route("/users")
      .get([checkJwt], this.usersController.index);

    app
      .route("/users/:id")
      .get([checkJwt], this.usersController.show)
      .put([checkJwt], this.userValidation.validation, this.usersController.update)
      .delete([checkJwt], this.usersController.delete);
  }
}