import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../src';

chai.use(chaiHttp);

describe('api test', () => {
  let request;
  let userId;
  let topicId;
  before(() => {
    request = chai.request.agent(app.listen());
  });
  after((done) => {
    const { User, Topic } = app.orm.database();
    const deleteUser = User.destroy({
      where: { id: userId }
    });
    const deleteTopic = Topic.destroy({
      where: { id: topicId }
    });
    Promise.all([deleteUser, deleteTopic])
      .then(() => done());
  });
  it('should register user', (done) => {
    request
      .post('/register')
      .send({
        username: 'test',
        password: '1234',
        nickname: 'test name'
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.username).to.equal('test');
        expect(res.body.nickname).to.equal('test name');
        userId = res.body.id;
        done();
      });
  });
  it('should login user', (done) => {
    request
      .post('/login')
      .send({ username: 'test', password: '1234' })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.username).to.equal('test');
        expect(res.body.nickname).to.equal('test name');
        done();
      });
  });
  it('should login user error', (done) => {
    request
      .post('/login')
      .send({ username: 'test', password: '4321' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.text).to.match(/username and password not matched/);
        done();
      });
  });
  it('should get user by id', (done) => {
    request
      .get(`/users/${userId}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.username).to.equal('test');
        expect(res.body.nickname).to.equal('test name');
        done();
      });
  });
  it('should create topic', (done) => {
    request
      .post('/topics')
      .send({ title: 'hello', content: 'world' })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.title).to.equal('hello');
        expect(res.body.content).to.equal('world');
        expect(res.body.user.username).to.equal('test');
        topicId = res.body.id;
        done();
      });
  });
});