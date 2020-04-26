var express = require('express');
var router = express.Router();
var modules = require('../models')
var Op = modules.Sequelize.Op
// 查询数据
/* 第一种写法 */
// router.get('/', function (req, res, next) {
//     // res.json({ hello: 'dockerliu' })
//     modules.Article.findAll().then(Articles => {
//         res.json({ Articles: Articles })
//     })
// });

/* 第二种写法 */
router.get('/', async function (req, res, next) {
    const where = {}
    //模糊查询
    var title = req.query.title
    if (title) {
        where.title = {
            [Op.like]: '%' + title + '%'
        }
    }
    // .findAll 找出所有记录
    const articles = await modules.Article.findAll({ order: [['id', 'DESC']], where: where })
    res.json(articles)
})

// 新增数据 .create
router.post('/', async function (req, res, next) {
    const article = await modules.Article.create(req.body)
    res.json(req.body)


    // 同步写法
    // modules.Article.create({
    //     title: 'liuda',
    //     content: '武汉大武汉'
    // }).then(article => { res.json({ article: article }) })
})

// 根据ID查询单条 .findByPk 根据主键查询 .findOne查询一条
router.get('/:id', async function (req, res, next) {
    // const article = await modules.Article.findByPk(req.params.id)
    const article = await modules.Article.findOne({ where: { id: req.params.id }, include: [modules.Comment] })
    res.json({ article: article })
})
// 根据ID修改 .update更新记录
router.put('/:id', async function (req, res, next) {
    const article = await modules.Article.findByPk(req.params.id)
    article.update(req.body)
    res.json({ article: article })
})
// 根据ID删除 .destroy删除记录
router.delete('/:id', async function (req, res, next) {
    const article = await modules.Article.findByPk(req.params.id)
    article.destroy()
    res.json({ 操作: "删除成功" })
})


module.exports = router;
