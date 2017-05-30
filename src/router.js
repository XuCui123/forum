import Router from 'koa-router';
import * as home from './controllers/home';
import * as user from './controllers/user';
import * as topic from './controllers/topic';
import config from './config';

export default (app) => {
  const router = new Router();

  router.get('/', home.main);
  router.get('/login', home.main);
  router.get('/register', home.main);
  router.get('/topic/create', user.auth, home.main);
  router.get('/topic/:id', home.main);
  router.get('/logout', user.logout);
  router.post('/login', user.login);
  router.post('/register', user.register);
  router.get('/topics', topic.list);
  router.get('/topics/:id', topic.item);
  router.post('/topics', user.auth, topic.add);

  app.use(async (ctx, next) => {
    ctx.state.env = config.env;
    await next();
  });
  app
    .use(router.routes())
    .use(router.allowedMethods());
}