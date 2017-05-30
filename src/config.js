import { join } from 'path';

export default {
  env: {
    title: 'Forum website',
    staticRoot: 'http://localhost:8000'
  },
  session: {},
  database: {
    name: 'forum',
    modelPath: join(__dirname, 'models'),
    db: 'forum_db',
    username: 'root',
    password: '112358',
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    pool: {
      maxConnections: 10,
      minConnections: 0,
      maxIdleTime: 30000
    }
  }
};