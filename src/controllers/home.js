export async function main(ctx) {
  ctx.state.user = ctx.session.user;
  await ctx.render('index');
}