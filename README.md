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
 ```
 
 
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
 ```
 ### sequelize入坑操作如下：
 
  ```
  以下内容搬运自：
 https://itfun.tv/documents/271
 
  在本教程中,将通过简单地设置 Sequelize 来学习基础知识.

安装
Sequelize 可通过 npm ( 或 yarn ) 获得.

// 通过 npm 安装
npm install --save sequelize
你还需要手动安装对应的数据库驱动程序:

# 选择对应的安装:
$ npm install --save pg pg-hstore # Postgres
$ npm install --save mysql2
$ npm install --save mariadb
$ npm install --save sqlite3
$ npm install --save tedious # Microsoft SQL Server
建立连接
要连接到数据库,你必须创建 Sequelize 实例. 这可以通过将连接参数分别传递给 Sequelize 构造函数或传递单个连接 URI 来完成:

const Sequelize = require('sequelize');

//方法1:单独传递参数
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: /* 'mysql' | 'mariadb' | 'postgres' | 'mssql' 之一 */
});

// 方法2: 传递连接 URI
const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');
Sequelize 构造函数采用了 Sequelize构造函数的API参考 中记录的大量参数.

注意: 设置 SQLite
如果你正在使用 SQLite, 你应该使用以下代码:

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'path/to/database.sqlite'
});
注意: 连接池 (生产环境)
如果从单个进程连接到数据库,则应仅创建一个 Sequelize 实例. Sequelize 将在初始化时设置连接池. 可以通过构造函数的 options 参数(使用options.pool)配置此连接池,如以下示例所示:

const sequelize = new Sequelize(/* ... */, {
  // ...
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});
在Sequelize构造函数API参考中了解更多信息. 如果从多个进程连接到数据库,则必须为每个进程创建一个实例,但每个实例应具有最大连接池大小,以便遵守总的最大大小.例如,如果你希望最大连接池大小为 90 并且你有三个进程,则每个进程的 Sequelize 实例的最大连接池大小应为 30.

测试连接
你可以使用 .authenticate() 函数来测试连接.

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
关闭连接
Sequelize 将默认保持连接持续,并对所有查询使用相同的连接. 如果需要关闭连接,请调用sequelize.close()(这是异步的并返回Promise).

表建模
模型是一个扩展 Sequelize.Model 的类. 模型可以用两种等效方式定义. 第一个是Sequelize.Model.init(属性,参数):

const Model = Sequelize.Model;
class User extends Model {}
User.init({
  // 属性
  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING
    // allowNull 默认为 true
  }
}, {
  sequelize,
  modelName: 'user'
  // 参数
});
另一个是使用 sequelize.define:

const User = sequelize.define('user', {
  // 属性
  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING
    // allowNull 默认为 true
  }
}, {
  // 参数
});
在内部, sequelize.define 调用 Model.init.

上面的代码告诉 Sequelize 在数据库中期望一个名为 users 的表,其中包含 firstName 和 lastName 字段. 默认情况下,表名自动复数(在当下使用inflection 库来执行此操作).通过使用 freezeTableName:true 参数可以为特定模型停止此行为,或者通过使用Sequelize构造函数中的 define 参数为所有模型停止此行为.

Sequelize 还默认为每个模型定义了字段id(主键),createdAt和updatedAt. 当然也可以更改此行为(请查看API参考以了解有关可用参数的更多信息).

更改默认模型参数
Sequelize 构造函数采用 define 参数,它将更改所有已定义模型的默认参数.

const sequelize = new Sequelize(connectionURI, {
  define: {
    // `timestamps` 字段指定是否将创建 `createdAt` 和 `updatedAt` 字段.
    // 该值默认为 true, 但是当前设定为 false
    timestamps: false
  }
});

// 这里 `timestamps` 为 false,因此不会创建 `createdAt` 和 `updatedAt` 字段.
class Foo extends Model {}
Foo.init({ /* ... */ }, { sequelize });

// 这里 `timestamps` 直接设置为 true,因此将创建 `createdAt` 和 `updatedAt` 字段.
class Bar extends Model {}
Bar.init({ /* ... */ }, { sequelize, timestamps: true });
你可以在Model.init API 参考 或 sequelize.define API 参考 中阅读有关创建模型的更多信息.

将模型与数据库同步
如果你希望 Sequelize 根据你的模型定义自动创建表(或根据需要进行修改),你可以使用sync方法,如下所示:

// 注意:如果表已经存在,使用`force:true`将删除该表
User.sync({ force: true }).then(() => {
  // 现在数据库中的 `users` 表对应于模型定义
  return User.create({
    firstName: 'John',
    lastName: 'Hancock'
  });
});
一次同步所有模型
你可以调用sequelize.sync()来自动同步所有模型,而不是为每个模型调用sync().

生产环境注意事项
在生产环境中,你可能需要考虑使用迁移而不是在代码中调用sync().阅读 Migrations(迁移) 了解更多信息.

查询
一些简单的查询如下所示:

// 查找所有用户
User.findAll().then(users => {
  console.log("All users:", JSON.stringify(users, null, 4));
});

// 创建新用户
User.create({ firstName: "Jane", lastName: "Doe" }).then(jane => {
  console.log("Jane's auto-generated ID:", jane.id);
});

// 删除所有名为“Jane”的人
User.destroy({
  where: {
    firstName: "Jane"
  }
}).then(() => {
  console.log("Done");
});

// 将所有没有姓氏的人改为“Doe”
User.update({ lastName: "Doe" }, {
  where: {
    lastName: null
  }
}).then(() => {
  console.log("Done");
});
Sequelize 有很多查询参数. 你将在下一个教程中了解有关这些内容的更多信息. 也可以进行原始SQL查询,如果你真的需要它们.

Promises 和 async/await
如上所示,通常普遍使用 .then 调用,Sequelize 普遍使用 Promise. 这意味着,如果你的 Node 版本支持它,你可以对使用 Sequelize 进行的所有异步调用使用 ES2017 async/await 语法.

此外,所有 Sequelize promises 实际上都是 Bluebird promises,所以你也可以使用丰富的 Bluebird API(例如,使用finally,tap,tapCatch,map,mapSeries等). 如果要设置任何 Bluebird 特定参数,可以使用 Sequelize 内部使用的Sequelize.Promise 访问 Bluebird 构造函数.

// 不要这样做
user = User.findOne()

console.log(user.get('firstName'));
这将永远不可用！这是因为user是 promise 对象，而不是数据库中的数据行。 正确的方法是：

User.findOne().then(user => {
  console.log(user.get('firstName'));
});
当您的环境或解释器支持 async/await 时，这将可用，但只能在 async 方法体中：

user = await User.findOne()

console.log(user.get('firstName'));
Express 案例
在 Express 中，你可以

var express = require('express');
var router = express.Router();
var models = require('../models');

router.get('/', async function (req, res, next) {
    var users = await models.User.findAll();
    res.json({users: users});
});

module.exports = router;


Sequelize 独立于特定方言. 这意味着你必须自己将相应的连接器库安装到项目中.

MySQL
为了让 Sequelize 与 MySQL 一起更好地工作,你需要安装 mysql2@^1.5.2 或更高版本. 一旦完成,你可以像这样使用它:

const sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'mysql'
})
注意: 你可以通过设置 dialectOptions 参数将选项直接传递给方言库.参考参数.

MariaDB
MariaDB 的库是 mariadb.

const sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'mariadb',
  dialectOptions: {connectTimeout: 1000} // mariadb 连接参数
})
或使用连接字符串:

const sequelize = new Sequelize('mariadb://user:password@example.com:9821/database')
SQLite
由于 SQLite 兼容性,你需要sqlite3@^4.0.0. 像这样配置 Sequelize:

const sequelize = new Sequelize('database', 'username', 'password', {
  // sqlite!
  dialect: 'sqlite',

  // sqlite 的存储引擎
  // - default ':memory:'
  storage: 'path/to/database.sqlite'
})
或者你也可以使用连接字符串和路径:

const sequelize = new Sequelize('sqlite:/home/abs/path/dbname.db')
const sequelize = new Sequelize('sqlite:relativePath/dbname.db')
PostgreSQL
对于 PostgreSQL,需要两个库,pg@^7.0.0 和 pg-hstore. 你只需要定义方言:

const sequelize = new Sequelize('database', 'username', 'password', {
  // postgres!
  dialect: 'postgres'
})
要通过 unix 域套接字进行连接,请在 host 选项中指定套接字目录的路径.

套接字路径必须以 / 开头.

const sequelize = new Sequelize('database', 'username', 'password', {
  // postgres!
  dialect: 'postgres',
  host: '/path/to/socket_directory'
})
MSSQL
MSSQL的库是 tedious@^6.0.0 你只需要定义方言:

const sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'mssql'
})

以下是 sequelize 支持的一些数据类型. 有关完整和更新的列表请参阅数据类型.

Sequelize.STRING                      // VARCHAR(255)
Sequelize.STRING(1234)                // VARCHAR(1234)
Sequelize.STRING.BINARY               // VARCHAR BINARY
Sequelize.TEXT                        // TEXT
Sequelize.TEXT('tiny')                // TINYTEXT
Sequelize.CITEXT                      // CITEXT      仅 PostgreSQL 和 SQLite.

Sequelize.INTEGER                     // INTEGER
Sequelize.BIGINT                      // BIGINT
Sequelize.BIGINT(11)                  // BIGINT(11)

Sequelize.FLOAT                       // FLOAT
Sequelize.FLOAT(11)                   // FLOAT(11)
Sequelize.FLOAT(11, 10)               // FLOAT(11,10)

Sequelize.REAL                        // REAL        仅 PostgreSQL.
Sequelize.REAL(11)                    // REAL(11)    仅 PostgreSQL.
Sequelize.REAL(11, 12)                // REAL(11,12) 仅 PostgreSQL.

Sequelize.DOUBLE                      // DOUBLE
Sequelize.DOUBLE(11)                  // DOUBLE(11)
Sequelize.DOUBLE(11, 10)              // DOUBLE(11,10)

Sequelize.DECIMAL                     // DECIMAL
Sequelize.DECIMAL(10, 2)              // DECIMAL(10,2)

Sequelize.DATE                        // mysql / sqlite 为 DATETIME, postgres 为带时区的 TIMESTAMP
Sequelize.DATE(6)                     // DATETIME(6) 适用 mysql 5.6.4+. 小数秒支持最多6位精度
Sequelize.DATEONLY                    // DATE 不带时间.
Sequelize.BOOLEAN                     // TINYINT(1)

Sequelize.ENUM('value 1', 'value 2')  // 一个允许值为'value 1'和'value 2'的ENUM
Sequelize.ARRAY(Sequelize.TEXT)       // 定义一个数组. 仅 PostgreSQL.
Sequelize.ARRAY(Sequelize.ENUM)       // 定义一个ENUM数组. 仅 PostgreSQL.

Sequelize.JSON                        // JSON 列. 仅 PostgreSQL, SQLite 和 MySQL.
Sequelize.JSONB                       // JSONB 列. 仅 PostgreSQL.

Sequelize.BLOB                        // BLOB (PostgreSQL 为 bytea)
Sequelize.BLOB('tiny')                // TINYBLOB (PostgreSQL 为 bytea. 其余参数是 medium 和 long)

Sequelize.UUID                        // PostgreSQL 和 SQLite 的 UUID 数据类型,MySQL 的 CHAR(36) BINARY(使用defaultValue:Sequelize.UUIDV1 或 Sequelize.UUIDV4 来让 sequelize 自动生成 id).

Sequelize.CIDR                        // PostgreSQL 的 CIDR 数据类型
Sequelize.INET                        // PostgreSQL 的 INET 数据类型
Sequelize.MACADDR                     // PostgreSQL 的 MACADDR 数据类型

Sequelize.RANGE(Sequelize.INTEGER)    // 定义 int4range 范围. 仅 PostgreSQL.
Sequelize.RANGE(Sequelize.BIGINT)     // 定义 int8range 范围. 仅 PostgreSQL.
Sequelize.RANGE(Sequelize.DATE)       // 定义 tstzrange 范围. 仅 PostgreSQL.
Sequelize.RANGE(Sequelize.DATEONLY)   // 定义 daterange 范围. 仅 PostgreSQL.
Sequelize.RANGE(Sequelize.DECIMAL)    // 定义 numrange 范围. 仅 PostgreSQL.

Sequelize.ARRAY(Sequelize.RANGE(Sequelize.DATE)) // 定义 tstzrange 范围的数组. 仅 PostgreSQL.

Sequelize.GEOMETRY                    // Spatial 列. 仅 PostgreSQL (带有 PostGIS) 或 MySQL.
Sequelize.GEOMETRY('POINT')           // 带有 geometry 类型的 spatial 列. 仅 PostgreSQL (带有 PostGIS) 或 MySQL.
Sequelize.GEOMETRY('POINT', 4326)     // 具有 geometry 类型和 SRID 的 spatial 列. 仅 PostgreSQL (带有 PostGIS) 或 MySQL.
BLOB 数据类型允许你以字符串和 buffer 的形式插入数据. 当你在具有 BLOB 列的模型上执行 find 或 findAll 时,该数据将始终作为 buffer 返回.

如果你正在使用 PostgreSQL 不带时区的 TIMESTAMP 并且你需要将其解析为不同的时区,请使用 pg 库自己的解析器:

require('pg').types.setTypeParser(1114, stringValue => {
  return new Date(stringValue + '+0000');
  // 例如,UTC偏移. 使用你想要的任何偏移量.
});
除了上面提到的类型之外,integer,bigint,float 和 double 还支持 unsigned 和 zerofill 属性,这些属性可以按任何顺序组合: 请注意,这不适用于 PostgreSQL！

Sequelize.INTEGER.UNSIGNED              // INTEGER UNSIGNED
Sequelize.INTEGER(11).UNSIGNED          // INTEGER(11) UNSIGNED
Sequelize.INTEGER(11).ZEROFILL          // INTEGER(11) ZEROFILL
Sequelize.INTEGER(11).ZEROFILL.UNSIGNED // INTEGER(11) UNSIGNED ZEROFILL
Sequelize.INTEGER(11).UNSIGNED.ZEROFILL // INTEGER(11) UNSIGNED ZEROFILL
以上示例仅显示整数,但使用 bigint 和 float 可以完成相同的操作

对象表示法中的用法:

// 对于枚举:
class MyModel extends Model {}
MyModel.init({
  states: {
    type: Sequelize.ENUM,
    values: ['active', 'pending', 'deleted']
  }
}, { sequelize })
数组(ENUM)
只支持PostgreSQL.

Array(枚举)类型需要特殊处理. 每当Sequelize与数据库通信时,它必须使用ENUM名称对数组值进行类型转换.

所以这个枚举名必须遵循这个模式enum_<table_name>_<col_name>. 如果你使用sync,则会自动生成正确的名称.


Range 类型
由于 range 类型具有针对其绑定 inclusion/exclusion 的额外信息,因此不能非常简单地使用元组在javascript中表示它们.

提供 range 作为值时,你可以从以下API中进行选择:

// 默认为 '["2016-01-01 00:00:00+00:00", "2016-02-01 00:00:00+00:00")'
// 包含下限,不包含上限
Timeline.create({ range: [new Date(Date.UTC(2016, 0, 1)), new Date(Date.UTC(2016, 1, 1))] });

// 控制包含
const range = [
  { value: new Date(Date.UTC(2016, 0, 1)), inclusive: false },
  { value: new Date(Date.UTC(2016, 1, 1)), inclusive: true },
];
// '("2016-01-01 00:00:00+00:00", "2016-02-01 00:00:00+00:00"]'

// 复合形式
const range = [
  { value: new Date(Date.UTC(2016, 0, 1)), inclusive: false },
  new Date(Date.UTC(2016, 1, 1)),
];
// '("2016-01-01 00:00:00+00:00", "2016-02-01 00:00:00+00:00")'

Timeline.create({ range });
但请注意,每当你收到一个范围值,你将收到:

// 存储值: ("2016-01-01 00:00:00+00:00", "2016-02-01 00:00:00+00:00"]
range // [{ value: Date, inclusive: false }, { value: Date, inclusive: true }]
在使用 range 类型更新实例后,你需要调用 reload,或使用 returning:true 参数.

特别案例
// 空的范围:
Timeline.create({ range: [] }); // range = 'empty'

// 无边界范围:
Timeline.create({ range: [null, null] }); // range = '[,)'
// range = '[,"2016-01-01 00:00:00+00:00")'
Timeline.create({ range: [null, new Date(Date.UTC(2016, 0, 1))] });

// 无穷范围:
// range = '[-infinity,"2016-01-01 00:00:00+00:00")'
Timeline.create({ range: [-Infinity, new Date(Date.UTC(2016, 0, 1))] });
扩展数据类型
你尝试实现的类型很可能已包含在 DataTypes 中. 如果未包含新数据类型,本手册将说明如何自行编写.

Sequelize 不会在数据库中创建新的数据类型. 本教程介绍如何使 Sequelize 识别新的数据类型,并假设已在数据库中创建了这些新的数据类型.

要扩展 Sequelize 数据类型,请在创建任何实例之前执行此操作. 此示例创建一个虚拟的 NEWTYPE,它复制内置数据类型 Sequelize.INTEGER(11).ZEROFILL.UNSIGNED.

// myproject/lib/sequelize.js

const Sequelize = require('Sequelize');
const sequelizeConfig = require('../config/sequelize')
const sequelizeAdditions = require('./sequelize-additions')

// 添加新数据类型的函数
sequelizeAdditions(Sequelize.DataTypes)

// 在这个例子中,创建并导出Sequelize实例
const sequelize = new Sequelize(sequelizeConfig)

modules.exports = sequelize
// myproject/lib/sequelize-additions.js

modules.exports = function sequelizeAdditions(Sequelize) {

  DataTypes = Sequelize.DataTypes

  /*
   * 创建新类型
   */
  class NEWTYPE extends DataTypes.ABSTRACT {
    // 强制,在数据库中完整定义新类型
    toSql() {
      return 'INTEGER(11) UNSIGNED ZEROFILL'
    }

    // 可选,验证器功能
    validate(value, options) {
      return (typeof value === 'number') && (! Number.isNaN(value))
    }

    // 可选,sanitizer
    _sanitize(value) {
      // Force all numbers to be positive
      if (value < 0) {
        value = 0
      }

      return Math.round(value)
    }

    // 可选,发送到数据库之前的值字符串
    _stringify(value) {
      return value.toString()
    }

    // 可选,解析从数据库接收的值
    static parse(value) {
      return Number.parseInt(value)
    }
  }

  // 强制,设置 Key
  DataTypes.NEWTYPE.prototype.key = DataTypes.NEWTYPE.key = 'NEWTYPE'

  // 可选, 在stringifier后禁用转义. 不建议.
  // 警告:禁用针对SQL注入的Sequelize保护
  //DataTypes.NEWTYPE.escape = false

  // 为了简便`classToInvokable` 允许你使用没有 `new` 的数据类型
  Sequelize.NEWTYPE = Sequelize.Utils.classToInvokable(DataTypes.NEWTYPE)

}
创建此新数据类型后,你需要在每个数据库方言中映射此数据类型并进行一些调整.

PostgreSQL
假设在 postgres 数据库中新数据类型的名称是pg_new_type. 该名称必须映射到DataTypes.NEWTYPE. 此外,还需要创建 postgres 特定的子数据类型.

// myproject/lib/sequelize-additions.js

modules.exports = function sequelizeAdditions(Sequelize) {

  DataTypes = Sequelize.DataTypes

  /*
   * 创建新类型
   */

  ...

  /*
   * 映射新类型
   */

  // 强制, 映射 postgres 数据类型名称
  DataTypes.NEWTYPE.types.postgres = ['pg_new_type']

  // 强制, 使用自己的 parse 方法创建 postgres 特定的子数据类型. 解析器将动态映射到 pg_new_type 的 OID.
  PgTypes = DataTypes.postgres

  PgTypes.NEWTYPE = function NEWTYPE() {
    if (!(this instanceof PgTypes.NEWTYPE)) return new PgTypes.NEWTYPE();
    DataTypes.NEWTYPE.apply(this, arguments);
  }
  inherits(PgTypes.NEWTYPE, DataTypes.NEWTYPE);

  // 强制, 创建,覆盖或重新分配postgres特定的解析器
  //PgTypes.NEWTYPE.parse = value => value;
  PgTypes.NEWTYPE.parse = BaseTypes.NEWTYPE.parse;

  // 可选, 添加或覆盖 postgres 特定数据类型的方法
  // 比如 toSql, escape, validate, _stringify, _sanitize...

}
范围
在postgres中定义新的范围类型之后, 将它添加到Sequelize是微不足道的.

在这个例子中,postgres范围类型的名称是newtype_range,底层postgres数据类型的名称是pg_new_type. subtypes和castTypes的关键是Sequelize数据类型DataTypes.NEWTYPE.key的关键字,小写.

// myproject/lib/sequelize-additions.js

modules.exports = function sequelizeAdditions(Sequelize) {

  DataTypes = Sequelize.DataTypes

  /*
   * 创建新类型
   */

  ...

  /*
   * 映射新类型
   */

  ...

  /*
   * 添加范围支持
   */

  // 添加 postgresql 范围,newtype 来自 DataType.NEWTYPE.key,小写
  DataTypes.RANGE.types.postgres.subtypes.newtype = 'newtype_range';
  DataTypes.RANGE.types.postgres.castTypes.newtype = 'pg_new_type';

}
新范围可以在模型定义中用作 Sequelize.RANGE(Sequelize.NEWTYPE)或DataTypes.RANGE(DataTypes.NEWTYPE).

要定义模型和表之间的映射,请使用 define 方法. 每列必须具有数据类型,请参阅 datatypes 的更多信息.

class Project extends Model {}
Project.init({
  title: Sequelize.STRING,
  description: Sequelize.TEXT
}, { sequelize, modelName: 'project' });

class Task extends Model {}
Task.init({
  title: Sequelize.STRING,
  description: Sequelize.TEXT,
  deadline: Sequelize.DATE
}, { sequelize, modelName: 'task' })
除了datatypes,你可以在每列上设置很多参数.

class Foo extends Model {}
Foo.init({
 // 如果未赋值,则自动设置值为 TRUE
 flag: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true},

 // 设置默认时间为当前时间
 myDate: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },

 // 将allowNull设置为false会将NOT NULL添加到列中,
 // 这意味着当列为空时执行查询时将从DB抛出错误. 
 // 如果要在查询DB之前检查值不为空,请查看下面的验证部分.
 title: { type: Sequelize.STRING, allowNull: false},

 // 创建具有相同值的两个对象将抛出一个错误. 唯一属性可以是布尔值或字符串.
 // 如果为多个列提供相同的字符串,则它们将形成复合唯一键.
 uniqueOne: { type: Sequelize.STRING,  unique: 'compositeIndex'},
 uniqueTwo: { type: Sequelize.INTEGER, unique: 'compositeIndex'},

 // unique属性用来创建一个唯一约束.
 someUnique: {type: Sequelize.STRING, unique: true},

 // 这与在模型选项中创建索引完全相同.
 {someUnique: {type: Sequelize.STRING}},
 {indexes: [{unique: true, fields: ['someUnique']}]},

 // primaryKey用于定义主键.
 identifier: { type: Sequelize.STRING, primaryKey: true},

 // autoIncrement可用于创建自增的整数列
 incrementMe: { type: Sequelize.INTEGER, autoIncrement: true },

 // 你可以通过'field'属性指定自定义列名称:
 fieldWithUnderscores: { type: Sequelize.STRING, field: 'field_with_underscores' },

 // 这可以创建一个外键:
 bar_id: {
   type: Sequelize.INTEGER,

   references: {
     // 这是引用另一个模型
     model: Bar,

     // 这是引用模型的列名称
     key: 'id',

     // 这声明什么时候检查外键约束. 仅限PostgreSQL.
     deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
   }
 },

 // 仅可以为 MySQL,PostgreSQL 和 MSSQL 的列添加注释
 commentMe: {
   type: Sequelize.INTEGER,

   comment: '这是一个包含注释的列名'
 }
}, {
  sequelize,
  modelName: 'foo'
});
注释选项也可以在表上使用, 查看 model configuration.

时间戳
默认情况下,Sequelize 会将 createdAt 和 updatedAt 属性添加到模型中,以便你能够知道数据库条目何时进入数据库以及何时被更新.

请注意,如果你使用 Sequelize 迁移,则需要将 createdAt 和 updatedAt 字段添加到迁移定义中:

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('my-table', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      // 时间戳
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    })
  },
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('my-table');
  },
}

如果你不想在模型上使用时间戳,只需要一些时间戳记,或者你正在使用现有的数据库,其中列被命名为别的东西,直接跳转到 configuration 以查看如何执行此操作.

可延迟
当你在 PostgreSQL 中指定外键列的参数来声明成一个可延迟类型. 可用的选项如下:

// 将所有外键约束检查推迟到事务结束时.
Sequelize.Deferrable.INITIALLY_DEFERRED

// 立即检查外键约束.
Sequelize.Deferrable.INITIALLY_IMMEDIATE

// 不要推迟检查.
Sequelize.Deferrable.NOT
最后一个参数是 PostgreSQL 的默认值,不允许你在事务中动态的更改规则. 查看 事务 章节获取补充信息.

Getters & setters
可以在模型上定义'对象属性'getter和setter函数,这些可以用于映射到数据库字段的“保护”属性,也可以用于定义“伪”属性.

Getters和Setters可以通过两种方式定义(你可以混合使用这两种方式):

作为属性定义的一部分
作为模型参数的一部分
注意: 如果在两个地方定义了getter或setter,那么在相关属性定义中找到的函数始终是优先的.

定义为属性定义的一部分
class Employee extends Model {}
Employee.init({
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    get() {
      const title = this.getDataValue('title');
      // 'this' 允许你访问实例的属性
      return this.getDataValue('name') + ' (' + title + ')';
    },
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
    set(val) {
      this.setDataValue('title', val.toUpperCase());
    }
  }
}, { sequelize, modelName: 'employee' });

Employee
  .create({ name: 'John Doe', title: 'senior engineer' })
  .then(employee => {
    console.log(employee.get('name')); // John Doe (SENIOR ENGINEER)
    console.log(employee.get('title')); // SENIOR ENGINEER
  })
定义为模型参数的一部分
以下是在模型参数中定义 getter 和 setter 的示例.

fullName getter,是一个说明如何在模型上定义伪属性的例子 - 这些属性实际上不是数据库模式的一部分. 事实上,伪属性可以通过两种方式定义:使用模型getter,或者使用虚拟数据类型的列. 虚拟数据类型可以有验证,而虚拟属性的getter则不能.

请注意,fullName getter函数中引用的this.firstname和this.lastname将触发对相应getter函数的调用. 如果你不想这样,可以使用getDataValue()方法来访问原始值(见下文).

class Foo extends Model {
  get fullName() {
    return this.firstname + ' ' + this.lastname;
  }

  set fullName(value) {
    const names = value.split(' ');
    this.setDataValue('firstname', names.slice(0, -1).join(' '));
    this.setDataValue('lastname', names.slice(-1).join(' '));
  }
}
Foo.init({
  firstname: Sequelize.STRING,
  lastname: Sequelize.STRING
}, {
  sequelize,
  modelName: 'foo'
});

// 或使用 `sequelize.define`
sequelize.define('Foo', {
  firstname: Sequelize.STRING,
  lastname: Sequelize.STRING
}, {
  getterMethods: {
    fullName() {
      return this.firstname + ' ' + this.lastname;
    }
  },

  setterMethods: {
    fullName(value) {
      const names = value.split(' ');

      this.setDataValue('firstname', names.slice(0, -1).join(' '));
      this.setDataValue('lastname', names.slice(-1).join(' '));
    }
  }
});
用于 getter 和 setter 定义内部的 Helper 方法
检索底层属性值 - 总是使用 this.getDataValue()
/* 一个用于 'title' 属性的 getter */
get() {
  return this.getDataValue('title')
}
设置基础属性值 - 总是使用 this.setDataValue()
/* 一个用于 'title' 属性的 setter */
set(title) {
  this.setDataValue('title', title.toString().toLowerCase());
}
注意: 坚持使用 setDataValue() 和 getDataValue() 函数(而不是直接访问底层的“数据值”属性)是非常重要的 - 这样做可以保护你的定制getter和setter不受底层模型实现的变化.

验证
模型验证允许你为模型的每个属性指定格式/内容/继承验证.

验证会自动运行在 create , update 和 save 上. 你也可以调用 validate() 手动验证一个实例.

属性验证器
你可以自定义验证器或使用由validator.js实现的几个内置验证器,如下所示.

class ValidateMe extends Model {}
ValidateMe.init({
  bar: {
    type: Sequelize.STRING,
    validate: {
      is: ["^[a-z]+$",'i'],     // 只允许字母
      is: /^[a-z]+$/i,          // 与上一个示例相同,使用了真正的正则表达式
      not: ["[a-z]",'i'],       // 不允许字母
      isEmail: true,            // 检查邮件格式 (foo@bar.com)
      isUrl: true,              // 检查连接格式 (http://foo.com)
      isIP: true,               // 检查 IPv4 (129.89.23.1) 或 IPv6 格式
      isIPv4: true,             // 检查 IPv4 (129.89.23.1) 格式
      isIPv6: true,             // 检查 IPv6 格式
      isAlpha: true,            // 只允许字母
      isAlphanumeric: true,     // 只允许使用字母数字
      isNumeric: true,          // 只允许数字
      isInt: true,              // 检查是否为有效整数
      isFloat: true,            // 检查是否为有效浮点数
      isDecimal: true,          // 检查是否为任意数字
      isLowercase: true,        // 检查是否为小写
      isUppercase: true,        // 检查是否为大写
      notNull: true,            // 不允许为空
      isNull: true,             // 只允许为空
      notEmpty: true,           // 不允许空字符串
      equals: 'specific value', // 只允许一个特定值
      contains: 'foo',          // 检查是否包含特定的子字符串
      notIn: [['foo', 'bar']],  // 检查是否值不是其中之一
      isIn: [['foo', 'bar']],   // 检查是否值是其中之一
      notContains: 'bar',       // 不允许包含特定的子字符串
      len: [2,10],              // 只允许长度在2到10之间的值
      isUUID: 4,                // 只允许uuids
      isDate: true,             // 只允许日期字符串
      isAfter: "2011-11-05",    // 只允许在特定日期之后的日期字符串
      isBefore: "2011-11-05",   // 只允许在特定日期之前的日期字符串
      max: 23,                  // 只允许值 <= 23
      min: 23,                  // 只允许值 >= 23
      isCreditCard: true,       // 检查有效的信用卡号码

      // 自定义验证器的示例:
      isEven(value) {
        if (parseInt(value) % 2 !== 0) {
          throw new Error('Only even values are allowed!');
        }
      }
      isGreaterThanOtherField(value) {
        if (parseInt(value) <= parseInt(this.otherField)) {
          throw new Error('Bar must be greater than otherField.');
        }
      }
    }
  }
}, { sequelize });
请注意,如果需要将多个参数传递给内置的验证函数,则要传递的参数必须位于数组中. 但是,如果要传递单个数组参数,例如isIn的可接受字符串数组,则将被解释为多个字符串参数,而不是一个数组参数. 要解决这个问题,传递一个单一长度的参数数组,比如[['one','two']].

要使用自定义错误消息而不是 validator.js 提供的错误消息,请使用对象而不是纯值或参数数组,例如不需要参数的验证器可以被给定自定义消息:

isInt: {
  msg: "Must be an integer number of pennies"
}
或者如果还需要传递参数,请添加一个 args 属性:

isIn: {
  args: [['en', 'zh']],
  msg: "Must be English or Chinese"
}
当使用自定义验证器函数时,错误消息将是抛出的 Error 对象所持有的任何消息.

有关内置验证方法的更多详细信息,请参阅 validator.js project .

*提示: *你还可以为日志记录部分定义自定义函数. 只是传递一个方法. 第一个参数将是记录的字符串.

属性验证器 与 allowNull
如果模型的特定字段设置为不允许null(使用allowNull:false)并且该值已设置为 null,则将跳过所有验证器并抛出 ValidationError.

另一方面,如果将其设置为允许null(使用 allowNull:true)并且该值已设置为 null,则只会跳过内置验证器,而自定义验证器仍将运行.

例如,这意味着你可以使用一个字符串字段来验证其长度在5到10个字符之间,但也允许 null(因为当值为 null 时,将自动跳过长度验证器):

class User extends Model {}
User.init({
  username: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: {
      len: [5, 10]
    }
  }
}, { sequelize });
你还可以使用自定义验证器有条件地允许 null 值,因为它不会被跳过:

class User extends Model {}
User.init({
  age: Sequelize.INTEGER,
  name: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: {
      customValidator(value) {
        if (value === null && this.age !== 10) {
          throw new Error("name can't be null unless age is 10");
        }
      })
    }
  }
}, { sequelize });
你可以通过设置 notNull 验证器来自定义 allowNull 错误消息:

class User extends Model {}
User.init({
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter your name'
      }
    }
  }
}, { sequelize });
模型范围验证
验证器也可以在特定字段验证器之后用来定义检查模型.例如,你可以确保纬度和经度都不设置,或者两者都设置,如果设置了一个而另一个未设置则验证失败.

模型验证器方法与模型对象的上下文一起调用,如果它们抛出错误,则认为失败,否则通过. 这与自定义字段特定的验证器一样.

所收集的任何错误消息都将与验证结果对象一起放在字段验证错误中,这个错误使用在validate参数对象中以失败的验证方法的键来命名.即便在任何一个时刻,每个模型验证方法只能有一个错误消息,它会在数组中显示为单个字符串错误,以最大化与字段错误的一致性.

一个例子:

class Pub extends Model {}
Pub.init({
  name: { type: Sequelize.STRING },
  address: { type: Sequelize.STRING },
  latitude: {
    type: Sequelize.INTEGER,
    allowNull: true,
    defaultValue: null,
    validate: { min: -90, max: 90 }
  },
  longitude: {
    type: Sequelize.INTEGER,
    allowNull: true,
    defaultValue: null,
    validate: { min: -180, max: 180 }
  },
}, {
  validate: {
    bothCoordsOrNone() {
      if ((this.latitude === null) !== (this.longitude === null)) {
        throw new Error('Require either both latitude and longitude or neither')
      }
    }
  },
  sequelize,
})
在这种简单情况下,如果给定纬度或经度,而不是同时包含两者,则验证失败. 如果我们尝试构建一个超范围的纬度和经度,那么raging_bullock_arms.validate()可能会返回

{
  'latitude': ['Invalid number: latitude'],
  'bothCoordsOrNone': ['Require either both latitude and longitude or neither']
}
这样的验证也可以通过在单个属性上定义的自定义验证器(例如latitude属性,通过检查(value === null) !== (this.longitude === null))来完成, 但模型范围的验证方法更清晰.


配置
你还可以修改 Sequelize 处理列名称的方式:

class Bar extends Model {}
Bar.init({ /* bla */ }, {
  // 模型的名称. 该模型将以此名称存储在`sequelize.models`中.
  // 在这种情况下,默认为类名,即Bar. 
  // 这将控制自动生成的foreignKey和关联命名的名称
  modelName: 'bar',
  // 不添加时间戳属性 (updatedAt, createdAt)
  timestamps: false,

  // 不删除数据库条目,但将新添加的属性deletedAt设置为当前日期(删除完成时). 
  // paranoid 只有在启用时间戳时才能工作
  paranoid: true,

  // 将自动设置所有属性的字段参数为下划线命名方式.
  // 不会覆盖已经定义的字段选项
  underscored: true,

  // 禁用修改表名; 默认情况下,sequelize将自动将所有传递的模型名称(define的第一个参数)转换为复数. 如果你不想这样,请设置以下内容
  freezeTableName: true,

  // 定义表的名称
  tableName: 'my_very_custom_table_name',

  // 启用乐观锁定. 启用时,sequelize将向模型添加版本计数属性,
  // 并在保存过时的实例时引发OptimisticLockingError错误.
  // 设置为true或具有要用于启用的属性名称的字符串.
    version: true,

  // Sequelize 实例
  sequelize,
})
如果你希望sequelize处理时间戳,但只想要其中一部分,或者希望你的时间戳被称为别的东西,则可以单独覆盖每个列:

class Foo extends Model {}
Foo.init({ /* bla */ }, {
  // 不要忘记启用时间戳！
  timestamps: true,

  // 我不想要 createdAt
  createdAt: false,

  // 我想 updateAt 实际上被称为 updateTimestamp
  updatedAt: 'updateTimestamp',

  // 并且希望 deletedA t被称为 destroyTime(请记住启用paranoid以使其工作)
  deletedAt: 'destroyTime',
  paranoid: true,

  sequelize,
})
你也可以更改数据库引擎,例如 变更到到MyISAM, 默认值是InnoDB.

class Person extends Model {}
Person.init({ /* attributes */ }, {
  engine: 'MYISAM',
  sequelize
})

// 或全局的
const sequelize = new Sequelize(db, user, pw, {
  define: { engine: 'MYISAM' }
})
最后,你可以为MySQL和PG中的表指定注释

class Person extends Model {}
Person.init({ /* attributes */ }, {
  comment: "我是一个表注释!",
  sequelize
})
导入
你还可以使用import方法将模型定义存储在单个文件中. 返回的对象与导入文件的功能中定义的完全相同. 由于Sequelizev1:5.0的导入是被缓存的,所以当调用文件导入两次或更多次时,不会遇到问题.

// 在你的服务器文件中 - 例如 app.js
const Project = sequelize.import(__dirname + "/path/to/models/project")

// 模型已经在 /path/to/models/project.js 中定义好
// 你可能会注意到,DataTypes与上述相同
module.exports = (sequelize, DataTypes) => {
  class Project extends sequelize.Model { }
  Project.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT
  }, { sequelize });
  return Project;
}
import方法也可以接受回调作为参数.

sequelize.import('project', (sequelize, DataTypes) => {
  class Project extends sequelize.Model {}
  Project.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT
  }, { sequelize })
  return Project;
})
这个额外的功能也是有用的, 例如 Error: Cannot find module 被抛出,即使 /path/to/models/project 看起来是正确的. 一些框架,如 Meteor,重载 require,并给出“惊喜”的结果,如:

Error: Cannot find module '/home/you/meteorApp/.meteor/local/build/programs/server/app/path/to/models/project.js'
这通过传入Meteor的require版本来解决. 所以,虽然这可能会失败 ...

const AuthorModel = db.import('./path/to/models/project');
... 这应该是成功的 ...

const AuthorModel = db.import('project', require('./path/to/models/project'));
乐观锁定
Sequelize 内置支持通过模型实例版本计数的乐观锁定.

默认情况下禁用乐观锁定,可以通过在特定模型定义或全局模型配置中将version属性设置为true来启用. 有关详细信息,请参阅模型配置.

乐观锁定允许并发访问模型记录以进行编辑,并防止冲突覆盖数据. 它通过检查另一个进程是否已经读取记录而进行更改,并在检测到冲突时抛出一个OptimisticLockError.

数据库同步
当开始一个新的项目时,你还不会有一个数据库结构,并且使用Sequelize你也不需要它. 只需指定你的模型结构,并让库完成其余操作. 目前支持的是创建和删除表:

// 创建表:
Project.sync()
Task.sync()

// 强制创建!
Project.sync({force: true}) // 这将先丢弃表,然后重新创建它

// 删除表:
Project.drop()
Task.drop()

// 事件处理:
Project.[sync|drop]().then(() => {
  // 好吧...一切都很好！
}).catch(error => {
  // oooh,你输入了错误的数据库凭据？
})
因为同步和删除所有的表可能要写很多行,你也可以让Sequelize来为做这些:

// 同步所有尚未在数据库中的模型
sequelize.sync()

// 强制同步所有模型
sequelize.sync({force: true})

// 删除所有表
sequelize.drop()

// 广播处理:
sequelize.[sync|drop]().then(() => {
  // woot woot
}).catch(error => {
  // whooops
})
因为.sync({ force: true })是具有破坏性的操作,可以使用match参数作为附加的安全检查.

match参数可以通知Sequelize,以便在同步之前匹配正则表达式与数据库名称 - 在测试中使用force:true但不使用实时代码的情况下的安全检查.

// 只有当数据库名称以'_test'结尾时,才会运行.sync()
sequelize.sync({ force: true, match: /_test$/ });
扩展模型
Sequelize 模型是ES6类. 你可以轻松添加自定义实例或类级别的方法.

class User extends Model {
  // 添加一个类级别的方法
  static classLevelMethod() {
    return 'foo';
  }

  // 添加实例级别方法
  instanceLevelMethod() {
    return 'bar';
  }
}
User.init({ firstname: Sequelize.STRING }, { sequelize });
当然,你还可以访问实例的数据并生成虚拟的getter:

class User extends Model {
  getFullname() {
    return [this.firstname, this.lastname].join(' ');
  }
}
User.init({ firstname: Sequelize.STRING, lastname: Sequelize.STRING }, { sequelize });

// 示例:
User.build({ firstname: 'foo', lastname: 'bar' }).getFullname() // 'foo bar'
索引
Sequelize支持在 Model.sync() 或 sequelize.sync 中创建的模型定义中添加索引.

class User extends Model {}
User.init({}, {
  indexes: [
    // 在 email 上创建一个唯一索引
    {
      unique: true,
      fields: ['email']
    },

    // 在使用 jsonb_path_ops 的 operator 数据上创建一个 gin 索引
    {
      fields: ['data'],
      using: 'gin',
      operator: 'jsonb_path_ops'
    },

    // 默认的索引名将是 [table]_[fields]
    // 创建多列局部索引
    {
      name: 'public_by_author',
      fields: ['author', 'status'],
      where: {
        status: 'public'
      }
    },

    // 具有有序字段的BTREE索引
    {
      name: 'title_index',
      method: 'BTREE',
      fields: ['author', {attribute: 'title', collate: 'en_US', order: 'DESC', length: 5}]
    }
  ],
  sequelize
});

数据检索/查找器
Finder 方法旨在从数据库查询数据. 他们 不 返回简单的对象,而是返回模型实例. 因为 finder 方法返回模型实例,你可以按照 实例 的文档中所述,为结果调用任何模型实例成员.

在本文中,我们将探讨 finder 方法可以做什么:

find - 搜索数据库中的一个特定元素
// 搜索已知的ids
Project.findByPk(123).then(project => {
  // project 将是 Project的一个实例,并具有在表中存为 id 123 条目的内容.
  // 如果没有定义这样的条目,你将获得null
})

// 搜索属性
Project.findOne({ where: {title: 'aProject'} }).then(project => {
  // project 将是 Projects 表中 title 为 'aProject'  的第一个条目 || null
})


Project.findOne({
  where: {title: 'aProject'},
  attributes: ['id', ['name', 'title']]
}).then(project => {
  // project 将是 Projects 表中 title 为 'aProject'  的第一个条目 || null
  // project.get('title') 将包含 project 的 name
})
findOrCreate - 搜索特定元素或创建它(如果不可用)
方法 findOrCreate 可用于检查数据库中是否已存在某个元素. 如果是这种情况,则该方法将生成相应的实例. 如果元素不存在,将会被创建.

如果是这种情况,则该方法将导致相应的实例. 如果元素不存在,将会被创建.

假设我们有一个空的数据库,一个 User 模型有一个 username 和 job.

User
  .findOrCreate({where: {username: 'sdepold'}, defaults: {job: 'Technical Lead JavaScript'}})
  . then(([user, created]) => {
    console.log(user.get({
      plain: true
    }))
    console.log(created)

    /*
    findOrCreate 返回一个包含已找到或创建的对象的数组,找到或创建的对象和一个布尔值,如果创建一个新对象将为true,否则为false,像这样:

    [ {
        username: 'sdepold',
        job: 'Technical Lead JavaScript',
        id: 1,
        createdAt: Fri Mar 22 2013 21: 28: 34 GMT + 0100(CET),
        updatedAt: Fri Mar 22 2013 21: 28: 34 GMT + 0100(CET)
      },
      true ]

在上面的例子中,第三行的数组将分成2部分,并将它们作为参数传递给回调函数,在这种情况下将它们视为 "user" 和 "created" .(所以“user”将是返回数组的索引0的对象,并且 "created" 将等于 "true".)
    */
  })
代码创建了一个新的实例. 所以当我们已经有一个实例了 ...

User.create({ username: 'fnord', job: 'omnomnom' })
  .then(() => User.findOrCreate({where: {username: 'fnord'}, defaults: {job: 'something else'}}))
  .then(([user, created]) => {
    console.log(user.get({
      plain: true
    }))
    console.log(created)

    /*
    在这个例子中,findOrCreate 返回一个如下的数组:
    [ {
        username: 'fnord',
        job: 'omnomnom',
        id: 2,
        createdAt: Fri Mar 22 2013 21: 28: 34 GMT + 0100(CET),
        updatedAt: Fri Mar 22 2013 21: 28: 34 GMT + 0100(CET)
      },
      false
    ]
    由findOrCreate返回的数组通过第三行的数组扩展为两部分,并且这些部分将作为2个参数传递给回调函数,在这种情况下将其视为 "user" 和 "created" .(所以“user”将是返回数组的索引0的对象,并且 "created" 将等于 "false".)
    */
  })
...现有条目将不会更改. 看到第二个用户的 "job",并且实际上创建操作是假的.

findAndCountAll - 在数据库中搜索多个元素,返回数据和总计数
这是一个方便的方法,它结合了 findAll 和 count(见下文),当处理与分页相关的查询时,这是有用的,你想用 limit 和 offset 检索数据,但也需要知道总数与查询匹配的记录数:

处理程序成功将始终接收具有两个属性的对象:

count - 一个整数,总数记录匹配where语句和关联的其它过滤器
rows - 一个数组对象,记录在limit和offset范围内匹配where语句和关联的其它过滤器,
Project
  .findAndCountAll({
     where: {
        title: {
          [Op.like]: 'foo%'
        }
     },
     offset: 10,
     limit: 2
  })
  .then(result => {
    console.log(result.count);
    console.log(result.rows);
  });
它支持 include. 只有标记为 required 的 include 将被添加到计数部分:

假设你想查找附有个人资料的所有用户:

User.findAndCountAll({
  include: [
     { model: Profile, required: true}
  ],
  limit: 3
});
因为 Profile 的 include 有 required 设置,这将导致内部连接,并且只有具有 profile 的用户将被计数. 如果我们从 include 中删除required,那么有和没有 profile 的用户都将被计数. 在include中添加一个 where 语句会自动使它成为 required:

User.findAndCountAll({
  include: [
     { model: Profile, where: { active: true }}
  ],
  limit: 3
});
上面的查询只会对具有 active profile 的用户进行计数,因为在将 where 语句添加到 include 时,required 被隐式设置为 true.

传递给 findAndCountAll 的 options 对象与 findAll 相同(如下所述).

findAll - 搜索数据库中的多个元素
// 找到多个条目
Project.findAll().then(projects => {
  // projects 将是所有 Project 实例的数组
})

// 搜索特定属性 - 使用哈希
Project.findAll({ where: { name: 'A Project' } }).then(projects => {
  // projects将是一个具有指定 name 的 Project 实例数组
})

// 在特定范围内进行搜索
Project.findAll({ where: { id: [1,2,3] } }).then(projects => {
  // projects将是一系列具有 id 1,2 或 3 的项目
  // 这实际上是在做一个 IN 查询
})

Project.findAll({
  where: {
    id: {
      [Op.and]: {a: 5},           // 且 (a = 5)
      [Op.or]: [{a: 5}, {a: 6}],  // (a = 5 或 a = 6)
      [Op.gt]: 6,                // id > 6
      [Op.gte]: 6,               // id >= 6
      [Op.lt]: 10,               // id < 10
      [Op.lte]: 10,              // id <= 10
      [Op.ne]: 20,               // id != 20
      [Op.between]: [6, 10],     // 在 6 和 10 之间
      [Op.notBetween]: [11, 15], // 不在 11 和 15 之间
      [Op.in]: [1, 2],           // 在 [1, 2] 之中
      [Op.notIn]: [1, 2],        // 不在 [1, 2] 之中
      [Op.like]: '%hat',         // 包含 '%hat'
      [Op.notLike]: '%hat',       // 不包含 '%hat'
      [Op.iLike]: '%hat',         // 包含 '%hat' (不区分大小写)  (仅限 PG)
      [Op.notILike]: '%hat',      // 不包含 '%hat'  (仅限 PG)
      [Op.overlap]: [1, 2],       // && [1, 2] (PG数组重叠运算符)
      [Op.contains]: [1, 2],      // @> [1, 2] (PG数组包含运算符)
      [Op.contained]: [1, 2],     // <@ [1, 2] (PG数组包含于运算符)
      [Op.any]: [2,3],            // 任何数组[2, 3]::INTEGER (仅限 PG)
    },
    status: {
      [Op.not]: false,           // status 不为 FALSE
    }
  }
})
复合过滤 / OR / NOT 查询
你可以使用多层嵌套的 AND,OR 和 NOT 条件进行一个复合的 where 查询. 为了做到这一点,你可以使用 or , and 或 not 运算符:

Project.findOne({
  where: {
    name: 'a project',
    [Op.or]: [
      { id: [1,2,3] },
      { id: { [Op.gt]: 10 } }
    ]
  }
})

Project.findOne({
  where: {
    name: 'a project',
    id: {
      [Op.or]: [
        [1,2,3],
        { [Op.gt]: 10 }
      ]
    }
  }
})
这两段代码将生成以下内容:

SELECT *
FROM `Projects`
WHERE (
  `Projects`.`name` = 'a project'
   AND (`Projects`.`id` IN (1,2,3) OR `Projects`.`id` > 10)
)
LIMIT 1;
not 示例:

Project.findOne({
  where: {
    name: 'a project',
    [Op.not]: [
      { id: [1,2,3] },
      { array: { [Op.contains]: [3,4,5] } }
    ]
  }
});
将生成:

SELECT *
FROM `Projects`
WHERE (
  `Projects`.`name` = 'a project'
   AND NOT (`Projects`.`id` IN (1,2,3) OR `Projects`.`array` @> ARRAY[3,4,5]::INTEGER[])
)
LIMIT 1;
用限制,偏移,顺序和分组操作数据集
要获取更多相关数据,可以使用限制,偏移,顺序和分组:

// 限制查询的结果
Project.findAll({ limit: 10 })

// 跳过前10个元素
Project.findAll({ offset: 10 })

// 跳过前10个元素,并获取2个
Project.findAll({ offset: 10, limit: 2 })
分组和排序的语法是相同的,所以下面只用一个单独的例子来解释分组,而其余的则是排序. 你下面看到的所有内容也可以对分组进行

Project.findAll({order: [['title', 'DESC']]})
// 生成 ORDER BY title DESC

Project.findAll({group: 'name'})
// 生成 GROUP BY name
请注意,在上述两个示例中,提供的字符串逐字插入到查询中,所以不会转义列名称. 当你向 order / group 提供字符串时,将始终如此. 如果要转义列名,你应该提供一个参数数组,即使你只想通过单个列进行 order / group

something.findOne({
  order: [
    // 将返回 `name`
    ['name'],
    // 将返回 `username` DESC
    ['username', 'DESC'],
    // 将返回 max(`age`)
    sequelize.fn('max', sequelize.col('age')),
    // 将返回 max(`age`) DESC
    [sequelize.fn('max', sequelize.col('age')), 'DESC'],
    // 将返回 otherfunction(`col1`, 12, 'lalala') DESC
    [sequelize.fn('otherfunction', sequelize.col('col1'), 12, 'lalala'), 'DESC'],
    // 将返回 otherfunction(awesomefunction(`col`)) DESC,这个嵌套是可以无限的！
    [sequelize.fn('otherfunction', sequelize.fn('awesomefunction', sequelize.col('col'))), 'DESC']
  ]
})
回顾一下,order / group数组的元素可以是以下内容:

String - 将被引用
Array - 第一个元素将被引用,第二个将被逐字地追加
Object -
raw 将被添加逐字引用
如果未设置 raw,一切都被忽略,查询将失败
Sequelize.fn 和 Sequelize.col 返回函数和引用的列名
原始查询
有时候,你可能会期待一个你想要显示的大量数据集,而无需操作. 对于你选择的每一行,Sequelize 创建一个具有更新,删除和获取关联等功能的实例.如果你有数千行,则可能需要一些时间. 如果你只需要原始数据,并且不想更新任何内容,你可以这样做来获取原始数据.

// 你期望从数据库的一个巨大的数据集,
// 并且不想花时间为每个条目构建DAO？
// 你可以传递一个额外的查询参数来取代原始数据:
Project.findAll({ where: { ... }, raw: true })
count - 计算数据库中元素的出现次数
还有一种数据库对象计数的方法:

Project.count().then(c => {
  console.log("There are " + c + " projects!")
})

Project.count({ where: {'id': {[Op.gt]: 25}} }).then(c => {
  console.log("There are " + c + " projects with an id greater than 25.")
})
max - 获取特定表中特定属性的最大值
这里是获取属性的最大值的方法:

/*
   我们假设3个具有属性年龄的对象.
   第一个是10岁,
   第二个是5岁,
   第三个是40岁.
*/
Project.max('age').then(max => {
  // 将返回 40
})

Project.max('age', { where: { age: { [Op.lt]: 20 } } }).then(max => {
  // 将会是 10
})
min - 获取特定表中特定属性的最小值
这里是获取属性的最小值的方法:

/*
   我们假设3个具有属性年龄的对象.
   第一个是10岁,
   第二个是5岁,
   第三个是40岁.
*/
Project.min('age').then(min => {
  // 将返回 5
})

Project.min('age', { where: { age: { [Op.gt]: 5 } } }).then(min => {
  // 将会是 10
})
sum - 特定属性的值求和
为了计算表的特定列的总和,可以使用“sum”方法.

/*
   我们假设3个具有属性年龄的对象.
   第一个是10岁,
   第二个是5岁,
   第三个是40岁.
*/
Project.sum('age').then(sum => {
  // 将返回 55
})

Project.sum('age', { where: { age: { [Op.gt]: 5 } } }).then(sum => {
  // 将会是 50
})
预加载
当你从数据库检索数据时,也想同时获得与之相关联的查询,这被称为预加载.这个基本思路就是当你调用 find 或 findAll 时使用 include 属性.让我们假设以下设置:

class User extends Model {}
User.init({ name: Sequelize.STRING }, { sequelize, modelName: 'user' })
class Task extends Model {}
Task.init({ name: Sequelize.STRING }, { sequelize, modelName: 'task' })
class Tool extends Model {}
Tool.init({ name: Sequelize.STRING }, { sequelize, modelName: 'tool' })

Task.belongsTo(User)
User.hasMany(Task)
User.hasMany(Tool, { as: 'Instruments' })

sequelize.sync().then(() => {
  // 这是我们继续的地方 ...
})
首先,让我们用它们的关联 user 加载所有的 task.

Task.findAll({ include: [ User ] }).then(tasks => {
  console.log(JSON.stringify(tasks))

  /*
    [{
      "name": "A Task",
      "id": 1,
      "createdAt": "2013-03-20T20:31:40.000Z",
      "updatedAt": "2013-03-20T20:31:40.000Z",
      "userId": 1,
      "user": {
        "name": "John Doe",
        "id": 1,
        "createdAt": "2013-03-20T20:31:45.000Z",
        "updatedAt": "2013-03-20T20:31:45.000Z"
      }
    }]
  */
})
请注意,访问者(结果实例中的 User 属性)是单数形式,因为关联是一对一的.

接下来的事情:用多对一的关联加载数据！

User.findAll({ include: [ Task ] }).then(users => {
  console.log(JSON.stringify(users))

  /*
    [{
      "name": "John Doe",
      "id": 1,
      "createdAt": "2013-03-20T20:31:45.000Z",
      "updatedAt": "2013-03-20T20:31:45.000Z",
      "tasks": [{
        "name": "A Task",
        "id": 1,
        "createdAt": "2013-03-20T20:31:40.000Z",
        "updatedAt": "2013-03-20T20:31:40.000Z",
        "userId": 1
      }]
    }]
  */
})
请注意,访问者(结果实例中的 Tasks 属性)是复数形式,因为关联是多对一的.

如果关联是别名的(使用 as 参数),则在包含模型时必须指定此别名. 注意用户的 Tool 如何被别名为 Instruments. 为了获得正确的权限,你必须指定要加载的模型以及别名:

User.findAll({ include: [{ model: Tool, as: 'Instruments' }] }).then(users => {
  console.log(JSON.stringify(users))

  /*
    [{
      "name": "John Doe",
      "id": 1,
      "createdAt": "2013-03-20T20:31:45.000Z",
      "updatedAt": "2013-03-20T20:31:45.000Z",
      "Instruments": [{
        "name": "Toothpick",
        "id": 1,
        "createdAt": null,
        "updatedAt": null,
        "userId": 1
      }]
    }]
  */
})
你还可以通过指定与关联别名匹配的字符串来包含别名:

User.findAll({ include: ['Instruments'] }).then(users => {
  console.log(JSON.stringify(users))

  /*
    [{
      "name": "John Doe",
      "id": 1,
      "createdAt": "2013-03-20T20:31:45.000Z",
      "updatedAt": "2013-03-20T20:31:45.000Z",
      "Instruments": [{
        "name": "Toothpick",
        "id": 1,
        "createdAt": null,
        "updatedAt": null,
        "userId": 1
      }]
    }]
  */
})

User.findAll({ include: [{ association: 'Instruments' }] }).then(users => {
  console.log(JSON.stringify(users))

  /*
    [{
      "name": "John Doe",
      "id": 1,
      "createdAt": "2013-03-20T20:31:45.000Z",
      "updatedAt": "2013-03-20T20:31:45.000Z",
      "Instruments": [{
        "name": "Toothpick",
        "id": 1,
        "createdAt": null,
        "updatedAt": null,
        "userId": 1
      }]
    }]
  */
})
当预加载时,我们也可以使用 where 过滤关联的模型. 这将返回 Tool 模型中所有与 where 语句匹配的行的User.

User.findAll({
    include: [{
        model: Tool,
        as: 'Instruments',
        where: { name: { [Op.like]: '%ooth%' } }
    }]
}).then(users => {
    console.log(JSON.stringify(users))

    /*
      [{
        "name": "John Doe",
        "id": 1,
        "createdAt": "2013-03-20T20:31:45.000Z",
        "updatedAt": "2013-03-20T20:31:45.000Z",
        "Instruments": [{
          "name": "Toothpick",
          "id": 1,
          "createdAt": null,
          "updatedAt": null,
          "userId": 1
        }]
      }],

      [{
        "name": "John Smith",
        "id": 2,
        "createdAt": "2013-03-20T20:31:45.000Z",
        "updatedAt": "2013-03-20T20:31:45.000Z",
        "Instruments": [{
          "name": "Toothpick",
          "id": 1,
          "createdAt": null,
          "updatedAt": null,
          "userId": 1
        }]
      }],
    */
  })
当使用 include.where 过滤一个预加载的模型时,include.required 被隐式设置为 true. 这意味着内部联接完成返回具有任何匹配子项的父模型.

使用预加载模型的顶层 WHERE
将模型的 WHERE 条件从 ON 条件的 include 模式移动到顶层,你可以使用 '$nested.column$' 语法:

User.findAll({
    where: {
        '$Instruments.name$': { [Op.iLike]: '%ooth%' }
    },
    include: [{
        model: Tool,
        as: 'Instruments'
    }]
}).then(users => {
    console.log(JSON.stringify(users));

    /*
      [{
        "name": "John Doe",
        "id": 1,
        "createdAt": "2013-03-20T20:31:45.000Z",
        "updatedAt": "2013-03-20T20:31:45.000Z",
        "Instruments": [{
          "name": "Toothpick",
          "id": 1,
          "createdAt": null,
          "updatedAt": null,
          "userId": 1
        }]
      }],

      [{
        "name": "John Smith",
        "id": 2,
        "createdAt": "2013-03-20T20:31:45.000Z",
        "updatedAt": "2013-03-20T20:31:45.000Z",
        "Instruments": [{
          "name": "Toothpick",
          "id": 1,
          "createdAt": null,
          "updatedAt": null,
          "userId": 1
        }]
      }],
    */
包括所有
要包含所有属性,你可以使用 all:true 传递单个对象:

User.findAll({ include: [{ all: true }]});
包括软删除的记录
如果想要加载软删除的记录,可以通过将 include.paranoid 设置为 false 来实现

User.findAll({
    include: [{
        model: Tool,
        where: { name: { [Op.like]: '%ooth%' } },
        paranoid: false // query and loads the soft deleted records
    }]
});
排序预加载关联
在一对多关系的情况下.

Company.findAll({ include: [ Division ], order: [ [ Division, 'name' ] ] });
Company.findAll({ include: [ Division ], order: [ [ Division, 'name', 'DESC' ] ] });
Company.findAll({
  include: [ { model: Division, as: 'Div' } ],
  order: [ [ { model: Division, as: 'Div' }, 'name' ] ]
});
Company.findAll({
  include: [ { model: Division, as: 'Div' } ],
  order: [ [ { model: Division, as: 'Div' }, 'name', 'DESC' ] ]
});
Company.findAll({
  include: [ { model: Division, include: [ Department ] } ],
  order: [ [ Division, Department, 'name' ] ]
});
在多对多关系的情况下,你还可以通过表中的属性进行排序.

Company.findAll({
  include: [ { model: Division, include: [ Department ] } ],
  order: [ [ Division, DepartmentDivision, 'name' ] ]
});
嵌套预加载
你可以使用嵌套的预加载来加载相关模型的所有相关模型:

User.findAll({
  include: [
    {model: Tool, as: 'Instruments', include: [
      {model: Teacher, include: [ /* etc */]}
    ]}
  ]
}).then(users => {
  console.log(JSON.stringify(users))

  /*
    [{
      "name": "John Doe",
      "id": 1,
      "createdAt": "2013-03-20T20:31:45.000Z",
      "updatedAt": "2013-03-20T20:31:45.000Z",
      "Instruments": [{ // 1:M and N:M association
        "name": "Toothpick",
        "id": 1,
        "createdAt": null,
        "updatedAt": null,
        "userId": 1,
        "Teacher": { // 1:1 association
          "name": "Jimi Hendrix"
        }
      }]
    }]
  */
})
这将产生一个外连接. 但是,相关模型上的 where 语句将创建一个内部连接,并仅返回具有匹配子模型的实例. 要返回所有父实例,你应该添加 required: false.

User.findAll({
  include: [{
    model: Tool,
    as: 'Instruments',
    include: [{
      model: Teacher,
      where: {
        school: "Woodstock Music School"
      },
      required: false
    }]
  }]
}).then(users => {
  /* ... */
})
以上查询将返回所有用户及其所有乐器,但只会返回与 Woodstock Music School 相关的老师.

包括所有也支持嵌套加载:

User.findAll({ include: [{ all: true, nested: true }]});

Hook(也称为生命周期事件)是执行 sequelize 调用之前和之后调用的函数. 例如,如果要在保存模型之前始终设置值,可以添加一个 beforeUpdate hook.

获取完整列表, 请查看 Hooks file.

操作清单
(1)
  beforeBulkCreate(instances, options)
  beforeBulkDestroy(options)
  beforeBulkUpdate(options)
(2)
  beforeValidate(instance, options)
(-)
  validate
(3)
  afterValidate(instance, options)
  - or -
  validationFailed(instance, options, error)
(4)
  beforeCreate(instance, options)
  beforeDestroy(instance, options)
  beforeUpdate(instance, options)
  beforeSave(instance, options)
  beforeUpsert(values, options)
(-)
  create
  destroy
  update
(5)
  afterCreate(instance, options)
  afterDestroy(instance, options)
  afterUpdate(instance, options)
  afterSave(instance, options)
  afterUpsert(created, options)
(6)
  afterBulkCreate(instances, options)
  afterBulkDestroy(options)
  afterBulkUpdate(options)
声明 Hook
Hook 的参数通过引用传递. 这意味着你可以更改值,这将反映在insert / update语句中. Hook 可能包含异步动作 - 在这种情况下,Hook 函数应该返回一个 promise.

目前有三种以编程方式添加 hook 的方法:

// 方法1 通过 .init() 方法
class User extends Model {}
User.init({
  username: DataTypes.STRING,
  mood: {
    type: DataTypes.ENUM,
    values: ['happy', 'sad', 'neutral']
  }
}, {
  hooks: {
    beforeValidate: (user, options) => {
      user.mood = 'happy';
    },
    afterValidate: (user, options) => {
      user.username = 'Toni';
    }
  },
  sequelize
});

// 方法2 通过 .addHook() 方法
User.addHook('beforeValidate', (user, options) => {
  user.mood = 'happy';
});

User.addHook('afterValidate', 'someCustomName', (user, options) => {
  return Promise.reject(new Error("I'm afraid I can't let you do that!"));
});

// 方法3 通过直接方法
User.beforeCreate((user, options) => {
  return hashPassword(user.password).then(hashedPw => {
    user.password = hashedPw;
  });
});

User.afterValidate('myHookAfter', (user, options) => {
  user.username = 'Toni';
});
移除 Hook
只能删除有名称参数的 hook.

class Book extends Model {}
Book.init({
  title: DataTypes.STRING
}, { sequelize });

Book.addHook('afterCreate', 'notifyUsers', (book, options) => {
  // ...
});

Book.removeHook('afterCreate', 'notifyUsers');
你可以有很多同名的 hook. 调用 .removeHook() 将会删除它们.

全局 / 通用 Hook
全局 hook 是所有模型的 hook. 他们可以定义你想要的所有模型的行为,并且对插件特别有用. 它们可以用两种方式来定义,它们的语义略有不同:

默认 Hook (Sequelize.options.define)
const sequelize = new Sequelize(..., {
    define: {
        hooks: {
            beforeCreate: () => {
                // 做些什么
            }
        }
    }
});
这将为所有模型添加一个默认 hook,如果模型没有定义自己的 beforeCreate hook,那么它将运行.

class User extends Model {}
User.init({}, { sequelize });
class Project extends Model {}
Project.init({}, {
    hooks: {
        beforeCreate: () => {
            // 做些其它什么
        }
    },
    sequelize
});

User.create() // 运行全局 hook
Project.create() // 运行其自身的 hook (因为全局 hook 被覆盖)
常驻 Hook (Sequelize.addHook)
sequelize.addHook('beforeCreate', () => {
    // 做些什么
});
这个 hook 总是在创建之前运行,无论模型是否指定了自己的 beforeCreate hook.本地 hook 总是在全局 hook 之前运行::

class User extends Model {}
User.init({}, { sequelize });
class Project extends Model {}
Project.init({}, {
    hooks: {
        beforeCreate: () => {
            // 做些其它什么
        }
    },
    sequelize
});

User.create() // 运行全局 hook
Project.create() //运行其自己的 hook 之后运行全局 hook
本地 hook 总是在全局 hook 之前运行.

常驻 hook 也可以在 Sequelize.options 中定义:

new Sequelize(..., {
    hooks: {
        beforeCreate: () => {
            // 做点什么
        }
    }
});
连接 Hook
Sequelize 提供了两个在获取数据库连接之前和之后立即执行的 hook:

beforeConnect(config)
afterConnect(connection, config)
如果需要异步获取数据库凭据,或者需要在创建后直接访问低级数据库连接,这些 hook 非常有用.

例如,我们可以从轮转令牌存储中异步获取数据库密码,并使用新凭据改变 Sequelize 的配置对象:

sequelize.beforeConnect((config) => {
    return getAuthToken()
        .then((token) => {
             config.password = token;
         });
    });
这些 hook 只能 声明为永久全局挂钩,因为连接池由所有模型共享.

实例 Hook
当你编辑单个对象时,以下 hook 将触发

beforeValidate
afterValidate or validationFailed
beforeCreate / beforeUpdate / beforeSave  / beforeDestroy
afterCreate / afterUpdate / afterSave / afterDestroy
// ...定义 ...
User.beforeCreate(user => {
  if (user.accessLevel > 10 && user.username !== "Boss") {
    throw new Error("你不能授予该用户10级以上的访问级别！")
  }
})
此示例将返回错误:

User.create({username: 'Not a Boss', accessLevel: 20}).catch(err => {
  console.log(err); // 你不能授予该用户 10 级以上的访问级别！
});
以下示例将返回成功:

User.create({username: 'Boss', accessLevel: 20}).then(user => {
  console.log(user); // 用户名为 Boss 和 accessLevel 为 20 的用户对象
});
模型 Hook
有时,你将一次编辑多个记录,方法是使用模型上的 bulkCreate, update, destroy 方法. 当你使用以下方法之一时,将会触发以下内容:

beforeBulkCreate(instances, options)
beforeBulkUpdate(options)
beforeBulkDestroy(options)
afterBulkCreate(instances, options)
afterBulkUpdate(options)
afterBulkDestroy(options)
如果要为每个单独的记录触发 hook,连同批量 hook,你可以将 personalHooks:true 传递给调用.

警告: 如果你使用单独的 hook,在你的hook被调用之前,所有被更新或销毁的实例都会被加载到内存中. Sequelize可以处理各个 hook 的实例数量受可用内存的限制.

Model.destroy({ where: {accessLevel: 0}, individualHooks: true});
// 将选择要删除的所有记录,并在每个实例删除之前 + 之后触发

Model.update({username: 'Toni'}, { where: {accessLevel: 0}, individualHooks: true});
// 将选择要更新的所有记录,并在每个实例更新之前 + 之后触发
Hook 方法的 options 参数将是提供给相应方法或其克隆和扩展版本的第二个参数.

Model.beforeBulkCreate((records, {fields}) => {
  // records = 第一个参数发送到 .bulkCreate
  // fields = 第二个参数字段之一发送到 .bulkCreate
  })

Model.bulkCreate([
    {username: 'Toni'}, // 部分记录参数
    {username: 'Tobi'} // 部分记录参数
  ], {fields: ['username']} // 选项参数
)

Model.beforeBulkUpdate(({attributes, where}) => {
  // where - 第二个参数的克隆的字段之一发送到 .update
  // attributes - .update 的第二个参数的克隆的字段之一被用于扩展
})

Model.update({gender: 'Male'} /*属性参数*/, { where: {username: 'Tom'}} /*where 参数*/)

Model.beforeBulkDestroy(({where, individualHooks}) => {
  // individualHooks - 第二个参数被扩展的克隆被覆盖的默认值发送到 Model.destroy
  // where - 第二个参数的克隆的字段之一发送到 Model.destroy
})

Model.destroy({ where: {username: 'Tom'}} /*where 参数*/)
如果用 updates.OnDuplicate 参数使用 Model.bulkCreate(...) ,那么 hook 中对 updateOnDuplicate 数组中没有给出的字段所做的更改将不会被持久保留到数据库. 但是,如果这是你想要的,则可以更改 hook 中的 updateOnDuplicate 选项.

// 使用 updatesOnDuplicate 选项批量更新现有用户
Users.bulkCreate([
  { id: 1, isMember: true },
  { id: 2, isMember: false }
], {
  updateOnDuplicate: ['isMember']
});

User.beforeBulkCreate((users, options) => {
  for (const user of users) {
    if (user.isMember) {
      user.memberSince = new Date();
    }
  }

  // 添加 memberSince 到 updateOnDuplicate 否则 memberSince 期将不会被保存到数据库
  options.updateOnDuplicate.push('memberSince');
});
关联
在大多数情况下,hook 对于相关联的实例而言将是一样的,除了几件事情之外.

当使用 add/set 函数时,将运行 beforeUpdate/afterUpdate hook.
调用 beforeDestroy/afterDestroy hook 的唯一方法是与 onDelete:'cascade 和参数 hooks:true 相关联. 例如:
class Projects extends Model {}
Projects.init({
  title: DataTypes.STRING
}, { sequelize });

class Tasks extends Model {}
Tasks.init({
  title: DataTypes.STRING
}, { sequelize });

Projects.hasMany(Tasks, { onDelete: 'cascade', hooks: true });
Tasks.belongsTo(Projects);
该代码将在Tasks表上运行beforeDestroy / afterDestroy. 默认情况下,Sequelize会尝试尽可能优化你的查询. 在删除时调用级联,Sequelize将简单地执行一个

DELETE FROM `table` WHERE associatedIdentifier = associatedIdentifier.primaryKey
然而,添加 hooks: true 会明确告诉 Sequelize,优化不是你所关心的,并且会在关联的对象上执行一个 SELECT,并逐个删除每个实例,以便能够使用正确的参数调用 hook.

如果你的关联类型为 n:m,则在使用 remove 调用时,你可能有兴趣在直通模型上触发 hook. 在内部,sequelize 使用 Model.destroy,致使在每个实例上调用 bulkDestroy 而不是 before / afterDestroy hook.

这可以通过将 {individualHooks:true} 传递给 remove 调用来简单地解决,从而导致每个 hook 都通过实例对象被删除.

关于事务的注意事项
请注意,Sequelize 中的许多模型操作允许你在方法的 options 参数中指定事务. 如果在原始调用中 指定 了一个事务,它将出现在传递给 hook 函数的 options 参数中. 例如,请参考以下代码段:

// 这里我们使用异步 hook 的 promise 风格,而不是回调.
User.addHook('afterCreate', (user, options) => {
  // 'transaction' 将在 options.transaction 中可用

  // 此操作将成为与原始 User.create 调用相同的事务的一部分.
  return User.update({
    mood: 'sad'
  }, {
    where: {
      id: user.id
    },
    transaction: options.transaction
  });
});


sequelize.transaction(transaction => {
  User.create({
    username: 'someguy',
    mood: 'happy',
    transaction
  });
});
如果我们在上述代码中的 User.update 调用中未包含事务选项,则不会发生任何更改,因为在已提交挂起的事务之前,我们新创建的用户不存在于数据库中.

内部事务
要认识到 sequelize 可能会在某些操作(如 Model.findOrCreate)内部使用事务是非常重要的. 如果你的 hook 函数执行依赖对象在数据库中存在的读取或写入操作,或者修改对象的存储值,就像上一节中的例子一样,你应该总是指定 { transaction: options.transaction }.

如果在处理操作的过程中已经调用了该 hook ,则这将确保你的依赖读/写是同一事务的一部分. 如果 hook 没有被处理,你只需要指定{ transaction: null } 并且可以预期默认行为.
属性
想要只选择某些属性,可以使用 attributes 选项. 通常是传递一个数组:

Model.findAll({
  attributes: ['foo', 'bar']
});
SELECT foo, bar ...
属性可以使用嵌套数组来重命名:

Model.findAll({
  attributes: ['foo', ['bar', 'baz']]
});
SELECT foo, bar AS baz ...
也可以使用 sequelize.fn 来进行聚合:

Model.findAll({
  attributes: [[sequelize.fn('COUNT', sequelize.col('hats')), 'no_hats']]
});
SELECT COUNT(hats) AS no_hats ...
使用聚合功能时,必须给它一个别名,以便能够从模型中访问它. 在上面的例子中,你可以使用 instance.get('no_hats') 获得帽子数量.

有时,如果你只想添加聚合,则列出模型的所有属性可能令人厌烦:

// This is a tiresome way of getting the number of hats...
Model.findAll({
  attributes: ['id', 'foo', 'bar', 'baz', 'quz', [sequelize.fn('COUNT', sequelize.col('hats')), 'no_hats']]
});

// This is shorter, and less error prone because it still works if you add / remove attributes
Model.findAll({
  attributes: { include: [[sequelize.fn('COUNT', sequelize.col('hats')), 'no_hats']] }
});
SELECT id, foo, bar, baz, quz, COUNT(hats) AS no_hats ...
同样,它也可以排除一些指定的表字段:

Model.findAll({
  attributes: { exclude: ['baz'] }
});
SELECT id, foo, bar, quz ...
Where
无论你是通过 findAll/find 或批量 updates/destroys 进行查询,都可以传递一个 where 对象来过滤查询.

where 通常用 attribute:value 键值对获取一个对象,其中 value 可以是匹配等式的数据或其他运算符的键值对象.

也可以通过嵌套 or 和 and 运算符 的集合来生成复杂的 AND/OR 条件.

基础
const Op = Sequelize.Op;

Post.findAll({
  where: {
    authorId: 2
  }
});
// SELECT * FROM post WHERE authorId = 2

Post.findAll({
  where: {
    authorId: 12,
    status: 'active'
  }
});
// SELECT * FROM post WHERE authorId = 12 AND status = 'active';

Post.findAll({
  where: {
    [Op.or]: [{authorId: 12}, {authorId: 13}]
  }
});
// SELECT * FROM post WHERE authorId = 12 OR authorId = 13;

Post.findAll({
  where: {
    authorId: {
      [Op.or]: [12, 13]
    }
  }
});
// SELECT * FROM post WHERE authorId = 12 OR authorId = 13;

Post.destroy({
  where: {
    status: 'inactive'
  }
});
// DELETE FROM post WHERE status = 'inactive';

Post.update({
  updatedAt: null,
}, {
  where: {
    deletedAt: {
      [Op.ne]: null
    }
  }
});
// UPDATE post SET updatedAt = null WHERE deletedAt NOT NULL;

Post.findAll({
  where: sequelize.where(sequelize.fn('char_length', sequelize.col('status')), 6)
});
// SELECT * FROM post WHERE char_length(status) = 6;
操作符
Sequelize 可用于创建更复杂比较的符号运算符 -

const Op = Sequelize.Op

[Op.and]: {a: 5}           // 且 (a = 5)
[Op.or]: [{a: 5}, {a: 6}]  // (a = 5 或 a = 6)
[Op.gt]: 6,                // id > 6
[Op.gte]: 6,               // id >= 6
[Op.lt]: 10,               // id < 10
[Op.lte]: 10,              // id <= 10
[Op.ne]: 20,               // id != 20
[Op.eq]: 3,                // = 3
[Op.not]: true,            // 不是 TRUE
[Op.between]: [6, 10],     // 在 6 和 10 之间
[Op.notBetween]: [11, 15], // 不在 11 和 15 之间
[Op.in]: [1, 2],           // 在 [1, 2] 之中
[Op.notIn]: [1, 2],        // 不在 [1, 2] 之中
[Op.like]: '%hat',         // 包含 '%hat'
[Op.notLike]: '%hat'       // 不包含 '%hat'
[Op.iLike]: '%hat'         // 包含 '%hat' (不区分大小写)  (仅限 PG)
[Op.notILike]: '%hat'      // 不包含 '%hat'  (仅限 PG)
[Op.startsWith]: 'hat'     // 类似 'hat%'
[Op.endsWith]: 'hat'       // 类似 '%hat'
[Op.substring]: 'hat'      // 类似 '%hat%'
[Op.regexp]: '^[h|a|t]'    // 匹配正则表达式/~ '^[h|a|t]' (仅限 MySQL/PG)
[Op.notRegexp]: '^[h|a|t]' // 不匹配正则表达式/!~ '^[h|a|t]' (仅限 MySQL/PG)
[Op.iRegexp]: '^[h|a|t]'    // ~* '^[h|a|t]' (仅限 PG)
[Op.notIRegexp]: '^[h|a|t]' // !~* '^[h|a|t]' (仅限 PG)
[Op.like]: { [Op.any]: ['cat', 'hat']} // 包含任何数组['cat', 'hat'] - 同样适用于 iLike 和 notLike
[Op.overlap]: [1, 2]       // && [1, 2] (PG数组重叠运算符)
[Op.contains]: [1, 2]      // @> [1, 2] (PG数组包含运算符)
[Op.contained]: [1, 2]     // <@ [1, 2] (PG数组包含于运算符)
[Op.any]: [2,3]            // 任何数组[2, 3]::INTEGER (仅限PG)

[Op.col]: 'user.organization_id' // = 'user'.'organization_id', 使用数据库语言特定的列标识符, 本例使用 PG
范围选项
所有操作符都支持支持的范围类型查询.

请记住,提供的范围值也可以定义绑定的 inclusion/exclusion.

// 所有上述相等和不相等的操作符加上以下内容:

[Op.contains]: 2           // @> '2'::integer (PG range contains element operator)
[Op.contains]: [1, 2]      // @> [1, 2) (PG range contains range operator)
[Op.contained]: [1, 2]     // <@ [1, 2) (PG range is contained by operator)
[Op.overlap]: [1, 2]       // && [1, 2) (PG range overlap (have points in common) operator)
[Op.adjacent]: [1, 2]      // -|- [1, 2) (PG range is adjacent to operator)
[Op.strictLeft]: [1, 2]    // << [1, 2) (PG range strictly left of operator)
[Op.strictRight]: [1, 2]   // >> [1, 2) (PG range strictly right of operator)
[Op.noExtendRight]: [1, 2] // &< [1, 2) (PG range does not extend to the right of operator)
[Op.noExtendLeft]: [1, 2]  // &> [1, 2) (PG range does not extend to the left of operator)
组合
{
  rank: {
    [Op.or]: {
      [Op.lt]: 1000,
      [Op.eq]: null
    }
  }
}
// rank < 1000 OR rank IS NULL

{
  createdAt: {
    [Op.lt]: new Date(),
    [Op.gt]: new Date(new Date() - 24 * 60 * 60 * 1000)
  }
}
// createdAt < [timestamp] AND createdAt > [timestamp]

{
  [Op.or]: [
    {
      title: {
        [Op.like]: 'Boat%'
      }
    },
    {
      description: {
        [Op.like]: '%boat%'
      }
    }
  ]
}
// title LIKE 'Boat%' OR description LIKE '%boat%'
运算符别名
Sequelize 允许将特定字符串设置为操作符的别名.使用v5,将为你提供弃用警告.

const Op = Sequelize.Op;
const operatorsAliases = {
  $gt: Op.gt
}
const connection = new Sequelize(db, user, pass, { operatorsAliases })

[Op.gt]: 6 // > 6
$gt: 6 // 等同于使用 Op.gt (> 6)
运算符安全性
默认情况下,Sequelize 将使用 Symbol 运算符. 使用没有任何别名的 Sequelize 可以提高安全性.没有任何字符串别名将使得运算符可能被注入的可能性降到极低,但你应该始终正确验证和清理用户输入.

一些框架会自动将用户输入解析为js对象,如果你无法清理输入,则可能会将带有字符串运算符的 Object 注入Sequelize.

为了更好的安全性,强烈建议在代码中使用 Sequelize.Op 中的符号运算符,如Op.and / Op.or,而不依赖于任何基于字符串的运算符,如 $and / $or. 你可以通过设置 operatorsAliases 参数来限制应用程序所需的别名,记住清理用户输入,特别是当你直接将它们传递给 Sequelize 方法时.

const Op = Sequelize.Op;

// 不用任何操作符别名使用 sequelize 
const connection = new Sequelize(db, user, pass, { operatorsAliases: false });

// 只用 $and => Op.and 操作符别名使用 sequelize 
const connection2 = new Sequelize(db, user, pass, { operatorsAliases: { $and: Op.and } });
如果你使用默认别名并且不限制它们,Sequelize会发出警告.如果你想继续使用所有默认别名(不包括旧版别名)而不发出警告,你可以传递以下运算符参数 -

const Op = Sequelize.Op;
const operatorsAliases = {
  $eq: Op.eq,
  $ne: Op.ne,
  $gte: Op.gte,
  $gt: Op.gt,
  $lte: Op.lte,
  $lt: Op.lt,
  $not: Op.not,
  $in: Op.in,
  $notIn: Op.notIn,
  $is: Op.is,
  $like: Op.like,
  $notLike: Op.notLike,
  $iLike: Op.iLike,
  $notILike: Op.notILike,
  $regexp: Op.regexp,
  $notRegexp: Op.notRegexp,
  $iRegexp: Op.iRegexp,
  $notIRegexp: Op.notIRegexp,
  $between: Op.between,
  $notBetween: Op.notBetween,
  $overlap: Op.overlap,
  $contains: Op.contains,
  $contained: Op.contained,
  $adjacent: Op.adjacent,
  $strictLeft: Op.strictLeft,
  $strictRight: Op.strictRight,
  $noExtendRight: Op.noExtendRight,
  $noExtendLeft: Op.noExtendLeft,
  $and: Op.and,
  $or: Op.or,
  $any: Op.any,
  $all: Op.all,
  $values: Op.values,
  $col: Op.col
};

const connection = new Sequelize(db, user, pass, { operatorsAliases });
JSON
JSON 数据类型仅由 PostgreSQL,SQLite, MySQL 和 MariaDB 语言支持.

PostgreSQL
PostgreSQL 中的 JSON 数据类型将值存储为纯文本,而不是二进制表示. 如果你只是想存储和检索 JSON 格式数据,那么使用 JSON 将占用更少的磁盘空间,并且从其输入数据中构建时间更少. 但是,如果你想对 JSON 值执行任何操作,则应该使用下面描述的 JSONB 数据类型.

MSSQL
MSSQL 没有 JSON 数据类型,但是它确实提供了对于自 SQL Server 2016 以来通过某些函数存储为字符串的 JSON 的支持.使用这些函数,你将能够查询存储在字符串中的 JSON,但是任何返回的值将需要分别进行解析.

// ISJSON - 测试一个字符串是否包含有效的 JSON
User.findAll({
  where: sequelize.where(sequelize.fn('ISJSON', sequelize.col('userDetails')), 1)
})

// JSON_VALUE - 从 JSON 字符串提取标量值
User.findAll({
  attributes: [[ sequelize.fn('JSON_VALUE', sequelize.col('userDetails'), '$.address.Line1'), 'address line 1']]
})

// JSON_VALUE - 从 JSON 字符串中查询标量值
User.findAll({
  where: sequelize.where(sequelize.fn('JSON_VALUE', sequelize.col('userDetails'), '$.address.Line1'), '14, Foo Street')
})

// JSON_QUERY - 提取一个对象或数组
User.findAll({
  attributes: [[ sequelize.fn('JSON_QUERY', sequelize.col('userDetails'), '$.address'), 'full address']]
})
JSONB
JSONB 可以以三种不同的方式进行查询.

嵌套对象
{
  meta: {
    video: {
      url: {
        [Op.ne]: null
      }
    }
  }
}
嵌套键
{
  "meta.audio.length": {
    [Op.gt]: 20
  }
}
外包裹
{
  "meta": {
    [Op.contains]: {
      site: {
        url: 'http://google.com'
      }
    }
  }
}
关系 / 关联
// 找到所有具有至少一个 task 的  project,其中 task.state === project.state
Project.findAll({
    include: [{
        model: Task,
        where: { state: Sequelize.col('project.state') }
    }]
})
分页 / 限制
// 获取10个实例/行
Project.findAll({ limit: 10 })

// 跳过8个实例/行
Project.findAll({ offset: 8 })

// 跳过5个实例,然后取5个
Project.findAll({ offset: 5, limit: 5 })
排序
order 需要一个条目的数组来排序查询或者一个 sequelize 方法.一般来说,你将要使用任一属性的 tuple/array,并确定排序的正反方向.

Subtask.findAll({
  order: [
    // 将转义标题,并根据有效的方向参数列表验证DESC
    ['title', 'DESC'],

    // 将按最大值排序(age)
    sequelize.fn('max', sequelize.col('age')),

    // 将按最大顺序(age) DESC
    [sequelize.fn('max', sequelize.col('age')), 'DESC'],

    // 将按 otherfunction 排序(`col1`, 12, 'lalala') DESC
    [sequelize.fn('otherfunction', sequelize.col('col1'), 12, 'lalala'), 'DESC'],

    // 将使用模型名称作为关联的名称排序关联模型的 created_at.
    [Task, 'createdAt', 'DESC'],

    // Will order through an associated model's created_at using the model names as the associations' names.
    [Task, Project, 'createdAt', 'DESC'],

    // 将使用关联的名称由关联模型的created_at排序.
    ['Task', 'createdAt', 'DESC'],

    // Will order by a nested associated model's created_at using the names of the associations.
    ['Task', 'Project', 'createdAt', 'DESC'],

    // Will order by an associated model's created_at using an association object. (优选方法)
    [Subtask.associations.Task, 'createdAt', 'DESC'],

    // Will order by a nested associated model's created_at using association objects. (优选方法)
    [Subtask.associations.Task, Task.associations.Project, 'createdAt', 'DESC'],

    // Will order by an associated model's created_at using a simple association object.
    [{model: Task, as: 'Task'}, 'createdAt', 'DESC'],

    // 嵌套关联模型的 created_at 简单关联对象排序
    [{model: Task, as: 'Task'}, {model: Project, as: 'Project'}, 'createdAt', 'DESC']
  ]

  // 将按年龄最大值降序排列
  order: sequelize.literal('max(age) DESC')

  // 按最年龄大值升序排列,当省略排序条件时默认是升序排列
  order: sequelize.fn('max', sequelize.col('age'))

  // 按升序排列是省略排序条件的默认顺序
  order: sequelize.col('age')

  // 将根据方言随机排序 (而不是 fn('RAND') 或 fn('RANDOM'))
  order: sequelize.random()
})
Table Hint
当使用 mssql 时,可以使用 tableHint 来选择传递一个表提示. 该提示必须是来自 Sequelize.TableHints 的值,只能在绝对必要时使用. 每个查询当前仅支持单个表提示.

表提示通过指定某些选项来覆盖 mssql 查询优化器的默认行为. 它们只影响该子句中引用的表或视图.

const TableHints = Sequelize.TableHints;

Project.findAll({
  // 添加 table hint NOLOCK
  tableHint: TableHints.NOLOCK
  // 这将生成 SQL 'WITH (NOLOCK)'
})
索引提示
使用mysql时,indexHints 可用于选择性地传递索引提示. 提示类型必须是来自 Sequelize.IndexHints 的值,值应该引用现有索引.

索引提示覆盖 mysql 查询优化器的默认行为.

Project.findAll({
  indexHints: [
    { type: IndexHints.USE, values: ['index_project_on_name'] }
  ],
  where: {
    id: {
      [Op.gt]: 623
    },
    name: {
      [Op.like]: 'Foo %'
    }
  }
})
将生成一个如下所示的 mysql 查询:

SELECT * FROM Project USE INDEX (index_project_on_name) WHERE name LIKE 'FOO %' AND id > 623;
Sequelize.IndexHints 包含 USE, FORCE, 和 IGNORE.

有关原始API提案,请参阅Issue #9421.


构建非持久性实例
为了创建定义类的实例,请执行以下操作. 如果你以前编写过 Ruby,你可能认识该语法. 使用 build - 该方法将返回一个未保存的对象,你要明确地保存它.

const project = Project.build({
  title: 'my awesome project',
  description: 'woot woot. this will make me a rich man'
})

const task = Task.build({
  title: 'specify the project idea',
  description: 'bla',
  deadline: new Date()
})
内置实例在定义时会自动获取默认值:

// 首先定义模型
class Task extends Model {}
Task.init({
  title: Sequelize.STRING,
  rating: { type: Sequelize.TINYINT, defaultValue: 3 }
}, { sequelize, modelName: 'task' });

// 现在实例化一个对象
const task = Task.build({title: 'very important task'})

task.title  // ==> 'very important task'
task.rating // ==> 3
要将其存储在数据库中,请使用 save 方法并捕获事件(如果需要):

project.save().then(() => {
  // 回调
})

task.save().catch(error => {
  // 呃
})

// 还可以使用链式构建来保存和访问对象:
Task
  .build({ title: 'foo', description: 'bar', deadline: new Date() })
  .save()
  .then(anotherTask => {
    // 你现在可以使用变量 anotherTask 访问当前保存的任务
  })
  .catch(error => {
    // Ooops,做一些错误处理
  })
创建持久性实例
虽然使用 .build() 创建的实例需要显式的 .save() 调用来存储到 database 中; 但.create() 完全省略了这个要求,一旦调用就自动存储实例的数据.

Task.create({ title: 'foo', description: 'bar', deadline: new Date() }).then(task => {
  // 你现在可以通过变量 task 来访问新创建的 task
})
也可以通过 create 方法定义哪些属性可以设置. 如果你创建基于可由用户填写的表单的数据库条目,这将非常方便. 例如,使用这种方式,你可以限制 User 模型,仅设置 username 和 address,而不是 admin 标志:

User.create({ username: 'barfooz', isAdmin: true }, { fields: [ 'username' ] }).then(user => {
  // 我们假设 isAdmin 的默认值为 false:
  console.log(user.get({
    plain: true
  })) // => { username: 'barfooz', isAdmin: false }
})
更新 / 保存 / 持久化一个实例
现在可以更改一些值并将更改保存到数据库...有两种方法可以实现:

// 方法 1
task.title = 'a very different title now'
task.save().then(() => {})

// 方法 2
task.update({
  title: 'a very different title now'
}).then(() => {})
通过传递列名数组,调用 save 时也可以定义哪些属性应该被保存. 当你基于先前定义的对象设置属性时,这是有用的. 例如. 如果你通过Web应用程序的形式获取对象的值. 此外,这在 update 内部使用. 它就像这样:

task.title = 'foooo'
task.description = 'baaaaaar'
task.save({fields: ['title']}).then(() => {
 // title 现在将是 “foooo”,而 description 与以前一样
})

// 使用等效的 update 调用如下所示:
task.update({ title: 'foooo', description: 'baaaaaar'}, {fields: ['title']}).then(() => {
 //  title 现在将是 “foooo”,而 description 与以前一样
})
当你调用 save而不改变任何属性的时候,这个方法什么都不执行.

销毁 / 删除持久性实例
创建对象并获得对象的引用后,可以从数据库中删除它. 相关的方法是 destroy:

Task.create({ title: 'a task' }).then(task => {
  // 获取到 task 对象...
  return task.destroy();
}).then(() => {
 // task 对象已被销毁
})
如果 paranoid 选项为 true,则不会删除该对象,而将 deletedAt 列设置为当前时间戳. 要强制删除,可以将 force: true 传递给 destroy 调用:

task.destroy({ force: true })
在 paranoid 模式下对象被软删除后,在强制删除旧实例之前,你将无法使用相同的主键创建新实例.

恢复软删除的实例
如果你使用 paranoid:true 软删除了模型的实例,之后想要撤消删除,请使用 restore 方法:

Task.create({ title: 'a task' }).then(task => {
  // 进行软删除...
  return task.destroy();
}).then(() => {
  // 恢复软删除...
  return task.restore();
})
批量操作(一次性创建,更新和销毁多行)
除了更新单个实例之外,你还可以一次创建,更新和删除多个实例. 调用你需要的方法

Model.bulkCreate
Model.update
Model.destroy
由于你使用多个模型,回调将不会返回DAO实例. BulkCreate将返回一个模型实例/DAO的数组,但是它们不同于create,没有 autoIncrement 属性的结果值. update 和 destroy 将返回受影响的行数.

首先看下 bulkCreate

User.bulkCreate([
  { username: 'barfooz', isAdmin: true },
  { username: 'foo', isAdmin: true },
  { username: 'bar', isAdmin: false }
]).then(() => { // 注意: 这里没有凭据, 然而现在你需要...
  return User.findAll();
}).then(users => {
  console.log(users) // ... 以获取 user 对象的数组
})
一次更新几行:

Task.bulkCreate([
  {subject: 'programming', status: 'executing'},
  {subject: 'reading', status: 'executing'},
  {subject: 'programming', status: 'finished'}
]).then(() => {
  return Task.update(
    { status: 'inactive' }, /* 设置属性的值 */
    { where: { subject: 'programming' }} /* where 规则 */
  );
}).then(([affectedCount, affectedRows]) => {
  // 请注意,affectedRows 只支持以 returning: true 的方式进行定义

  // affectedCount 将会是 2
  return Task.findAll();
}).then(tasks => {
  console.log(tasks) // “programming” 任务都将处于 “inactive” 状态
})
然后删除它们:

Task.bulkCreate([
  {subject: 'programming', status: 'executing'},
  {subject: 'reading', status: 'executing'},
  {subject: 'programming', status: 'finished'}
]).then(() => {
  return Task.destroy({
    where: {
      subject: 'programming'
    },
    truncate: true /* 这将忽 where 并用 truncate table 替代  */
  });
}).then(affectedRows => {
  // affectedRows 将会是 2
  return Task.findAll();
}).then(tasks => {
  console.log(tasks) // 显示 tasks 内容
})
如果你直接从 user 接受值,则限制要实际插入的列可能会更好.bulkCreate() 接受一个选项对象作为第二个参数. 该对象可以有一个 fields 参数(一个数组),让它知道你想要明确构建哪些字段

User.bulkCreate([
  { username: 'foo' },
  { username: 'bar', admin: true}
], { fields: ['username'] }).then(() => {
  // admin 将不会被构建
})
bulkCreate 最初是成为 主流/快速 插入记录的方法,但是有时你希望能够同时插入多行而不牺牲模型验证,即使你明确地告诉 Sequelize 去筛选哪些列. 你可以通过在options对象中添加一个 validate: true 属性来实现.

class Tasks extends Model {}
Tasks.init({
  name: {
    type: Sequelize.STRING,
    validate: {
      notNull: { args: true, msg: 'name cannot be null' }
    }
  },
  code: {
    type: Sequelize.STRING,
    validate: {
      len: [3, 10]
    }
  }
}, { sequelize, modelName: 'tasks' })

Tasks.bulkCreate([
  {name: 'foo', code: '123'},
  {code: '1234'},
  {name: 'bar', code: '1'}
], { validate: true }).catch(errors => {

  /* console.log(errors) 看起来像这样:
  [
    { record:
    ...
    name: 'SequelizeBulkRecordError',
    message: 'Validation error',
    errors:
      { name: 'SequelizeValidationError',
        message: 'Validation error',
        errors: [Object] } },
    { record:
      ...
      name: 'SequelizeBulkRecordError',
      message: 'Validation error',
      errors:
        { name: 'SequelizeValidationError',
        message: 'Validation error',
        errors: [Object] } }
  ]
  */

})
一个实例的值
如果你记录一个实例,你会注意到有很多额外的东西. 为了隐藏这些东西并将其减少到非常有趣的信息,你可以使用 get 属性. 使用选项 plain: true 调用它将只返回一个实例的值.

Person.create({
  name: 'Rambow',
  firstname: 'John'
}).then(john => {
  console.log(john.get({
    plain: true
  }))
})

// 结果:

// { name: 'Rambow',
//   firstname: 'John',
//   id: 1,
//   createdAt: Tue, 01 May 2012 19:12:16 GMT,
//   updatedAt: Tue, 01 May 2012 19:12:16 GMT
// }
提示: 你还可以使用 JSON.stringify(instance) 将一个实例转换为 JSON. 基本上与 values 返回的相同.

重载实例
如果你需要让你的实例同步,你可以使用 reload 方法. 它将从数据库中获取当前数据,并覆盖调用该方法的模型的属性.

Person.findOne({ where: { name: 'john' } }).then(person => {
  person.name = 'jane'
  console.log(person.name) // 'jane'

  person.reload().then(() => {
    console.log(person.name) // 'john'
  })
})
递增
为了增加实例的值而不发生并发问题,你可以使用 increment.

首先,你可以定义一个字段和要添加的值.

User.findByPk(1).then(user => {
  return user.increment('my-integer-field', {by: 2})
}).then(user => {
  // Postgres默认会返回更新的 user (除非通过设置禁用 { returning: false })
  // 在其他方言中,你将需要调用 user.reload() 来获取更新的实例...
})
然后,你可以定义多个字段和要添加到其中的值.

User.findByPk(1).then(user => {
  return user.increment([ 'my-integer-field', 'my-very-other-field' ], {by: 2})
}).then(/* ... */)
最后,你可以定义一个包含字段及其递增值的对象.

User.findByPk(1).then(user => {
  return user.increment({
    'my-integer-field':    2,
    'my-very-other-field': 3
  })
}).then(/* ... */)
递减
为了减少一个实例的值而不遇到并发问题,你可以使用 decrement.

首先,你可以定义一个字段和要添加的值.

User.findByPk(1).then(user => {
  return user.decrement('my-integer-field', {by: 2})
}).then(user => {
  // Postgres默认会返回更新的 user (除非通过设置禁用 { returning: false })
  // 在其他方言中,你将需要调用 user.reload() 来获取更新的实例...
})
然后,你可以定义多个字段和要添加到其中的值.

User.findByPk(1).then(user => {
  return user.decrement([ 'my-integer-field', 'my-very-other-field' ], {by: 2})
}).then(/* ... */)
最后, 你可以定义一个包含字段及其递减值的对象.

User.findByPk(1).then(user => {
  return user.decrement({
    'my-integer-field':    2,
    'my-very-other-field': 3
  })
}).then(/* ... */)
  ```
