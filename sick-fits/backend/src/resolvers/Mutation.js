/**
 * Resolves data creation
 */

const Mutations = {
  async createItem(parent, args, ctx, info) {
    // TODO: check if they are logged in
    return ctx.db.mutation.createItem({ data: { ...args }}, info);
  }
};

module.exports = Mutations;
