define('js/home/blogDetail',function(require,exports){
  require('js/commonPlugins/jquery.tmpl');
  var self = {
    param:{
      totalPageDom : $(".mdEditor")
    },
    init : function(){
      this.pageInit(self.param);
      this.pageEvent(self.param);
    },
    pageInit : function(param){
      //var nav = Events.navPageInit(param.curPage,param.totalPage,true);
      //param.paginationBox.append(nav);
      // 给分页按钮绑定事件
    },
    pageEvent : function(param){
      // 评论翻页
      // param.paginationBox.delegate("a","click",function(e){
      //   var curDom = $(e.currentTarget),
      //       id = curDom.attr("data-id"),
      //       blogid = curDom.attr("data-bid");
      //       curPage = parseInt($(param.curPageNum).attr("data-cur"));
      //       pageType = curDom.attr("aria-label");
      //   if(pageType =="Previous"){
      //     curPage = curPage-1==0?1:curPage-1
      //   }else{
      //     curPage = curPage+1>param.totalPage?param.totalPage:curPage+1
      //   }
      //   // 翻页
      //   Events.getPageHtml(blogid,curPage,5);
      // });
    }
  },
  Events = {
    navPageInit : function(curPage,totalPage,usereset){
        var tempPrev = (curPage -1)==0?1:curPage,
            tempNext = (curPage+1) > totalPage?totalPage:(curPage+1);
        var obj = {
          curPage:curPage,
          totalPage:totalPage,
          tempPrev :tempPrev,
          tempNext :tempNext,
          blogid : self.param.blogid
        }
        var html = $.tmpl(self.param.pageTpl,obj);
        return html;
    },
    getPageHtml : function(blogid,curPage,len){
      $.ajax({
          data:{
            blogid : blogid,
            method : "commentPage",
            curPage : curPage,
            len: len
          },
          url: '/blogDo',
          dataType: 'json',
          cache: false,
          timeout:5000,
          success: function(data){
              if(data.isSuccess){
                var html = $.tmpl(self.param.commentTpl,data)
                self.param.commentList.empty().append(html);
                var pageHtml = Events.navPageInit(curPage,self.param.totalPage,true);
                self.param.paginationBox.empty().append(pageHtml);
              }
          },
          error: function(jqXHR, textStatus, errorThrown){
              alert('error ' + textStatus + " " + errorThrown);
          }
      });
    }
  };
  try{self.init()}catch(e){console.log(e)}
})