---
title: nginx
order: 3
group:
  title: 浏览器和网络
  order: 5
---

# nginx

`nginx`官网对`nginx`的描述为，`nginx`是一个`HTTP`和反向代理服务器，一个邮件代理服务器，一个普通的`TCP/UDP`代理服务器

对于普通`web`开发者，我觉得需要掌握基本的`nginx`知识，包括目录配置，转发配置，`https`和`http2`配置等

## 安装

不太想聊如何安装，因为不同系统安装方法会不一样

### windows

`windows`上，直接[下载](http://nginx.org/en/download.html)即可，下载后解压到某个目录，双击`nginx.exe`就可以运行

### Mac

`mac`上一般都推荐用`homebrew`安装

### linux

`linux`上的安装才是重点，因为服务器一般都是`linux`，我接触较多的是`CentOS`

`CentOS`上可以用`yum`命令来安装，`yum install nginx`，这样安装的话，不知道安装在哪个目录了，可以通过`rpm -ql nginx`来查询

对于`linux`比较熟悉的可以采用源码安装的方法

## 配置

`nginx`的配置一般在`conf/nginx.conf`文件，`nginx`把配置指令分为简单指令和块级指令，块级指令级用`{}`包裹的，可以有其他指令

打开`windows`上`1.20.1`版本的`nginx.conf`，内容大致如下，我新赠了部分注释以及配置

```yml
# 运行的用户和用户组，一般不需要配置，用默认值即可
#user nobody

# nginx进程数，一般设置为CPU的核心数
worker_processes 1;

# 错误日志目录，可以指定日志级别 debug, info, notice warn, error,crit, alert, emerg
# 上述级别是有顺序的，如果设置了warn，那么warn及warn以后的（error,crit...）都会输出
# 默认 error，但是一般不会在最外层设置error_log，而是在server层设置
#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

# pid文件的位置，pid文件存放的是进程id，为了防止启动多个副本
#pid logs/nginx.pid;

events {
  # 单个进程允许的最大并发数
  worker_connections  1024;
}

# 设置http服务器
http {
  # include 其实就是包含其他的配置
  # mime.types可以打开看一下，就是文件类型与文件扩展名的一个映射表
  include mime.types;

  # 默认文件类型，我理解为上面mime.types没匹配到的话就用默认值
  default_type application/octet-stream;

  # 定义日志的格式，main是日志格式的名字
  # $remote_addr这些是nginx的变量
  #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
  #                  '$status $body_bytes_sent "$http_referer" '
  #                  '"$http_user_agent" "$http_x_forwarded_for"';

  # 设置访问日志存放的文件和路径以及格式，main就是上面定义的日志格式
  # off 表示关闭访问日志，对于测试环境可能希望关闭访问日志
  #access_log off
  #access_log logs/access.log  main;

  # https://docs.nginx.com/nginx/admin-guide/web-server/serving-static-content/
  # 开启sendfile函数来传输文件，关于文件传输的还有sendfile_max_chunk，aio，directio等配置可以了解
  sendfile on;

  # 一般配合sendfile开启
  tcp_nopush on;

  # 默认即开启
  tcp_nodelay on;

  # gzip默认是没有开启的，但是建议开启，能够大大减小传输大小
  #gzip  on;

  server {
    # 监听的端口号
    listen 80;
    # 匹配请求头中的host，一般定义为指定的域名，比如www.xxx.com
    server_name localhost;

    #charset koi8-r;

    # 上面的access_log是全局的，这里的access_log是这个server的，一般用这一个
    #access_log  logs/host.access.log  main;

    # 匹配路径规则，详情见下方的location匹配规则
    location / {
        # 定义根目录，即访问这个location匹配的路径就是访问root定义的目录
        root   html;
        # 定义index，即访问的是一个目录的话，实际访问的是目录下的index定义的文件
        index  index.html index.htm;
    }

    #error_page  404              /404.html;

    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   html;
    }

    # proxy the PHP scripts to Apache listening on 127.0.0.1:80
    #
    #location ~ \.php$ {
    #    proxy_pass   http://127.0.0.1;
    #}

    # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
    #
    #location ~ \.php$ {
    #    root           html;
    #    fastcgi_pass   127.0.0.1:9000;
    #    fastcgi_index  index.php;
    #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
    #    include        fastcgi_params;
    #}

    # deny access to .htaccess files, if Apache's document root
    # concurs with nginx's one
    #
    #location ~ /\.ht {
    #    deny  all;
    #}
}
}
```

## 基本命令

- `nginx -t`

检测当前配置是否正确，一般重启或者重新加载配置前可以运行这个命令检测一下

- `nginx -s xxx`，`xxx`可以是

  - `stop`，表示快速退出，我理解为强制推出
  - `quit`，表示优雅地退出
  - `reload`，重新加载配置并重启，这个用得最多
  - `reopen`，打开日志文件

有时候会习惯写`nginx -s restart`，这个写法是不支持的

## 正向代理和反向代理

`nginx`一般作为反向代理来使用，但我不太理解什么是反向代理，所以做了一下了解

### 正向代理

现在有用户 A，服务器 A 和服务器 B，用户 A 不能访问服务器 A，但是可以访问服务器 B，而服务器 B 可以访问服务器 A

这时候，用户 A 在访问服务器 A 的时候，可以告诉服务器 B 说：“我要访问服务器 A 啦，你帮我访问并把结果返回给我吧”，于是服务器 B 就把访问结果返回给用户 A

假设用户 A 并不知道有代理的话，那么在他看来，他就是直接访问的服务器 A，并从服务器 A 得到了返回结果，比如我们使用代理访问谷歌就是这样

而服务器 A 只知道是服务器 B 访问了他，并不知道是用户 A 访问了，除非服务器 B 告诉服务器 A

总结就是，正向代理，代理的是客户端（用户 A），服务器并不知道是哪个客户端访问了他

### 反向代理

现在同样有用户 A，服务器 A，用户 A 可以自由访问服务器 A，没有任何问题，但是用户 A 不知道的是，他从服务器 A 得到的数据其实都是服务器 B 的

总结就是，反向代理，代理的是服务器，客户端并不知道真正的服务器地址

`nginx`反向代理可以解决跨域问题，比如有网站`www.xxx.com`，网站请求的实际接口是`api.xxx.com`，在接口没有添加跨域请求头`Access-Control-Allow-Origin`的话，就会产生跨域问题，而一般我们请求接口会有一个统一的前缀，比如`/api`，所以我们是能够区分请求的是接口还是静态资源的，本来实际请求的接口是`api.xxx.com/login`，我们可以请求`www.xxx.com/api/login`，然后通过`nginx`代理到`api.xxx.com/login`

```yml
http {
server {
listen 80;
server_name www.xxx.com;

location / {
root html;
index index.html;
}

location /api/ {
proxy_pass http://api.xxx.com/;
}
}
}
```

## 负载均衡

顾名思义，负载均衡的作用是，合理利用服务器资源，将请求分发到不同的服务器上，也可以在同一个服务器启动多个服务，避免某个服务挂掉后无法访问

```yml
http {
  upstream backend {
    # 负载分配方式
    ip_hash;
    # 定义服务器资源，后面还可以定义weight，max_fails等配置
    server 127.0.0.1:8080 weight=1; # weight表示权重，权重越大越容易分配
    server 127.0.0.1:8081;
  }

  server {
    location /api/ {
      proxy_pass http://backend/;
    }
  }
}
```

`nginx`的负载分配方式有多种

- `least_conn`，默认方式，即连接数最小的优先分配

  很多其他资料都说默认方式是轮询，但是我在官方文档没有找到轮询这个概念，我觉得对应的应该就是`least_conn`，如果有多个相同的服务器，则`tried in turn using a weighted round-robin`，这才是轮询的理解

- `least_time head | last_byte`，以平均响应时间来分配，`least_time head`是以收到响应头的时间，`least_time last_byte`是以最终结果的响应时间，如果有多个相同的服务器，则同样以加权循环的方式轮流分配

- `random`，随机选择

- `ip_hash`，已`ip`的`hash`值来分配服务器，可以保证同一`ip`访问的是同一个服务器，有利于`session`状态的保存

- `hash key`，以`key`做客户端和服务器的映射，`key`可以包含字符串和变量

  这个我不是很明白客户端和服务器是如何映射的

## 开启 gzip

`gzip`默认没有开启，`web`静态文件`html`，`js`，`css`等都建议开启

```yml
# 开启gzip
gzip on;

# gzip压缩等级，取值1-9，越大表示压缩越厉害，但CPU消耗也越大，不建议设置太大，一般1已经够用
gzip_comp_level 1;

# gzip压缩最小大小，超过这个才会被压缩，建议设置为1k，1k以下可能越压越大
gzip_min_length 1k;

# 设置gzip压缩的文件类型 text/html始终都会被压缩，所以不用设置
# 注意图片不要开启gzip，一般只有html，xml，css，js开启
gzip_types text/plain application/javascript application/x-javascript text/javascript text/css application/xml application/rss+xml;

# 作为反向代理服务器时，如何处理gzip
# off – 关闭所有的代理结果数据压缩
# expired – 如果header中包含”Expires”头信息，启用压缩
# no-cache – 如果header中包含”Cache-Control:no-cache”头信息，启用压缩
# no-store – 如果header中包含”Cache-Control:no-store”头信息，启用压缩
# private – 如果header中包含”Cache-Control:private”头信息，启用压缩
# no_last_modified – 启用压缩，如果header中包含”Last_Modified”头信息，启用压缩
# no_etag – 启用压缩，如果header中包含“ETag”头信息，启用压缩
# auth – 启用压缩，如果header中包含“Authorization”头信息，启用压缩
# any – 无条件压缩所有结果数据
gzip_proxied off;

# 增加Vary: Accept-Encoding返回头， 作用可以看 https://imququ.com/post/vary-header-in-http.html
gzip_vary on;
```

## 开启 https

`nginx`开启`https`需要`ngx_http_ssl_module`和`openssl`支持，`ngx_http_ssl_module`模块默认没有编译进去，不过一般通过`yum`安装的话，一般都是支持的

`nginx -V`可以查看`nginx`的编译信息，如果有`--with-http_ssl_module`则表示添加了`ngx_http_ssl_module`模块

`openssl version`可以查看是否支持`openssl`

`nginx`官网有提到，开启`https`后，会消耗更多的`CPU`资源，主要是消耗在`ssl handshake`这个阶段，所以开启`https`的话可以做以下优化（不开启也可以做以下优化）：

- `worker_processes`设置为`CPU`核心数
- 开启`keepalive`
- 启用`shared session cache`
- 禁用`builtin session cache`
- 可能的话，增加`session`的有效时间

对应的配置如下：

```yml
worker_processes auto;

http {
  server {
    listen 443 ssl; # ssl表示启用https
    keepalive_timeout 75s; # 默认值
    ssl_session_cache shared:SSL:10m; # 默认不开启缓存
    ssl_session_timeout 10m; # 默认5分钟
  }
}
```

完整的配置如下：

```yml
worker_processes auto;

http {
  server {
    listen 443 ssl; # ssl表示启用https
    keepalive_timeout 75s; # 默认值75s

    # 这个是之前的开启ssl的方法，已经在1.15.0版本被淘汰，建议采用listen的方法
    #ssl on;

    # 默认16k，想减少`First Byte`的响应时间的话可以减少这个大小
    ssl_buffer_size 16k;

    # 指定证书的路径
    ssl_certificate /my/path/to/certificate.crt;
    ssl_certificate_key /my/path/to/certificate.key;

    # 指定支持的协议
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;

    # 指定加密套件
    ssl_ciphers EECDH+CHACHA20:EECDH+CHACHA20-draft:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5;
    ssl_prefer_server_ciphers on;

    # OCSP Stapling开启,OCSP是用于在线查询证书吊销情况的服务，使用OCSP Stapling能将证书有效状态的信息缓存到服务器，提高TLS握手速度
    ssl_stapling on;
    ssl_stapling_verify on;

    ssl_session_cache shared:SSL:10m; # 默认不开启缓存
    ssl_session_timeout 10m; # 默认5分钟
  }
}
```

看到这里，对于不了解网络协议的我来说，着实头疼，推荐使用[https://ssl-config.mozilla.org/](https://ssl-config.mozilla.org/)来生成基本的配置，再逐步去了解每项配置背后的原因

## 开启 http2

`http2`有很多优点，比如我最喜欢的多路复用，`nginx`开启`http2`只需要在`listen`后面加上`http2`即可

```yml
http {
server {
listen 443 ssl http2;
}
}
```

## location 路径规则

在配置`location`路径的时候，会见到`=`,`~`,`~*`,`^~`,`@`这几种前缀写法，其意义分别如下：

- 省略，表示前缀匹配，匹配成功后，会继续匹配正则表达式，正则表达式匹配成功则返回正则表达式的匹配结果，否则返回此匹配结果

- `=`，表示完全匹配，匹配成功之后，不会继续匹配正则表达式

- `^~`，表示前缀匹配，与省略的区别是，匹配成功后不会继续匹配正则表达式

- `~`，表示区分大小写的正则匹配，可以用`!~`表示区分大小写的不匹配

- `~*`，表示不区分大小写的匹配，可以用`!~*`，表示不区分大小写的不匹配

从上面的说明看来，`location`的规则可以分为**普通**和**正则**两个类型，普通的类型的书写顺序没有影响，但是正则类型的书写顺序是有影响的，先书写的优先级高

## 使用 BrowserRouter 的单页应用，刷新 404，如何配置

`BrowserRouter`单页应用如果不配置的话，会出现刷新 404 的问题，解决方法如下：

```yml
http {
server {
location / {
try_files $uri $uri/ /index.html$is_args$args;
}
}
}
```

上述配置中，`$uri`,`$is_args`,`$args`都是`nginx`的变量，以`www.xxx.com/login?redirect=xxx`为例

`$uri`的值是`/login`，`$is_args`的值是`?`，`$args`的值是`redirect=xxx`

`try_files`定义的是文件查找的顺序，上述定义表示先查找文件`$uri`，再查找目录`$uri/`下面的`index`，都没找到的话就用`/index.html`来返回

## 总结

`nginx`对于`web`开发者来说，主要的作用是在生产环境下提供静态资源服务，在开发环境解决跨域问题

## 参考链接

[一文理清 nginx 中的 location 配置（系列一）](https://zhuanlan.zhihu.com/p/130819099)

[Nginx 深入使用-http 负载均衡服务器](https://wxb.github.io/2019/05/27/Nginx%E6%B7%B1%E5%85%A5%E4%BD%BF%E7%94%A8-http%E8%B4%9F%E8%BD%BD%E5%9D%87%E8%A1%A1%E6%9C%8D%E5%8A%A1%E5%99%A8.html)

[nginx 这一篇就够了](https://juejin.cn/post/6844903944267759624)
