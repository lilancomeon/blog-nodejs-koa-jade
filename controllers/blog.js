var url = require('url'),
    db = require('../model/db'),
    moment = require('moment');
// 首页
exports.index = function *(next){
	var dataList = yield db.sequelize.query('select id,title,content,create_time,click from blog order by ? limit ?',null,{},['click,create_time',6]),
	    formatDateList =_dateListFormat(dataList[0],['create_time','update_time']),
	    sessJson = _nickName(this.cookies.get("koa:sess")),
	    obj = {
	       title:"首页",
	       nickname:sessJson.nickname,
		   blogs:formatDateList
	    }
	this.body = yield render('index',obj);
}
exports.login = function *(next){
	this.body = yield render('login');
}
// 列表页
exports.list = function *(next){
	var blogList =yield db.sequelize.query('select id,title,update_time from blog order by create_time,update_time desc limit 10');
	blogList = _dateListFormat(blogList[0],['update_time']);
	var count = yield db.blog.count() || 0;
	var pages = parseInt(count/10) + parseInt(count%10 > 0 ?1:0);
	this.body = yield render('blogList',{
		title:"全部列表",
		nickname:_nickName(this.cookies.get("koa:sess")).nickname,
		blogs:blogList,
		totalPage : pages || 0,
		curPage : 1
	});
}
// 博客分类页
exports.catagroy = function *(next){
	var blogList = yield db.sequelize.query('select id,title,update_time from blog where catagoryId = '+Number(this.params.id)+" order by create_time,update_time desc");
	blogList = _dateListFormat(blogList[0],['update_time']);
	var count = yield db.blog.count({
		where:{
			catagoryId:Number(this.params.id)
		}
	}) || 0;
	var pages = parseInt(count/10) + parseInt(count%10 > 0 ?1:0);
	this.body = yield render('blogList',{
		title:'分类列表',
		nickname : _nickName(this.cookies.get("koa:sess")).nickname,
		blogs : blogList,
		totalPage : pages || 0,
		catagoryId : this.params.id,
		curPage : 1
	});
}
// 博客详情页
exports.read = function *(next){
	// 改变浏览量
	var singleBlogData = yield db.blog.find(Number(this.params.id));
	++singleBlogData.dataValues.click;
	var newDatas = yield singleBlogData.save(['click']);
	// 改变浏览量后，把最新改的内容渲染出来
	newDatas.dataValues.update_time = (_dateListFormat(newDatas.dataValues.update_time))
	this.body = yield render('blogDetail',{
		nickname:_nickName(this.cookies.get("koa:sess")).nickname,
		singleBlog : newDatas,
		catagoryList:yield db.blogCatagory.findAll(),
		blogCatagory:yield db.blogCatagory.find(newDatas.dataValues.catagoryId)
	});
}
// 创建和修改博客页
exports.newblog = function *(next){
	var obj = {
		isNew:false,
		nickname:_nickName(this.cookies.get("koa:sess")).nickname,
		blogCatagory : null
	},
	catagoryId=0;

	if(this.params.id == undefined){
       var params = url.parse(this.req.url,true).query;
		// 说明是新增
		obj.isNew = true;
		catagoryId = parseInt(params.cate);
	}else{
		var blogId = this.params.id,
		    singleBlog = yield db.blog.find(Number(blogId));
		catagoryId = singleBlog.dataValues.catagoryId;
		    // catagroy = yield db.blogCatagory.find(singleBlog.dataValues.catagoryId)
        obj.blog = singleBlog;
	}
	obj.blogCatagory =yield db.blogCatagory.find(catagoryId);
	this.body = yield render('blogNew',obj);
}
// 删除博客
exports.del = function *(next){
	var result = yield db.blog.destroy({
		where : {
			id:this.params.id
		}
	});
	this.response.redirect("/");
}
// blog分页
exports.page = function *(next){
	var params = url.parse(this.req.url,true).query;
  var catagoryId = params.cata;
  var sql = 'select id,title,update_time from blog ';
  var where = ' where catagoryId = ';
  var limit = ' limit ';
  var page =Number(this.params.id);
  if(page > 1){
  	page = (page-1) * 10
  }else{
  	page = 0
  }
  limit +=page+',10';
  if(typeof catagoryId != 'undefined'){
    // 说明是带分类的翻页
    where +=catagoryId;
  }else{
  	where = '';
  }
  sql = sql + where + ' order by create_time,update_time desc' + limit;

  var blogList = yield db.sequelize.query(sql);
  blogList = _dateListFormat(blogList[0],['update_time']);
  this.body = yield render('blogList',{
		title:"分页列表",
		nickname:_nickName(this.cookies.get("koa:sess")).nickname,
		blogs:blogList,
		totalPage : params.t,
		curPage : this.params.id || 1
	});
}
// 登录页
exports.loginDo = function *(next){
	if(this.query.method == "login"){
		var result = {
		    	isSuccess : true
		    },
		    user = yield db.bloguser.find({
			where:{
				email:this.query.email,
				password:this.query.pwd
			}
		});

		// 如果没有查到数据
		if(user == null){
			result.isSuccess = false;
			result.message = '登录信息有误，请重新输入！'
		}else{
			var userinfo = {
				nickname : encodeURI(user.dataValues.nickName),
				userId : user.dataValues.id
			}
			this.session = userinfo;
		}
		this.body=result;
	}else{
		this.session = {}
    this.response.redirect("/")
	}

	yield next;
}
// 操作博客
exports.blogDo = function*(next){
	if(this.query.method == 'create'){
		// 判断数据库中是否存在
    var count = yield db.blog.count({
    	where : {
        title : this.query.title
    	}
    });
    var obj = {
    	isSuccess:false
    };
    if(count == 0){
       	this.query.create_time = new Date();
		    // 新增博客
		    var result = yield db.blog.create(this.query);

		    if(typeof result.id != undefined){
		    	obj.isSuccess = true
		    	obj.id = result.id
		    }
    }else{
    	obj.message = '该条博客已存在！'
    }
    this.body = obj;
	}else if(this.query.method == 'edit'){
		// 修改博客
    var result = yield db.sequelize.query('update blog set title=\''+this.query.title+'\',content=\''+this.query.content+'\' where id='+this.query.id);
    var obj = {
    	isSuccess : true,
    	id : this.query.id
    }
    if(typeof result != 'object'){
    	obj.isSuccess = false;
    	obj.message = '修改失败！'
    }
    this.body = obj;
	}else if(this.query.method == 'delete'){
		// 删除博客
	}
}

// 格式化日期组件
function _dateListFormat(dates,formatStr){
	formatStr = formatStr || [];
	if(formatStr.length > 0){
		for(var x=0,y=formatStr.length;x<y;x++){
   	  for(var i=0,j=dates.length;i<j;i++){
				dates[i][formatStr[x]] = moment(dates[i][formatStr[x]]).format('YYYY-MM-DD hh:mm:ss');
		  }
		}
	}else{
     dates = moment(dates).format('YYYY-MM-DD hh:mm:ss');
	}
  return dates;
}
// 获取sess
function _nickName(str){
  var sessJson = '';
  if(str != ''){
    sessJson = JSON.parse(str);
    if(typeof sessJson.nickname !="undefined"){
      	sessJson.nickname = decodeURI(sessJson.nickname)
    }
  }
  return sessJson;
}

