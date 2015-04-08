# 博客实例
文件结构如下
```
controllers ---业务逻辑代码
        blog.js
model ---链接mysql和表模型
        db.js
node_modules ---依赖的模块
        ···
public ---静态文件
        css  ---页面中用到的css
            ···
        images ---页面中用到的图片
            ···
        js
             commonPlugins   ---第三方插件
                         ····
             home  ---页面前台页面用到的js
                      blog.js
             manage --- 页面后台用到的js
routes  ---项目路由
        web.js
sql  ---数据库中的表导出文件，数据库：mysql，数据库名：blog
      ···
views  ---项目视图
       ···
hello.js   --- 主入口文件
package.json ---配置文件
README.md
```