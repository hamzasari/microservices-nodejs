import UserModel, { type User } from '../models/User';
import { DeleteResult } from '../utils/commonTypes';

/**
 * The function `getAll` retrieves all users from the UserModel collection in
 * descending order of creation date.
 * @returns The function `getAll` is returning a promise that resolves to an array
 * of `User` objects.
 */
const getAll = async (): Promise<Array<User>> => {
  return UserModel.find().sort({ createdAt: -1 }).exec();
};

/**
 * The function getById retrieves a user by their ID from the UserModel and returns
 * it as a Promise.
 * @param {string} id - The `id` parameter is a string that represents the unique
 * identifier of a user.
 * @returns The function `getById` is returning a `Promise` that resolves to either
 * a `User` object or `null`.
 */
const getById = async (id: string): Promise<User | null> => {
  return UserModel.findById(id).exec();
};

/**
 * The function creates a new user and saves it to the database.
 * @param {User} data - The `data` parameter is an object of type `User` that
 * contains the information needed to create a new user.
 * @returns The `create` function is returning a Promise that resolves to a `User`
 * object.
 */
const create = async (data: User): Promise<User> => {
  const user = new UserModel(data);
  return user.save();
};

/**
 * The `authenticate` function takes an email and password as input, checks if a
 * user with that email exists and if the password is valid, and returns the user
 * object if authentication is successful or `false` otherwise.
 * @param {string} email - A string representing the email of the user trying to
 * authenticate.
 * @param {string} password - The `password` parameter is a string that represents
 * the password entered by the user during authentication.
 * @returns The authenticate function returns a Promise that resolves to either a
 * User object or a boolean value. If a user with the specified email is found and
 * the password is valid, the function returns the user object. Otherwise, it
 * returns false.
 */
const authenticate = async (
  email: string,
  password: string
): Promise<User | boolean> => {
  const user = await UserModel.findOne({ email }).exec();

  if (!user) {
    return false;
  }

  const isValid = await user.validatePassword(password);

  if (!isValid) {
    return false;
  }

  return user;
};

/**
 * The function updates a user's email, isAdmin status, and password (if provided)
 * and returns the updated user.
 * @param {string} id - The `id` parameter is a string representing the unique
 * identifier of the user you want to update in the database.
 * @param {User} data - The `data` parameter is an object of type `User` which
 * contains the updated information for the user. It may have the following
 * properties:
 * @returns a Promise that resolves to either a User object or null.
 */
const update = async (id: string, data: User): Promise<User | null> => {
  const user = await UserModel.findById(id).exec();

  if (!user) {
    return null;
  }

  user.email = data.email;
  user.isAdmin = data.isAdmin;

  // Only update password if it was provided
  if (data.password) {
    user.password = data.password;
  }

  return user.save();
};

/**
 * The `remove` function deletes a document from the UserModel collection in
 * MongoDB based on the provided id.
 * @param {string} id - The `id` parameter is a string that represents the unique
 * identifier of the document you want to remove from the database.
 * @returns The `remove` function is returning a promise that resolves to a
 * `DeleteResult` object.
 */
const remove = async (id: string): Promise<DeleteResult> => {
  return UserModel.deleteOne({ _id: id }).exec();
};

export { getAll, getById, create, authenticate, update, remove };
