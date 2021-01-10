import KoaRouter from 'koa-router'
import controllers from '../controllers'

const router = new KoaRouter()

export default router
  .get('/public/get', function (ctx, next) {
    ctx.body = '禁止访问！'
  })
  .post('/api/login', controllers.api.Login)
  .all('/api//upload', controllers.api.Upload)
  .get('/api/:module', controllers.api.Get)
  .post('/api/:module', controllers.api.Post)
  .put('/api/:module', controllers.api.Put)
  .del('/api/:module', controllers.api.Delete)
