/**
 * Resolves data creation
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

  async signin(parent, { email, password }, ctx, info) {
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
    }
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
