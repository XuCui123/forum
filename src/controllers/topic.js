export async function list(ctx) {
  const { Topic, User } = ctx.orm();
  const { offset, limit } = ctx.query;
  const data = await Topic.findAndCountAll({
    attributes: { exclude: ['content'] },
    order: 'id DESC',
    limit: +limit || 50,
    offset: +offset || 0
  });
  const ids = data.rows.map(t => t.userId);
  const users = await User.findAll({
    attributes: { exclude: ['password'] },
    where: { id: { $in: ids } }
  });
  ctx.body = { data, users };
}

export async function add(ctx) {
  const { Topic } = ctx.orm();
  const { title, content } = ctx.request.body;
  const { user } = ctx.session;
  const userId = user.id;
  const topic = await Topic.create({ userId, title, content });
  ctx.body = { ...topic.toJSON(), user };
}

export async function item(ctx) {
  const { Topic, User } = ctx.orm();
  const { id } = ctx.params;
  const topic = await Topic.findById(id);
  const user = await User.find({
    attributes: { exclude: ['password'] },
    where: { id: topic.userId }
  });
  ctx.body = { ...topic.toJSON(), user };
}