export async function list(ctx) {
  const { Reply, User } = ctx.orm();
  const { offset, limit } = ctx.query;
  const { topicId } = ctx.params;
  const data = await Reply.findAndCountAll({
    where: { topicId },
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
  const { Reply } = ctx.orm();
  const { content } = ctx.request.body;
  const { user } = ctx.session;
  const userId = user.id;
  const { topicId } = ctx.params;
  const reply = await Reply.create({ userId, content, topicId });
  ctx.body = { ...reply.toJSON(), user };
}