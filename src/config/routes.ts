import { UserValidation } from '../validations/user.validation';

import { UserController } from '../controllers/user.controller';
import { AuthController } from '../controllers/auth.controller';


import { checkJwt } from '../middlewares/checkJwt';

export class Routes {
  /**
   * @Controllers
   * @public
   */
  public usersController: UserController = new UserController();

  /**
   * @Controllers
   * @public
   */
  public authController: AuthController = new AuthController();

  /**
   * @Validations
   * @public
   */
  public userValidation: UserValidation = new UserValidation();

  /**
   * @Routes
   * @public
   */
  public routes(app): void {
    /**
     * @public
     */
    app.route('/login')
      .post(this.authController.login);

    /**
     * @public
     */
    app
      .route('/users')
      .post(this.userValidation.validationCreate, this.usersController.create);

    /**
     * @private
     */
    app
      .route('/users')
      .get([checkJwt], this.usersController.index);

    /**
     * @private
     */
    app
      .route('/users/:id')
      .get([checkJwt], this.usersController.show)
      .put([checkJwt], this.userValidation.validation, this.usersController.update)
      .delete([checkJwt], this.usersController.delete);
  }
}
