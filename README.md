## express
### express+mysql


# Express学习笔记：

## Express 应用程序生成器 - Express.js创建一个名为blog，模板ejs的项目
### express --view=ejs blog

## 接着按提示符号操作：
``` change directory:
     > cd blog

   install dependencies:
     > npm install

   run the app:
     > SET DEBUG=blog:* & npm start
	```
## npm install sequelize -g 全局安装sequelize数据库操作依赖

## sequelize init 初始化项目
### 生成如下文件：
config ->数据库配置：sequelize连接数据库的配置文件
Migrations ->数据库迁移：sequelize迁移数据库的配置文件，增改删数据库表操作
Models ->数据库模型：sequelize增删改查数据库的表配置文件，每个模型对应数据库一张表
Seeders ->种子文件  一般存放测试数据

### 安装数据库mysql依赖
npm install -g mysql2

### 创建数据库
sequelize db:create --charset='utf8mb4'

### 创建数据库表Article
sequelize model:generate --name Article --attributes title:string, content:text

### 执行迁移
sequelize db:migrate

### 删除迁移
sequelize db:migrate undo all

### 创建种子文件
sequelize seed:generate  --name Article 

### 执行种子文件
sequelize db:seed

### 执行指定种子文件 
sequelize db:seed --seed 20200426094443-Article
