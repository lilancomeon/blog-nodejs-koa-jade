define('js/commonPlugins/richEditor',function(require, exports, module){
  require("js/commonPlugins/hotkeys");
  require("js/commonPlugins/bootstrap.editor");

  function initToolbarBootstrapBindings() {
      var fonts = ['Serif', 'Sans', 'Arial', 'Arial Black', 'Courier',
            'Courier New', 'Comic Sans MS', 'Helvetica', 'Impact', 'Lucida Grande', 'Lucida Sans', 'Tahoma', 'Times',
            'Times New Roman', 'Verdana'],
            fontTarget = $('[title=Font]').siblings('.dropdown-menu');
      $.each(fonts, function (idx, fontName) {
          fontTarget.append($('<li><a data-edit="fontName ' + fontName +'" style="font-family:\''+ fontName +'\'">'+fontName + '</a></li>'));
      });
      $('a[title]').tooltip({container:'body'});
        $('.dropdown-menu input').click(function(){return false;})
            .change(function () {$(this).parent('.dropdown-menu').siblings('.dropdown-toggle').dropdown('toggle');})
        .keydown('esc', function () {this.value='';$(this).change();});

      $('[data-role=magic-overlay]').each(function(){
        var overlay = $(this), target = $(overlay.data('target'));
        overlay.css('opacity', 0).css('position', 'absolute').offset(target.offset()).width(target.outerWidth()).height(target.outerHeight());
        overlay.parent().css({width:overlay.parent().width()-20});
      });
  };
  function showErrorAlert (reason,detail) {
      var msg='';
      if (reason==='unsupported-file-type') { msg = "Unsupported format " +detail; }
      else {
          console.log("error uploading file", reason, detail);
      }
      $('<div class="alert"> <button type="button" class="close" data-dismiss="alert">&times;</button>'+
       '<strong>File upload error</strong> '+msg+' </div>').prependTo('#alerts');
  };
  initToolbarBootstrapBindings();
  var richEditor = function(option){
    option.selector.wysiwyg({ fileUploadError: showErrorAlert});
  }
  module.exports = richEditor
});