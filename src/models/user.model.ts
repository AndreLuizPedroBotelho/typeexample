import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import { database } from '../config/database';

export class User extends Model {
  public id: number;

  public name: string;

  public email: string;

  public password: string;

  public passwordHash: string;

  public readonly createdAt: Date;

  public readonly updatedAt: Date;
}

export interface UserInterface {
  id: number;
  name: string;
  email: string;
  password: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSaveInterface {
  name: string;
  email: string;
  password: string;
}
export interface AuthInterface {
  email: string;
  password: string;
}

User.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      field: 'id',
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(255),
      allowNull: false,
      field: 'name',
    },
    email: {
      type: new DataTypes.STRING(128),
      unique: true,
      allowNull: false,
      field: 'email',
    },
    password: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
      field: 'password',
    },
    passwordHash: {
      type: new DataTypes.STRING(255),
      allowNull: false,
      field: 'password_hash',
    },
  },
  {
    tableName: 'users',
    sequelize: database,
    freezeTableName: true,
  },
);

User.addHook('beforeSave', async (user: User) => {
  if (user.password) {
    user.passwordHash = await bcrypt.hash(user.password, 8);
  }
});
