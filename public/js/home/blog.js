define('js/home/blog',function(require, exports) {
    var mdEditor = require("js/commonPlugins/mdEditor");
        require('js/commonPlugins/jquery.tmpl');
    var markedJquery = require('js/commonPlugins/markedJquery');
        var self = {
                param : {
                    signInbtn : $(".J-signInbtn"),
                    loginForm : $(".J-loginForm"),
                    errorMsg : $(".J-errorMsg"),
                    blogEditBtn : $(".J-blogEditBtn"),
                    commentBtn : $(".J-commentBtn"),
                    commentForm :null,
                    mdEditor : ".J-mdEditor",
                    commentList : $(".J-commentList"),
                    iconApproval : ".J-iconApproval",
                    iconComment : ".J-iconComment",
                    subCommentsBox : ".J-subCommentsBox",
                    commentSmList : ".J-commentSmList",
                    commentVote : ".J-commentVote",
                    commentSm : ".J-commentSm",
                    commentTpl : ['<div class="well well-sm J-commentSm">',
                                    '<textarea row="1" placeholder="写下你的评论…" class="form-control smallComment J-smallComment">',
                                    '</textarea>',
                                    '<p class="text-right commentSmBox">',
                                        '<a href="javascript:;" role="button" class="btn btn-default J-commentSmCancel">',
                                            '取消',
                                        '</a>',
                                        '<a href="javascript:;" role="button" class="btn btn-default J-commentSmBtn">',
                                            '提交',
                                        '</a>',
                                    '</p>',
                                '</div>'].join(""),
                    commentSmCancel : ".J-commentSmCancel",
                    commentSmBtn : ".J-commentSmBtn",
                    subCommentBoxTpl:['<div class="subCommentsBox J-subCommentsBox"><div class="commentSmList J-commentSmList"></div></div>'].join(""),
                    subCommentTpl:['{{each datas}}',
                                        '<div class="commentBox">',
                                            '<h4 class="comment">',
                                              '<span class="comment_date">${commentDate}</span>',
                                              '<a name="#${id}"></a>',
                                              '<span class="comment_user">lilan</span>',
                                            '</h4>',
                                            '<div class="comment_body">',
                                              '{{html comment}}',
                                            '</div>',
                                          '</div>',
                                    '{{/each}}'].join(""),
                    commentDelete : $('.J-commentDelete')
                },
                init : function(){
                    var param = this.param;
                    this.pageInit(param);
                    this.pageEvent(param);
                },
                pageInit :function(param){
                    param.commentForm = param.commentBtn.parents('form');
                    param.commentForm.validate({
                        messages:{
                            comment:{
                                required:"评论不能为空！"
                            }
                        }
                    });
                    new mdEditor({
                        containter : param.mdEditor,
                        useTitle : false,
                        titleName : "J-mdEditorInput",
                        width:'auto',
                        height:120
                    }).init();
                },
                pageEvent : function(param){
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
                           var obj = {
                               datas : datas
                           }
                         // Events.doBlogAjax({
                         //    datas : obj,
                         //    callback : function(data){
                         //        if(data.isSuccess){
                         //            alert('恭喜你，操作成功！')
                         //            window.location.href = '/blog/article/'+data.id
                         //        }else{
                         //            param.errorMsg.find('span').text(data.message);
                         //            param.errorMsg.show();
                         //        }
                         //    }
                         // });
                         // // 验证通过
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
                         });
                       }
                    });
                    // 评论按钮事件
                    param.commentBtn.on('click',function(){
                        // 验证通过
                        if(param.commentForm.valid()){
                            var blogId = parseInt($(this).attr('data-id')) || 0;
                            var obj = {
                                blogid : blogId,
                                comment : markedJquery($(param.mdEditor).val()),
                                method : "commentBlog"
                            }
                            Events.doBlogAjax({
                                datas : obj,
                                callback : function(data){
                                    if(data.isSuccess){
                                        alert('恭喜你，操作成功！')
                                        window.location.href = '/blog/article/'+data.datas.blogid
                                    }else{
                                        param.errorMsg.find('span').text(data.message);
                                        param.errorMsg.show();
                                    }
                                }
                            });
                            // 提交
                            // $.ajax({
                            //     data:{
                            //         blogid : blogId,
                            //         comment : $(param.mdEditor).val(),
                            //         method : "commentBlog"
                            //     },
                            //     url: '/blogDo',
                            //     dataType: 'json',
                            //     cache: false,
                            //     timeout:5000,
                            //     success: function(data){
                            //         if(data.isSuccess){
                            //             alert('恭喜你，操作成功！')
                            //             window.location.href = '/blog/article/'+data.datas.blogid
                            //         }else{
                            //             param.errorMsg.find('span').text(data.message);
                            //             param.errorMsg.show();
                            //         }
                            //     },
                            //     error: function(jqXHR, textStatus, errorThrown){
                            //         alert('error ' + textStatus + " " + errorThrown);
                            //     }
                            // });
                        }
                    });
                    // 点赞按钮事件
                    param.commentList.delegate(param.iconApproval,'click',function(){
                        var curDom = $(this);
                        var commentId = curDom.parents('div').attr('data-id');
                        // 提交
                        $.ajax({
                            data:{
                                id : commentId,
                                method : "commentApproval"
                            },
                            url: '/blogDo',
                            dataType: 'json',
                            cache: false,
                            timeout:5000,
                            success: function(data){
                                if(data.isSuccess){
                                    var approval = parseInt(curDom.next().html())
                                    curDom.next().html(++approval);
                                }
                            },
                            error: function(jqXHR, textStatus, errorThrown){
                                alert('error ' + textStatus + " " + errorThrown);
                            }
                        });
                    });
                    // 点击评论小图标，显示评论框
                    param.commentList.delegate(param.iconComment,'click',function(){
                        var curDom = $(this),
                            sibSpanDom = curDom.siblings('span'),
                            sibSpanVal = parseInt(sibSpanDom.html()),
                            parentsDom = curDom.parents(param.commentVote),
                            id = parentsDom.attr("data-id"),
                            blogid = parentsDom.attr("data-bid"),
                            subCommentsBox = parentsDom.siblings(param.subCommentsBox),
                            commListHtml = "";
                        //说明我没有点过评论按钮，没有加载评论框
                        if(subCommentsBox.length == 0){
                            parentsDom.parent().append(param.subCommentBoxTpl);
                            if(sibSpanVal > 0){
                                // 说明曾经有人评论，加载列表和评论框
                                //请求评论列表
                                Events.doBlogAjax({
                                   datas:{
                                        refComment:id,
                                        blogid : blogid,
                                        method:"getCommentSmListById"
                                   },
                                   callback:function(datas){
                                    var commListHtml = $.tmpl(param.subCommentTpl,{datas:datas});
                                    var commentSmList = parentsDom.siblings(param.subCommentsBox).find(param.commentSmList);
                                    commentSmList.append(commListHtml);
                                    if($(param.mdEditor).length >0){
                                        if(commentSmList.siblings(param.commentSm).length == 0){
                                            commentSmList.parent().append(param.commentTpl);
                                        }
                                    }
                                   }
                                });
                            }else{
                                parentsDom.siblings(param.subCommentsBox).append(param.commentTpl);
                                // 只加载评论框
                                // var subComment = $(param.subCommentBoxTpl).append(param.commentTpl)
                                // parentsDom.parent().append(subComment);
                            }
                            //$(param.commentTpl).insertAfter(parentsDom)
                        }else{
                            // 已经加载过评论框，则直接显示
                            subCommentsBox.toggle();
                        }

                    });
                    // 小评论框中的取消按钮事件
                    param.commentList.delegate(param.commentSmCancel,'click',function(){
                        $(this).parent().siblings('textarea').val("").text("");
                        $(this).parents(param.subCommentsBox).hide();
                    });
                    // 小评论框提交事件
                    param.commentList.delegate(param.commentSmBtn,'click',function(e){
                        var curDom = $(e.currentTarget),
                            commentSmBox = curDom.parents(param.commentSm),
                            commentTxt = curDom.parent().siblings('textarea'),
                            comment = commentTxt.val(),
                            commentPSubBox = curDom.parents(param.subCommentsBox),
                            commentP = commentPSubBox.siblings(param.commentVote),
                            id = commentP.attr('data-id'),
                            blogid = commentP.attr('data-bid');

                        var obj = {
                                refComment : id,
                                comment : markedJquery(comment),
                                blogid : blogid,
                                method : "commentSm"
                        }
                        Events.doBlogAjax({
                            datas : obj,
                            callback : function(data){
                                if(data.isSuccess){
                                    commentTxt.val("");
                                    //commentSmBox.hide();
                                    /*
                                        {
                                            blogid: 2
                                            comment: "fdsfdsfdsafdsafdsafdsfd"
                                            commentDate: "2015-04-14T11:25:39.000Z"
                                            id: 15
                                            refComment: 10
                                            support: 0
                                            userId: 0
                                        }
                                    */
                                    delete data.isSuccess;
                                    var html = $.tmpl(param.subCommentTpl,{datas:data});
                                    var smListDom = commentPSubBox.find(param.commentSmList);
                                    if(smListDom.length >0){
                                        smListDom.append(html);
                                    }
                                    // else{
                                    //     var newDom = $('<div class="commentSmList J-commentSmList"></div>').append(html);
                                    //     //newDom.prepend(commentPSubBox)
                                    //     commentPSubBox.prepend(newDom);
                                    // }
                                    var voteBox = commentPSubBox.siblings(param.commentVote);
                                        iconCommentDom = voteBox.find(param.iconComment),
                                        commentCountDom = iconCommentDom.next();
                                    commentCountDom.html(commentPSubBox.find(param.commentSmList).children().length);
                                }
                            }
                        });
                        // 提交
                        // $.ajax({
                        //     data:{
                        //         refComment : id,
                        //         comment : comment,
                        //         blogid : blogid,
                        //         method : "commentSm"
                        //     },
                        //     url: '/blogDo',
                        //     dataType: 'json',
                        //     cache: false,
                        //     timeout:5000,
                        //     success: function(data){
                        //         if(data.isSuccess){
                        //             commentTxt.val("");
                        //             commentSmBox.hide();

                        //                 {
                        //                     blogid: 2
                        //                     comment: "fdsfdsfdsafdsafdsafdsfd"
                        //                     commentDate: "2015-04-14T11:25:39.000Z"
                        //                     id: 15
                        //                     refComment: 10
                        //                     support: 0
                        //                     userId: 0
                        //                 }


                        //             var html = $.tmpl(param.subCommentTpl,data);
                        //             $(html).insertAfter(commentSmBox.parent());
                        //         }
                        //     },
                        //     error: function(jqXHR, textStatus, errorThrown){
                        //         alert('error ' + textStatus + " " + errorThrown);
                        //     }
                        // });
                    });
                    // 删除评论按钮
                    param.commentDelete.on('click',function(){
                        var curDom = $(this);
                        if(window.confirm("您确定要删除这条评论吗？")){
                            var obj = {
                                id : parseInt(curDom.parent().attr("data-id")),
                                method : "commentDelete"
                            }
                            Events.doBlogAjax({
                                datas : obj,
                                callback : function(data){
                                   if(data.isSuccess){
                                    curDom.parent().parent().remove();
                                   }
                                }
                            });
                        }
                    });

                }
        },
        Events = {
            doBlogAjax : function(obj){
                $.ajax({
                    data:obj.datas,
                    url: '/blogDo',
                    dataType: 'json',
                    cache: false,
                    timeout:5000,
                    success: function(data){
                        obj.callback(data);
                    },
                    error: function(jqXHR, textStatus, errorThrown){
                        alert('error ' + textStatus + " " + errorThrown);
                    }
                });
            }
        };
    self.init()
   // try{self.init()}catch(e){console.log(e)}
});