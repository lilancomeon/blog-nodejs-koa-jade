var Sequelize = require('Sequelize');
var seq = new Sequelize('blog','root','123456',{host:'127.0.0.1',port:3306,define:{timestamps:false,freezeTableName:true}});
exports.sequelize = seq;
exports.blog = seq.define('blog',{
	id:{
		type : Sequelize.INTEGER,
		autoIncrement : true,
		primaryKey : true,
		unique : true
	},
	title:{
		type:Sequelize.STRING
	},
	content:{
		type:Sequelize.STRING
	},
	create_time:{
		type:Sequelize.DATE
	},
	update_time:{
		type:Sequelize.DATE
	},
	catagoryId:{
		type:Sequelize.INTEGER
	},
	tagId:{
		type:Sequelize.TEXT
	},
	commentId:{
		type:Sequelize.INTEGER
	},
	click:{
		type:Sequelize.INTEGER
	}
});
exports.blogCatagory = seq.define('blogcatagory',{
	id:{
		type : Sequelize.INTEGER,
		autoIncrement : true,
		primaryKey : true,
		unique : true
	},
	catagory:{
		type:Sequelize.STRING
	}
});
exports.bloguser = seq.define('bloguser',{
	id:{
		type : Sequelize.INTEGER,
		autoIncrement : true,
		primaryKey : true,
		unique : true
	},
	nickName:{
		type:Sequelize.STRING
	},
	password:{
		type:Sequelize.STRING
	},
	email:{
		type:Sequelize.STRING
	}
})