var url = require('url'),
    db = require('../model/db'),
    moment = require('moment'),
    crypto = require('crypto');
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
  var limitLine = 5;
	// 改变浏览量
	var singleBlogData = yield db.blog.find(Number(this.params.id));
	++singleBlogData.dataValues.click;
	var newDatas = yield singleBlogData.save(['click']);
	// 改变浏览量后，把最新改的内容渲染出来
	newDatas.dataValues.update_time = (_dateListFormat(newDatas.dataValues.update_time));
  var commentCount = yield db.blogcomment.count({
    where:{
      blogid:Number(this.params.id),
      refComment : 0
    }
  }) || 0;
  var totalPageTemp = parseInt(commentCount/limitLine)+parseInt(commentCount%limitLine>0?1:0);
  var commentLists = yield db.sequelize.query('SELECT c.id,c.comment,c.commentDate,c.blogid,c.support,u.nickname from blogcomment as c inner join bloguser as u on c.userid = u.id where c.blogid='+Number(this.params.id)+' and refComment=0 order by c.commentDate desc');
  // 获取评论数
  var commentCountList = yield db.sequelize.query('select refComment,count(refComment) as counts from blogcomment where refComment in (select id from blogcomment) group by refComment');
  commentCountList = commentCountList[0];

  if(commentLists != null){
    commentLists = _dateListFormat(commentLists[0],['commentDate']);
  }
  for(var i=0,j=commentLists.length;i<j;i++){
    commentLists[i].counts = 0
    for(var x=0,y=commentCountList.length;x<y;x++){
      if(commentLists[i]['id'] == commentCountList[x]['refComment']){
        commentLists[i].counts = commentCountList[x].counts
      }
    }
  }

	this.body = yield render('blogDetail',{
		nickname:_nickName(this.cookies.get("koa:sess")).nickname,
		singleBlog : newDatas,
		catagoryList:yield db.blogCatagory.findAll(),
		blogCatagory:yield db.blogCatagory.find(newDatas.dataValues.catagoryId),
    commentList : commentLists
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
// 评论分页
exports.commentPage = function *(next){
  //var params = url.parse(this.req.url,true).query;
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
				nickname : aesEncrypt(encodeURI(user.dataValues.nickName),'loginin'),
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
  switch(this.query.method){
    case 'create':{
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
          console.log(this.query);
          var result = yield db.blog.create(this.query);

          if(typeof result.id != undefined){
            obj.isSuccess = true
            obj.id = result.id
          }
      }else{
        obj.message = '该条博客已存在！'
      }
      this.body = obj;
    };break;
    case 'edit':{
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
    };break;
    case 'delete':{};break;
    case 'commentBlog':{
      var userId = _nickName(this.cookies.get("koa:sess")).userId
      var result = yield db.blogcomment.create({
        comment:this.query.comment,
        userId : userId,
        blogid : this.query.blogid
      });
      var obj = {
        isSuccess:false
      }
      if(typeof result.dataValues.id != 'undefined'){
        obj.isSuccess = true;
        obj.datas = result.dataValues
      }
      this.body = obj
    };break;
    case 'commentApproval':{
      var comment = yield db.blogcomment.find(Number(this.query.id));
      ++ comment.support;
      var newDatas = comment.save(['support']);
      console.log(newDatas);
      this.body = {
        isSuccess:true,
        datas:newDatas
      }
    }break;
    case 'commentSm' : {
      var userId = _nickName(this.cookies.get("koa:sess")).userId;
      //console.log(userId)
      var obj = this.query;
      obj.userId = userId;
      console.log(obj);
      var comment = yield db.blogcomment.create(obj);
      var obj = {
        isSuccess:false
      }
      if(typeof comment.dataValues.id != 'undefined'){
        obj.isSuccess = true;
        var result = yield db.blogcomment.find(comment.id);
        result.dataValues.commentDate = _dateListFormat(result.dataValues.commentDate,[]);
        obj.datas = result.dataValues;
      }
      this.body = obj;
    };break;
    case 'getCommentSmListById':{
      // 通过评论相关id获取所有评论
      var blogcommentList = yield db.sequelize.query('SELECT id, comment, userId, commentDate, blogid,support, refComment FROM blogcomment WHERE refComment ='+this.query.refComment);
      // var blogcommentList = yield db.blogcomment.findAll({
      //   where:{
      //     refComment:this.query.refComment
      //   },
      //   limit:30
      // });

      blogcommentList = _dateListFormat(blogcommentList[0],['commentDate'])
      this.body = blogcommentList;
    };break;
    case 'commentPage':{
      // 通过评论相关id获取所有评论
      var toIndex = parseInt(this.query.curPage) * parseInt(this.query.len);
      var fromIndex = toIndex - parseInt(this.query.len);
      var blogcommentPage = yield db.sequelize.query('SELECT c.id,c.comment,c.commentDate,c.blogid,c.support,u.nickname from blogcomment as c inner join bloguser as u on c.userid = u.id where c.blogid='+Number(this.query.blogid)+' and refComment=0 order by c.commentDate desc limit '+fromIndex+','+toIndex);
      blogcommentPage = _dateListFormat(blogcommentPage[0],['commentDate']);
      console.log(blogcommentPage);
      var obj = {
        isSuccess:true,
        datas:blogcommentPage
      }
      this.body = obj;
    };break;
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
  if(typeof str!= 'undefined' && str != ''){
    sessJson = JSON.parse(str);
    if(typeof sessJson.nickname !="undefined"){
        // console.log("解密前：",sessJson.nickname)
      	sessJson.nickname = decodeURIComponent(aesDecrypt(decodeURIComponent(sessJson.nickname),'loginin'));
        // console.log("解密后：",decodeURIComponentsessJson.nickname)
    }
  }
  return sessJson;
}
/**
 * aes加密
 * @param data
 * @param secretKey
 */
function aesEncrypt(data, secretKey) {
  var cipher = crypto.createCipher('aes-128-ecb',secretKey);
  return cipher.update(data,'utf8','hex') + cipher.final('hex');
}

/**
 * aes解密
 * @param data
 * @param secretKey
 * @returns {*}
 */
function aesDecrypt(data, secretKey) {
  var cipher = crypto.createDecipher('aes-128-ecb',secretKey);
  return cipher.update(data,'hex','utf8') + cipher.final('utf8');
}
