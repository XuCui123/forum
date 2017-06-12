export default () => {
  return async function error (ctx, next) {
    try {
      await next();
      if (ctx.response.status === 404 && !ctx.response.body) ctx.throw(404)
    } catch (err) {
      ctx.status = err.status ? err.status : 500;

      // application
      ctx.app.emit('error', err, ctx);

      // accepted types
      switch (ctx.accepts('html', 'text', 'json')) {
        case 'text':
          ctx.type = 'text/plain';
          ctx.body = err.message;
          break;

        case 'json':
          ctx.type = 'application/json';
          ctx.body = { error: err.message };
          break;

        case 'html':
          ctx.type = 'text/html';
          await ctx.render('error', {
            error: err.message,
            status: ctx.status,
            code: err.code
          });
          break;
      }
    }
  };
}