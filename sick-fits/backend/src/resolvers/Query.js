/**
 * Resolves where exactly data comes where
 */

const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');

const Query = {
  item: forwardTo('db'),
  items: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  me(parent, args, ctx, info) {
    const { userId: id } = ctx.request;
    if (!id) {
      return;
    }
    return ctx.db.query.user({ where: { id } }, info);
  },
  // below is commented out because the line above is the same thing (for learnsies!)
  // items(parent, args, ctx, info) {
  //   return ctx.db.query.items();
  // }
  async users(parent, args, ctx, info) {
    const { userId: id } = ctx.request;
    // check if logged in
    if (!id) {
      throw new Error('You must be logged in!');
    }
    const user = await ctx.db.query.user({ where: { id } }, `{id, permissions, email, name}`);

    // check if user has perms to query all users
    hasPermission(user, ['ADMIN', 'PERMISSIONUPDATE']);
    return ctx.db.query.users({}, info);
  },
};

module.exports = Query;
