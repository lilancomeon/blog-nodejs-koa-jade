define('js/home/blog',function(require, exports) {
        var self = {
        param : {
            signInbtn : $(".J-signInbtn"),
            loginForm : $(".J-loginForm"),
            errorMsg : $(".J-errorMsg"),
            blogEditBtn : $(".J-blogEditBtn")
        },
        init : function(){
            var param = this.param;
            this.pageInit(param);
            this.pageEvent(param);
        },
        pageInit :function(param){
            // 登录按钮事件
            param.signInbtn.on('click',function(){
                if(param.loginForm.valid()){
                    // 发送登录请求
                    var datas = param.loginForm.serialize();
                    datas+="&method=login";
                    console.log(datas);
                    $.ajax({
                        data: datas,
                        url: '/loginDo',
                        dataType: 'json',
                        cache: false,
                        timeout:5000,
                        success: function(data){
                            if(data.isSuccess){
                                window.location.href = '/'
                            }else{
                                param.errorMsg.find('span').text(data.message);
                                param.errorMsg.show();
                            }
                        },
                        error: function(jqXHR, textStatus, errorThrown){
                            alert('error ' + textStatus + " " + errorThrown);
                        }
                    });
                }
            });
            // 添加或修改博客事件
            param.blogEditBtn.on('click',function(){
               var thisForm = $(this).parents('form');

               if(thisForm.valid()){
                   var datas=thisForm.serialize(),
                       methodStr = "edit";
                   if(datas.indexOf("id") == -1){
                       methodStr = "create"
                   }
                   datas +="&method="+methodStr;
                 // 验证通过
                 $.ajax({
                    data: datas,
                    url: '/blogDo',
                    dataType: 'json',
                    cache: false,
                    timeout:5000,
                    success: function(data){
                        if(data.isSuccess){
                            alert('恭喜你，操作成功！')
                            window.location.href = '/blog/article/'+data.id
                        }else{
                            param.errorMsg.find('span').text(data.message);
                            param.errorMsg.show();
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown){
                        alert('error ' + textStatus + " " + errorThrown);
                    }
                 })
               }
            });
        },
        pageEvent : function(param){}
        },
        Events = {};
    try{self.init()}catch(e){console.log(e)}
});