/**
 * Resolves data creation
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');

const Mutations = {
  async createItem(parent, args, ctx, info) {
    // TODO: check if they are logged in
    return ctx.db.mutation.createItem({ data: { ...args } }, info);
  },

  async deleteItem(parent, { id }, ctx, info) {
    const where = { id };
    // 1. find item
    const item = await ctx.db.query.item({ where }, `{ id title }`);
    // TODO: 2. check if they own that item or have permissions to delete
    // 3. delete
    return ctx.db.mutation.deleteItem({ where }, info);
  },

  updateItem(parent, { id, ...updates }, ctx, info) {
    return ctx.db.mutation.updateItem({ data: updates, where: { id } }, info);
  },

  async requestResetToken(parent, { email }, ctx, info) {
    // check if real user
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error(`No user found with email address of ${email}`);
    }
    // set resetToken and expiry
    const resetToken = (await promisify(randomBytes)(20)).toString('hex');
    const resetTokenExpiry = Date.now() + 1000 * 60 * 60; // one hour
    const res = await ctx.db.mutation.updateUser({ where: { email }, data: { resetToken, resetTokenExpiry } });

    // email reset token
  },

  async resetPassword(parent, { confirmPassword, password, resetToken, resetTokenExpiry }, ctx, info) {
    // check if password match
    if (confirmPassword !== password) {
      throw new Error('Passwords do not match');
    }
    // check if legit reset token
    // check if expired
    const [user] = await ctx.db.query.users({
      where: { resetToken, resetTokenExpiry_gte: Date.now() - 1000 * 60 * 60 },
    });
    if (!user) {
      throw new Error('This token is either invalid or expired');
    }
    // hash their new password
    const hashedPassword = await bcrypt.hash(password, 10);
    // save new password to use and remove old resetToken fields
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { id: user.id },
      data: { password: hashedPassword, resetToken: null, resetTokenExpiry: null },
    });
    // generate JWT
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // set JWT cookie
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // one week cookie
    });
    // return new user
    return updatedUser;
  },

  async signin(parent, { email, password }, ctx, info) {
    const user = await ctx.db.query.user({ where: { email } });
    const valid = await bcrypt.compare(password, user.password);
    if (!user || !valid) {
      throw new Error(`Invalid password or email address.`);
    }
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // one week cookie
    });
    return user;
  },

  signout(_, __, ctx) {
    ctx.response.clearCookie('token');
    return { message: 'Signed out' };
  },

  async signup(parent, { email, password, name }, ctx, info) {
    email = email.toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          email,
          password: hashedPassword,
          name,
          permissions: { set: ['USER'] },
        },
      },
      info
    );
    // create JWT token for them
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // we set jwt as cookie on the response
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // one week cookie
    });
    return user;
  },
};

module.exports = Mutations;
