import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import session from 'koa-session';
import ORM from 'koa-orm';
import view from 'koa-view';
import chalk from 'chalk';
import config from './config';
import router from './router';

const app = new Koa();

app.keys = ['forum app'];
app.use(logger());
app.use(bodyParser());
app.use(session(config.session, app));
app.use(view(__dirname + '/../views'));

const orm = ORM(config.database);
app.use(orm.middleware);

/*orm.database().sync({
  force: true
}).then(() => {
  console.log('Database sync done.');
});*/

router(app);

if (!module.parent) {
  const port = config.port || 3000;
  const url = `http://127.0.0.1:${port}`;
  app.listen(port);
  console.log(`Running site at: ${chalk.cyan.underline(url)}`);
}

export default app;
