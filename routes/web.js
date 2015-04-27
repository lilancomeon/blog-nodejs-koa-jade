var blog = require('../controllers/blog.js');

module.exports = routes;
function routes(app){
	app.get('/',blog.index);
	app.get('/login',blog.login);
  app.get('/blog/list', blog.list);
  app.get('/blog/newblog/:id',blog.newblog);
  app.get('/blog/list/:id',blog.catagroy);
  app.get('/blog/article/:id',blog.read);
  app.get('/blog/del/:id',blog.del);
  app.get('/blog/page/:id',blog.page);
  app.get('/blog/comment/:id',blog.commentPage);
  app.get('/blog/newblog/',blog.newblog);
  app.get('/loginDo',blog.loginDo);
	app.get('/blogDo',blog.blogDo);
}