const router = require('koa-router')();
const Utils = require('../utils/methods');
const Tips = require('../utils/tips');
const db = require('../db/index');
const _ = require('lodash');

router.get('/oa/todolist/:time/:status', async (ctx, next) => {
    let {time, status} = ctx.params;
    let inCompleted;
    const sql = `select * from todolist where item_time = '${time}' ${status === 'all' ? '' : 'and item_status = ' + status}`;
    const counter = `select count(*) from todolist where item_time = '${time}' and item_status = 0`;
    await db.query(counter).then((res) => {
        inCompleted = res[0]['count(*)'];
    });
    await db.query(sql).then((res) => {
        ctx.body = {
            ...Tips[0], data: res, inCompleted: inCompleted
        }
    }).catch((e) => {
        console.log(e);
    });
});

router.post('/oa/todolist', async (ctx, next) => {
   console.log(ctx.request.body);
   const sql = 'insert into todolist (item_name, item_status, item_time) values (?, ?, ?)';
   const value = [ctx.request.body.item_name, false, ctx.request.body.item_date];
   await db.query(sql, value).then((res) => {
       console.log(res);
       ctx.body = {...Tips[0]}
   }).catch((e) => {
       console.log(e);
   })
});

router.put('/oa/todolist/:id/:status', async (ctx, next) => {
    let {id, status} = ctx.params;
    const sql = `update todolist set item_status = ${status} where item_id = ${id}`;
    await db.query(sql).then(
        ctx.body = {...Tips[0]}
    ).catch(e => {

    });
});

router.delete('/oa/todolist/:id', async (ctx, next) => {
    let {id} = ctx.params;
    const sql = `delete from todolist where item_id=${id}`;
    await db.query(sql).then(res => {
        ctx.body = {...Tips[0]}
    }).catch( e =>
        ctx.body = {status: 'failed'}
    )
});

router.delete('/oa/delete_completed/:time', async (ctx, next) => {
    let {time} = ctx.params;
    const sql = `delete from todolist where item_time = '${time}' and item_status = 1`;
    console.log(sql);
    await db.query(sql).then(res => {
        ctx.body = {...Tips[0]}
    }).catch( e =>
        ctx.body = {status: 'failed'}
    )
});

module.exports = router;
