/**
 * Resolves data creation
 */

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
};

module.exports = Mutations;
