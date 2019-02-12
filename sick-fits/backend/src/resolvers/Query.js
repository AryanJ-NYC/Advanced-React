/**
 * Resolves where exactly data comes where
 */

const { forwardTo } = require('prisma-binding');

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
};

module.exports = Query;
