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

## 反向代理

## 负载均衡

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

# gzip_proxied

# 增加Vary: Accept-Encoding返回头， 作用可以看 https://imququ.com/post/vary-header-in-http.html
gzip_vary on;

```

## 开启 https

## 开启 http2

## 开启 gzip
