/**
 * Resolves where exactly data comes where
 */

 const { forwardTo } = require('prisma-binding');

const Query = {
  items: forwardTo('db')
  // items(parent, args, ctx, info) {
  //   return ctx.db.query.items();
  // }
};

module.exports = Query;
