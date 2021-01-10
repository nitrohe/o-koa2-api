这是一个基于 Koa2 的轻量级 RESTful API Server 脚手架，支持mysql的CURD，支持 ES6。



```
git clone https://github.com/nitrohe/o-koa2-api.git
cd mv o-koa2-api
npm install
```



## 数据库配置说明



- 导入demo数据库development.sql
- 数据库相关配置：

```
// @位置 ./src/config.js
export const DB = {
  host: 'localhost', // 服务器地址
  port: 3306, // 数据库端口号
  username: 'root', // 数据库用户名
  password: 'xxx', // 数据库密码
  database: 'development', // 数据库名称
  prefix: 'api_' // 默认"api_"
}
```

- 表project的结构：

```
// @位置 ./src/models/model.js
export default {
  project: {
    id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: true,
      unique: false
    },
    title: {
      type: Sequelize.STRING(90),
      allowNull: true
      // validate: {
      //   is: ['^[a-z]+$', 'i'],
      //   not: ['[a-z]', 'i'],
      //   isEmail: true
      // }
      // field: 'project_title'
    }
  }
}
```

## API使用说明



约定使用 JSON 格式传输数据，POST、PUT、DELET 方法支持的 Content-Type 为`application/x-www-form-urlencoded、multipart/form-data、application/json`可配置支持跨域。非上传文件推荐 application/x-www-form-urlencoded。通常情况下返回 application/json 格式的 JSON 数据。



可选用 redis 等非关系型数据库。考虑 RESTful API Server 的实际开发需要，这里通过 sequelize.js 作为 PostgreSQL, MySQL, MariaDB, SQLite, MSSQL 关系型数据库的 ORM，如无需关系型 ORM，`npm remove sequelize -S`，然后删除`src/lib/sequelize.js`文件。



此脚手架只安装了一些和 Koa2 不冲突的搭建 RESTful API Server 的必要插件，附带每一个插件的说明。采用 ESlint 进行语法检查。



因此脚手架主要提供 RESTful API，故暂时不考虑前端静态资源处理，只提供静态资源访问的基本方法便于访问用户上传到服务器的图片等资源。基本目录结构与 vue-cli 保持一致，可配合 React、AngularJS、Vue.js 等前端框架使用。在 Cordova/PhoneGap、Electron 中使用时需要开启跨域功能。



#### CURD DEMO



- 获取单条数据：

GET  http://localhost:3000/api/project?id=1



- 获取分页数据：

GET  http://localhost:3000/api/project?currentPage=1&pageSize=20



- 增加一条数据：

POST  http://localhost:3000/api/project

Query Params

| key     | value       |
| ------- | ----------- |
| id      | 1           |
| title   | titleuuu    |
| content | cont-update |



- 更新一条数据：

PUT  http://localhost:3000/api/project

Query Params

| key     | value       |
| ------- | ----------- |
| id      | 1           |
| title   | titleuuu    |
| content | cont-update |



- 删除一条数据：

DELETE  http://localhost:3000/api/project?id=1

Query Params

| key  | value |
| ---- | ----- |
| id   | 1     |



- JWT校验

1. 先进行认证，获取token

POST [http://localhost:3000/api/](http://localhost:3000/api/project?id=1)login

Query Params

| key      | value  |
| -------- | ------ |
| userName | user1  |
| password | 123456 |

返回结果，取出token；



2.发送非get请求

Header 带上`Authorization: "Bearer " + token`



## 运行调试说明



```
#运行
# 可执行npm start跳过ESlint检查
npm run dev 

#调试
npm run dev --debug
#Or
npm start --debug
```



支持 Node.js 原生调试功能：https://nodejs.org/api/debugger.html



## 开发环境部署



生成 node 直接可以执行的代码到 dist 目录：



```
npm run build
```



```
npm run production # 生产模式运行
# Or
node dist/app.js
```



### PM2 部署说明



提供了 PM2 部署 RESTful API Server 的示例配置，位于“pm2.js”文件中。



```
pm2 start pm2.js
```



PM2 配合 Docker 部署说明： http://pm2.keymetrics.io/docs/usage/docker-pm2-nodejs/



### Docker 部署说明



```
docker pull node
docker run -itd --name RESTfulAPI -v `pwd`:/usr/src/app -w /usr/src/app node node ./dist/app.js
```



通过'docker ps'查看是否运行成功及运行状态



### Linux/Mac 直接后台运行生产环境代码



有时候为了简单，我们也这样做：



```
nohup node ./dist/app.js > logs/out.log &
```



查看运行状态（如果有'node app.js'出现则说明正在后台运行）：



```
ps aux|grep app.js
```



查看运行日志



```
cat logs/out.log
```



监控运行状态



```
tail -f logs/out.log
```



### 配合 Vue-cli 部署说明



Vue-cli（Vue2）运行'npm run build'后会在'dist'目录中生成所有静态资源文件。推荐使用 Nginx 处理静态资源以达最佳利用效果，然后通过上述任意一种方法部署 RESTful API 服务器。前后端是完全分离的，请注意 Koa2 RESTful API Server 项目中 config/main.json 里面的跨域配置。



推荐的 Nginx 配置文件：



```
server
    {
        listen 80;
        listen [::]:80;
        server_name abc.com www.abc.com; #绑定域名
        index index.html index.htm;
        root  /www/app/dist; #Vue-cli编译后的dist目录

        location ~ .*\.(gif|jpg|jpeg|png|bmp|swf)$
        {
            expires      30d;
        }

        location ~ .*\.(js|css)?$
        {
            expires      12h;
        }

        location ~ /\.
        {
            deny all;
        }

        access_log off; #访问日志路径
    }
```



Docker 中 Nginx 运行命令(将上述配置文件任意命名放置于 nginx_config 目录中即可)：



```
docker run -itd -p 80:80 -p 443:443 -v `pwd`/nginx_config:/etc/nginx/conf.d nginx
```



## 目录结构说明



```
.
├── README.md
├── .babelrc                # Babel 配置文件
├── .editorconfig           # 编辑器风格定义文件
├── .eslintignore           # ESlint 忽略文件列表
├── .eslintrc.js            # ESlint 配置文件
├── .gitignore              # Git 忽略文件列表
├── gulpfile.js             # Gulp配置文件
├── package.json            # 描述文件
├── pm2.js                  # pm2 部署示例文件
├── build                   # build 入口目录
│   └── dev-server.js       # 开发环境 Babel 实时编译入口
├── src                     # 源代码目录，编译后目标源代码位于 dist 目录
│   ├── app.js              # 入口文件
│   ├── config.js           # 主配置文件（*谨防泄密！）
│   ├── plugin              # 插件目录
│       └── smtp_sendemail  # 示例插件 - 发邮件
│   ├── tool                # 工具目录
│       ├── PluginLoader.js # 插件引入工具
│       └── Common.js       # 示例插件 - 发邮件
│   ├── lib                 # 库目录
│   ├── controllers         # 控制器
│   ├── models              # 模型
│   ├── routes              # 路由
│   └── services            # 服务
├── assets                  # 静态资源目录
└── logs                    # 日志目录
```



## 集成 NUXT 请求时身份认证说明



```
import Vue from 'vue'
import axios from 'axios'

const DevBaseUrl = 'http://127.0.0.1:3000'
const ProdBashUrl = 'https://api.xxx.com'

let config = {
  baseURL: process.env.NODE_ENV !== 'production' ? DevBaseUrl : ProdBashUrl // 配置API接口地址
}

if (process.env.VUE_ENV !== 'server') {
  let token = getToken() // 此函数自行实现
  if (token) {
    config.headers = {Authorization: 'Bearer ' + token}
  }
}

let request = axios.create(config)

// http request 拦截器
axios.interceptors.request.use(
  (config) => {
    if (window) {
      let token = getToken()
      if (token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

Vue.prototype.$request = request
```



## 各类主流框架调用 RESTful API 的示例代码（仅供参考）



### AngularJS (Ionic 同)



```
$http({
  method: "post",
  url: "http://localhost:3000/xxx",
  data: { para1: "para1", para2: "para2" },
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
})
  .success(function (data) {
    // do something
  })
  .error(function (data) {
    // do something
  });
```



### jQuery



```
$.ajax({
  cache: false,
  type: "POST",
  url: "http://localhost:3000/xxx",
  data: {
    para1: para1,
  },
  async: false,
  dataType: "json",
  success: function (result) {},
  error: function (err) {
    console.log(err);
  },
});

// 上传文件
//创建FormData对象
var data = new FormData();
//为FormData对象添加数据
//
$.each($("#inputfile")[0].files, function (i, file) {
  data.append("upload_file", file);
});
$.ajax({
  url: "http://127.0.0.1:3000/api/upload_oss_img_demo",
  type: "POST",
  data: data,
  cache: false,
  contentType: false, //不可缺
  processData: false, //不可缺
  success: function (data) {
    console.log(data);
    if (data.result == "ok") {
      $("#zzzz").attr("src", data.img_url);
    }
  },
});
```



### MUI



```
mui.ajax({
  url: "http://localhost:3000/xxx",
  dataType: "json",
  success: function (data) {},
  error: function (data) {
    console.log("error!");
  },
});
```



### JavaScript



```
var xhr = new XMLHttpRequest();
xhr.open("POST", "http://localhost:3000/xxx", true); //POST或GET，true（异步）或 false（同步）
xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xhr.withCredentials = true;
xhr.onreadystatechange = function () {
  if ((obj.readyState == 4 && obj.status == 200) || obj.status == 304) {
    var gotServices = JSON.parse(xhr.responseText);
  } else {
    console.log("ajax失败了");
  }
};
xhr.send({ para1: para1 });
```



### vue-resource



https://github.com/pagekit/vue-resource



```
// global Vue object
Vue.http.post('/someUrl', [body], {
  headers: {'Content-type', 'application/x-www-form-urlencoded'}
}).then(successCallback, errorCallback)
```



### fetch



https://github.com/github/fetch



```
fetch('/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Hubot',
    login: 'hubot',
  })
}).then(function(response) {
  // response.text()
}).then(function(body) {
  // body
})

// 文件上传
var input = document.querySelector('input[type='file']')

var data = new FormData()
data.append('file', input.files[0])
data.append('user', 'hubot')

fetch('/avatars', {
  method: 'POST',
  body: data
})
```



### superagent



https://github.com/visionmedia/superagent



```
request.post('/user')
 .set('Content-Type', 'application/json')
 .send('{'name':'tj','pet':'tobi'}')
 .end(callback)
```



### request



https://github.com/request/request



```
request.post('/api').form({key:'value'}), function(err,httpResponse,body){ /* ... */ })
```



在 React 中可以将上述任意方法其置于 componentDidMount()中，Vue.js 同理。



## 彻底移除 ESlint 方法



删除 package.json 的 devDependencies 中所有 eslint 开头的插件，根目录下的“.eslintignore、.eslintrc.js”文件，并且修改 package.json 的 dev 为：



```
'dev': 'gulp start'
```



删除 gulpfile.js 中的 lint、eslint_start 两个任务，并且把 default 改为“gulp.task('default', ['start']”。