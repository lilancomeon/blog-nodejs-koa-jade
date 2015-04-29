var Sequelize = require('Sequelize');
var seq = new Sequelize('blog','root','lilan19890109',{host:'127.0.0.1',port:3306,define:{timestamps:false,freezeTableName:true}});
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
	click:{
		type:Sequelize.INTEGER
	},
	htmlContent :{
		type:Sequelize.TEXT
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
});
exports.blogcomment = seq.define('blogcomment',{
	id:{
		type : Sequelize.INTEGER,
		autoIncrement : true,
		primaryKey : true,
		unique : true
	},
	comment:{
		type:Sequelize.STRING
	},
	userId:{
		type:Sequelize.INTEGER
	},
	commentDate:{
		type:Sequelize.DATE
	},
	blogid:{
		type:Sequelize.INTEGER
	},
	support:{
		type:Sequelize.INTEGER
	},
	refComment:{
		type:Sequelize.INTEGER
	}
})