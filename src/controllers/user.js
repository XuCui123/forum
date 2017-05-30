export async function login(ctx) {
  const { User } = ctx.orm();
  const { body } = ctx.request;
  const user = await User.auth(body);
  ctx.session.user = user;
  ctx.body = user;
}

export function logout(ctx) {
  ctx.session.user = null;
  ctx.redirect('/');
}

export async function register(ctx) {
  const { User } = ctx.orm();
  const { body } = ctx.request;
  const user = await User.register(body);
  ctx.session.user = user;
  ctx.body = user;
}

export async function auth(ctx, next) {
  if (ctx.session.user) {
    return await next();
  }
  ctx.redirect('/login');
}
