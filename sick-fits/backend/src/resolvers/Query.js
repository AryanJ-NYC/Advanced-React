/**
 * Resolves where exactly data comes where
 */

const { forwardTo } = require('prisma-binding');

const Query = {
  item: forwardTo('db'),
  items: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  // below is commented out because the line above is the same thing (for learnsies!)
  // items(parent, args, ctx, info) {
  //   return ctx.db.query.items();
  // }
};

module.exports = Query;
