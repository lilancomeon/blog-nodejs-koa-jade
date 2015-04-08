var http = require('http'),
    app = require('koa')(),
    // redisStore = require('koa-redis'),
    session = require('koa-session-store'),
	router = require('koa-router'),
	routes = require('./routes/web.js'),
	views = require('co-views'),
	staticServer = require('koa-static'),
    koaBody = require('koa-body')();
app.keys = ['blogkeys'];
//app.use(views(__dirname +'/views','jade',{}));
// global.render=views(__dirname +'/views',{ map: {html: 'mustache' } }); 
global.render=views(__dirname +'/views',{default:'jade'}); 
// views(__dirname +'/views','jade',{});
app.use(staticServer(__dirname + '/public'));
app.use(session({
	keys:'userInfo',
	store: "cookie",
	cookie:{
	  // path: '/',
	  httpOnly: true,
	  // maxage: 3600000,
	  rewrite: true,
	  signed: true
	}
}));
app.use(router(app));
routes(app);
console.log('----start---');

var app = module.exports = http.createServer(app.callback());
app.listen(3000);
