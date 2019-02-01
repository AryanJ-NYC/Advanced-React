/**
 * Resolves data creation
 */

const Mutations = {
  async createItem(parent, args, ctx, info) {
    // TODO: check if they are logged in
    return ctx.db.mutation.createItem({ data: { ...args } }, info);
  },

  updateItem(parent, { id, ...updates }, ctx, info) {
    return ctx.db.mutation.updateItem({ data: updates, where: { id } }, info);
  },
};

module.exports = Mutations;
