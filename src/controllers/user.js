export async function login(ctx) {
  const { User } = ctx.orm();
  const { body } = ctx.request;

  ctx.assert(body.username, 400, 'username is required');
  ctx.assert(body.password, 400, 'password is required');

  const user = await User.auth(body);

  ctx.assert(user, 400, 'username and password not matched');

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

export async function item(ctx) {
  const { User } = ctx.orm();
  const { id } = ctx.params;
  ctx.body = await User.find({
    attributes: { exclude: ['password'] },
    where: { id }
  });
}

export async function topics(ctx) {
  const { Topic, User } = ctx.orm();
  const { id } = ctx.params;
  const data = await Topic.findAll({
    attributes: { exclude: ['content'] },
    order: 'id DESC',
    where: { userId: id }
  });
  const ids = data.map(t => t.userId);
  const users = await User.findAll({
    attributes: { exclude: ['password'] },
    where: { id: { $in: ids } }
  });
  ctx.body = { data, users };
}
