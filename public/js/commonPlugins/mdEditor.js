define("js/commonPlugins/mdEditor",function(require, exports, module){
	var markedKissy = require("js/commonPlugins/markedKissy");
	var clickNum=0;
	var defaultConfig = null,
	mdEditor = function(options){
		defaultConfig = $.extend({
			containter :"#mdEditor",
			useIcon : true,
			helpUrl : "http://www.alibab.com",
			useTitle : true,
			titleName : "mdEditorInput",
			width : 300,
			height : 300,
			minWidth : 100,
			minHeight : 150,
			resize : "none",
			isId : true,
			mdEditorIcon : ".J-mdEditorIcon",
			mdUploadImg : ".J-mdUploadImg",
			uploadFile : "#J-uploadFile",
			uploadImgForm : "#J-uploadImgForm",
			mdEdit : ".J-mdEdit",
			mdPreview : ".J-mdPreview",
			mdFullScreen : ".J-mdFullScreen"
		},options);
	}

	mdEditor.prototype = {
		init : function(){
			if(!this.initIsIdOrClass()) return false;
			// 给textarea添加外面包裹的DIV
			this.addWarpDom();
			// 初始化textarea的宽高
			this.setTextareaSize(defaultConfig.containter);
		},
		initIsIdOrClass : function(){
			var firstChart = defaultConfig.containter.substring(0,1),
			    flag = false;
			// 如果添加标题
			if(firstChart == "#"){
				// 说明是用ID初始化
				flag = true;
				defaultConfig.isId = true;
			}else if(firstChart = "."){
				// 说明用class初始化
				defaultConfig.isId = false
				flag = true;
				// 如果是class为textarea容器,则为txt添加id
				$.each($(defaultConfig.containter),function(k,v){
					var vDom = $(v);
					var vId = typeof vDom.attr("id") == 'undefined'?false:true;
					// 如果textarea已经有了id，则以已经有的ID为主，否则自定义一个ID
					if(!vId){
						var temp = Math.floor(Math.random()*100000+1),
					        textareaId = "J-textareaMD"+temp;
					    $(v).attr("id",textareaId);
					    $(v).attr("autoId","true");
					}
				});
			}
			return flag;
		},
		setTextareaSize : function(containter){
			// 设置textarea的宽高度
			$(containter).css({
				width : "100%",
				resize : defaultConfig.resize,
				border : "none",
				outline : "none",
				padding : "3px 0 0",
				overflow : "auto"
			});
		},
		addWarpDom : function(){
			// 获取textarea
			var txtDoms = $(defaultConfig.containter),_self = this;
			$.each(txtDoms,function(k,v){
				var txt = $(v),classStr = null,idStr = null,temp = null;
				if(typeof txt.attr("autoId") != 'undefined'){
					// 说明是自动添加的id
					idStr = txt.attr("id");
					classStr = txt.attr("class");
					temp = idStr.substring(idStr.length - 5);
				}else{
					temp = txt.attr("id");
				}
				var divClass = "J-MDEditor"+temp;
				if(isNaN(defaultConfig.width) && defaultConfig.width != 'auto'){
					defaultConfig.width = defaultConfig.minWidth
				}else if(defaultConfig.width == 'auto'){
					//defaultConfig.width = $(defaultConfig.containter).parent().width();
				}else{
					// 设置编辑器宽高不能小于最小默认值
					if(defaultConfig.width <= defaultConfig.minWidth){
						defaultConfig.width = defaultConfig.minWidth
					}
				}
				if(isNaN(defaultConfig.height)){
					defaultConfig.height = $(defaultConfig.containter).parent().height();
				}else{
					if(defaultConfig.height <= defaultConfig.minHeight){
						defaultConfig.height = defaultConfig.minHeight
					}
				}

				// 计算由于padding存在的差异值
				var diff = 2 *(12+1),inputTitleDomHeight = 0;
				// 生产外面包裹的Div
				var warpDiv = $('<div></div>');
				warpDiv.attr("class",divClass).css({
					position:"relative",
					border : "1px solid #ddd",
					padding : "4px 20px 20px 10px",
					width : isNaN(defaultConfig.width)?defaultConfig.width:defaultConfig.width - diff,
					height : defaultConfig.height - diff,
					overflow :"hidden"
				});
				txt.wrap(warpDiv);
				// 添加标题
				if(defaultConfig.useTitle){
					var inputTitleId = defaultConfig.titleName+temp,
					    inputTitleDom = $('<input type="text" name='+defaultConfig.titleName+' id = '+inputTitleId+' class="J-'+defaultConfig.titleName+'"/>');
					    inputTitleDom.css({
					    	width :"100%",
					    	lineHeight : "30px",
					    	outline : "none",
					    	margin : "0px",
					    	padding : "0px",
					    	borderWidth : "0px 0px 1px 0px",
					    	borderStyle :"dotted",
					    	borderColor : "transparent transparent #ddd transparent",
					    	fontSize : "16px"
					    });
					inputTitleDom.insertBefore(txt);
					inputTitleDomHeight = parseInt(inputTitleDom.height());
				}else{
					inputTitleDomHeight = 0
				}
				// 重新设置textarea的高度
				var tempH = warpDiv.height() - inputTitleDomHeight - parseInt(warpDiv.css("padding-top")) - parseInt(warpDiv.css("padding-bottom"));
				txt.css({
					height : tempH
				});
				// 添加侧边工具栏
				if(defaultConfig.useIcon){
					var sideBar = '<div class="mdEditorIcon J-mdEditorIcon">'+
									'<form action="" id="J-uploadImgForm" style="position:relative;z-index:2;"><input type="file" class="mdEditorBtn uploadFile" id="J-uploadFile"/></form>'+
									'<span class="mdEditorBtn mdUploadImg J-mdUploadImg" style="z-index:1;"></span>'+
									'<span class="mdEditorBtn J-mdEdit mdEdit"></span>'+
									'<span class="mdEditorBtn J-mdPreview mdPreview"></span>'+
									'<span class="mdEditorBtn J-mdFullScreen mdFullScreen"></span>'+
									'<a href="'+defaultConfig.helpUrl+'" class="mdEditorBtn mdHelp" target="_blank"></a>'+
								'</div>';
					var sideBarHeight = parseInt($(sideBar).height()),
					   topTemp = (tempH - sideBarHeight) / 2,
					   sideBarDom = $(sideBar);
					// 隐藏编辑按钮
					sideBarDom.find(defaultConfig.mdEdit).hide();
					sideBarDom.insertAfter(txt).css({
						top : (warpDiv.height() - $(defaultConfig.mdEditorIcon).height())/2
					});
					// 给容器添加划入侧边栏显示，划出侧边栏隐藏
					_self.containterEvents(txt);
				}
			});
            // 侧边栏按钮添加事件
			_self.iconAddEvents()
		},
		iconAddEvents : function(){
			// 添加预览div
			var _self = this;
			// 预览事件
			$("body").delegate(defaultConfig.mdPreview,'click',function(e){
				// 获取最外层Div
				var curDom = $(e.currentTarget),
				    warpDiv = curDom.parent().parent(),
				    editBtn = warpDiv.find(defaultConfig.mdEdit),
				    txt = warpDiv.find('textarea'),
				    txtVal = txt.val(),
				    markedTxt = markedKissy(txtVal),
				    txtareaPreviewDom = _self.addPreviewDom(txt);
				// 编辑框隐藏，预览框显示
				txt.hide();
				_self.iframeSetVal(txtareaPreviewDom,markedTxt,true).show();
				// 编辑按钮显示，预览按钮隐藏
				editBtn.show();
				curDom.hide();
			});
			// 编辑按钮事件
			$("body").delegate(defaultConfig.mdEdit,'click',function(e){
				var curDom = $(e.currentTarget),
				    warpDiv = curDom.parent().parent(),
				    warpDivClass = warpDiv.attr("class"),
				    txt = warpDiv.find("textarea"),
				    txtName = txt.attr("name");
				    var previewDom = txt.siblings("#"+warpDivClass+"Preview");
				    // 编辑框显示，预览框隐藏
				    txt.show();
				    previewDom.hide();
				    // 编辑按钮隐藏，预览按钮显示
				    curDom.hide();
				    curDom.siblings(defaultConfig.mdPreview).show();
			});
			// 全屏按钮事件
			$("body").delegate(defaultConfig.mdFullScreen,'click',function(e){
				_self.addFullScreenDom($(e.currentTarget));
			});
			// 上传图片按钮事件
			$("body").delegate(defaultConfig.uploadFile,'change',function(e){
				// 如果图片验证有效，则上传图片
				if(_self.checkImgValid(e.currentTarget)){
    				// IO.upload("doUpload.php",formInfo.formId,function(d){
		         //        alert("uploadFileCallBackDate"+d);
		         //    },"json");
					var containter = $(e.currentTarget).parent().parent().siblings("textarea");

    				// 上传成功后，返回图片地址
    				var imgSrc = "http://d.hiphotos.baidu.com/image/pic/item/8601a18b87d6277f5dc7572e2b381f30e824fccb.jpg";
    				var imgMDGrammar = '![Alt text]('+imgSrc+' "Optional title")';
    				_self.insertAtCaret(containter,imgMDGrammar);
    			}
			});
			// 列表，省去敲空格，直接添加*号
			$("body").delegate(defaultConfig.containter,"keydown",function( e ){
        if(e.keyCode == 9){
            e.preventDefault();
            var indent = '    ';
            var start = this.selectionStart;
            var start = this.selectionStart;
            var val = this.value.substring(0,start);
            if( val.length ){
                var lines = val.split(/\n/);
                var line = lines[ lines.length -1 ];
                if( /^\s*([\-\*]|\d+\.)\s*$/.test( line ) ){

                    lines[ lines.length -1 ] =  line.replace(/([\-\*]|\d+\.)/,function( str , match ){
                        if( match === "*" || match === "-" ){
                            return "    -"
                        }else{
                            return "    *"
                        }
                    });
                    var val = lines.join("\n")  ;
                    this.value = val + this.value.substring( this.selectionEnd );
                    this.setSelectionRange( val.length , val.length );
                    return ;
                }
            }
            var end = this.selectionEnd;
            var selected = window.getSelection().toString();
            selected = indent + selected.replace(/\n/g,'\n'+indent);
            this.value = this.value.substring(0,start) + selected + this.value.substring(end);
            this.setSelectionRange(start+indent.length,start+selected.length);
        }else if( e.keyCode == 13 ){
            var start = this.selectionStart;
            var val = this.value.substring(0,start);
            if( val.length ){
                var lines = val.split(/\n/);
                var line = lines[ lines.length -1 ];
                line = line.match(/^(\s*(?:[\-\*]\s?|\d+\.\s?)?)/)
                e.preventDefault();
                var lineStart = line[0];
                lineStart = lineStart.replace(/^(\s*)(\d+)\./,function( str ,d ,cur ){
                    return d + ( parseInt( cur , 10 ) + 1 ) + ". ";
                })
                this.value = this.value.substring(0,start ) + "\n" + lineStart +  this.value.substring(start,end);
                var position = start+ line[0].length + 1 ;
                this.setSelectionRange( position , position );
            }
        }
	    });
		},
		containterEvents : function(txt){
			var containter = txt,
			    classStr = "."+containter.parent().attr("class");
			$("body").delegate(classStr,"mouseenter",function(){
				containter.siblings(defaultConfig.mdEditorIcon).show();
			});
			$("body").delegate(classStr,"mouseleave",function(){
				containter.siblings(defaultConfig.mdEditorIcon).hide();
			});
		},
		addPreviewDom : function(containter){
			var editContainter = containter,
				containterName = editContainter.parent().attr("class"),
				txtareaPreviewDom = $('<iframe marginwidth="0" marginheight="0" frameborder="0" style="border:none;width:100%;overflow-y:scroll;overflow-x:hidden;" id="'+containterName+'Preview"></iframe>'),
				previewIframe = $("#"+containterName+"Preview");
			if(previewIframe.length == 0){
				txtareaPreviewDom.css({
					width :"100%",
					height :editContainter.height()
				});
				txtareaPreviewDom.insertAfter(editContainter);
			}else{
				txtareaPreviewDom = previewIframe;
			}
			return txtareaPreviewDom;
		},
		addFullScreenDom : function(curDom){
			var _self = this,
			    editContainter = curDom.parent().siblings("textarea"),
				editContainterP = editContainter.parent(),
				warpDivClass = editContainterP.attr("class"),
				leftEditDivName = ".J-leftEditDiv",
				rightEditIframeName = ".J-rightEditIframeName",
				fatherIframeName = ".J-fatherIframe",
				fatherIframeDom = editContainterP.parents("body").find(fatherIframeName);
			if(fatherIframeDom.length == 0){
				var	fatherIframe = $('<iframe marginwidth="0" marginheight="0" frameborder="0" scrolling="no" class="J-fatherIframe" style="border: none; width: 100%; overflow-y:scroll;overflow-x:hidden;display:none"></iframe>'),
					leftEditDom = $('<textarea class="J-leftEditDiv" style="padding:5px;border:none;"></textarea>'),
					rightIframeDom = $('<iframe marginwidth="0" marginheight="0" frameborder="0" scrolling="no" class="J-rightEditIframe" style="border: none; width: 100%; overflow-y:scroll;overflow-x:hidden;"></iframe>'),
					screenW = window.screen.width,
					screenH = window.screen.height,
					averageW = screenW / 2;
				fatherIframe.css({
					width : "100%",
					height : screenH,
					background : "#ddd",
					position: 'fixed',
					top: '0',
	                left: '0',
	                'z-index': '9999',
	                zIndex: '9999',
	                border: 'none',
	                margin: 0
				});
				leftEditDom.css({
					width : averageW-1,
					height : screenH,
					position : "absolute",
					outline : "none",
					left : 0,
					top : 0
				});
				rightIframeDom.css({
					width : averageW,
					height : screenH,
					position : "absolute",
					right : 0,
					top : 0,
					background : "#fff"
				});
				fatherIframe.attr("id",warpDivClass+"FullScreen")
				editContainterP.append(fatherIframe);
				var fatherIframeDom = editContainterP.children().last(),
				tempDom = $("<div></div>");
				leftEditDom.text(editContainter.val());
				tempDom.append(leftEditDom);
				tempDom.append(rightIframeDom);
				var mergeIframe = _self.iframeSetVal(fatherIframeDom,tempDom.html());
				var tempLeftText = $(mergeIframe[0].contentWindow.document.body).find("textarea")
				var tempRightIframe = $(mergeIframe[0].contentWindow.document.body).find("iframe");
				_self.leftAreaBindEvent(mergeIframe,leftEditDivName);
				_self.iframeSetVal(tempRightIframe,markedKissy(editContainter.val()),true);
			}

			_self.requestFullScreen(fatherIframeDom);
			_self.listenKeyDown(fatherIframeDom);
			_self.leftAreaBindEvent(fatherIframeDom,leftEditDivName);
		},
		iframeSetVal : function(iframe,val,isPreview){
			if(typeof isPreview == 'undefined'){
				isPreview = false;
			}
			var iframeDOC=iframe[0].contentWindow.document;
	        	iframeDOC.designMode="on";
			    iframeDOC.contentEditable= true;
			    iframeDOC.open();
			    iframeDOC.close();
		    var styles='<link type="text/css" id="theme" rel="stylesheet" href="'+window.location.origin+'/js/themes/githubweb.css" media="screen">';
		    if(isPreview){
			    var headDom = $("head",iframeDOC),
			        linkDom = headDom.find("link");
			    if(headDom.html() == "" || linkDom == null || linkDom.length == 0){
			    	$("head",iframeDOC).append(styles);
			    }
		    }
		    $("body", iframeDOC).html(val);
		    iframeDOC.designMode="off";
		    return iframe;
		},
		requestFullScreen : function(element){
			element = element[0];
		    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
		    if (requestMethod){
		        requestMethod.call(element);
		    }else if(typeof window.ActiveXObject !== "undefined"){
		        var wscript = new ActiveXObject("WScript.Shell");
		        if (wscript !== null) {
		            wscript.SendKeys("{F11}");
		        }
		    }
		},
    listenKeyDown : function(fatherIframeDom){
      var _self = this;
        	document.addEventListener("fullscreenchange", function (e) {
        		_self.doit(fatherIframeDom);
			}, false);

			document.addEventListener("mozfullscreenchange", function (e) {
			    _self.doit(fatherIframeDom);
			}, false);

			document.addEventListener("webkitfullscreenchange", function (e){
				_self.doit(fatherIframeDom);
			}, false);
    },
    doit : function(fatherIframeDom){
    		if(typeof fatherIframeDom.attr("flag") != 'undefined'){
    			//说明是退出
    			fatherIframeDom.removeAttr("flag");
    			fatherIframeDom.toggle();
    			var iframeTxt = $(fatherIframeDom[0].contentWindow.document.body).find("textarea"),
	        		iframeTxtVal = iframeTxt.val(),
	                oldText = fatherIframeDom.siblings("textarea"),
	                oldTextVal = oldText.val();
                oldText.val(iframeTxtVal);
    		}else{
    			// 第一次加载，说明点击的是全屏
    			fatherIframeDom.attr("flag","true");
        		fatherIframeDom.toggle();
    		}
    },
    leftAreaBindEvent : function(mergeIframe,leftTxt){
     	var iframeDOC = mergeIframe[0].contentWindow.document,
     	    iframeBody = $("body", iframeDOC),
	    rightIframe = iframeBody.find("iframe"),
	    beforeTime = new Date().getTime(),
	    _self = this;
			iframeBody.delegate(leftTxt,'keyup',function(e){
				var curTime = new Date().getTime(),
				    tempTime = curTime - beforeTime;
				if(tempTime > 500){
					var txt = $(e.currentTarget).val();
					if(txt != ""){
						_self.iframeSetVal(rightIframe,markedKissy(txt),true);
						beforeTime = curTime;
					}
				}
			})
    },
    checkImgValid : function(file){
    	var fileDom = $(file),
    	    ext =[".gif",".jpg",".jpeg",".png"],
    	    fileName = fileDom.val(),
    	    fileExt = fileName.substr(fileName.lastIndexOf(".")),
    	    flag = 0;
    	$.each(ext,function(k,v){
    		if(fileExt == v){
    			flag++;
    		}
    	});
    	if(flag){
    		return true;
    	}else{
    		alert("图片格式不正确!");
    		return false;
    	}
    },
    insertAtCaret:function(obj, str){
    	obj = obj[0];
        if (document.selection) {
            obj.focus();
            var sel = document.selection.createRange();
            sel.text = str;
            sel.select();
        }else if(typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
            var startPos = obj.selectionStart,
                endPos = obj.selectionEnd,
                cursorPos = startPos,
                tmpStr = obj.value;
            obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
            cursorPos += str.length;
            obj.selectionStart = obj.selectionEnd = cursorPos;
        }else{
            obj.value += str;
        }
    }
	};
	return mdEditor;
})