import { Schema, model } from 'mongoose';
import { randomBytes, pbkdf2, BinaryLike } from 'crypto';

export type User = {
  createdAt: NativeDate;
  updatedAt: NativeDate;
} & {
  email: string;
  password: string;
  isAdmin: boolean;
  salt?: string | null | undefined;
} & {
  id?: string | undefined;
  validatePassword: (password: BinaryLike) => Promise<boolean>;
};

const UserSchema = new Schema<User>(
  {
    email: {
      type: String,
      required: true,
      index: { unique: true },
      lowercase: true,
      trim: true
    },
    password: { type: String, required: true, trim: true },
    isAdmin: { type: Boolean, default: false },
    salt: { type: String }
  },
  {
    timestamps: true
  }
);

UserSchema.pre('save', function preSave(next) {
  const user = this;

  if (!user.isModified('password')) {
    // Generate random salt for each user
    return randomBytes(16, (err, salt) => {
      if (err) {
        return next(err);
      }

      user.salt = salt.toString('hex');

      // Generate hash from password and salt
      return pbkdf2(
        user.password,
        user.salt,
        100000,
        64,
        'sha512',
        (error, hash) => {
          if (error) {
            return next(error);
          }

          user.password = hash.toString('hex');
          return next();
        }
      );
    });
  }

  return next();
});

UserSchema.methods.validatePassword = function validatePassword(
  password: BinaryLike
) {
  const user = this;

  return new Promise((resolve, reject) => {
    pbkdf2(password, user.salt, 100000, 64, 'sha512', (error, hash) => {
      if (error) {
        return reject(error);
      }

      return resolve(hash.toString('hex') === user.password);
    });
  });
};

export default model<User>('User', UserSchema);
