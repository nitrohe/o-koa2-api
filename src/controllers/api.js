
import { getItem, getList, addItem, updateItem, deleteItem } from '../models'
import dbFields from '../models/model'
import { CheckToken, GenerateToken } from '../lib/auth'
import UploadFile from '../lib/upload'
import { LoadMockData } from '../lib/loaddir'

var __cache = {}
/**
 * 校验数据库表、校验token
 * @param  ctx  Context对象
 * @param  flag  是否进行数据库表校验
 * @return 校验结果
 */

const checkDbModel = async (ctx, flag = true) => {
  var result = true
  const module = ctx.params.module
  const method = ctx.request.method
  // 校验是否有对应的表
  if (flag && !Object.prototype.hasOwnProperty.call(dbFields, module)) {
    ctx.status = 404
    result = false
  }
  // 校验非GET请求是否有权限
  if (method !== 'GET') {
    const retCheck = await CheckToken(ctx)
    if (retCheck !== 200) {
      ctx.status = 403
      result = false
    }
  }

  return result
}

export const Get = async (ctx, next) => {
  console.log('Get**********ctx*******', ctx, ctx.params, ctx.query)
  const { id = '' } = ctx.query
  const retCheck = await checkDbModel(ctx)
  if (retCheck) {
    const data = id ? await getItem(ctx.params, ctx.query) : await getList(ctx.params, ctx.query)
    ctx.body = {
      result: data
    }
  }

  next()
}

export const Post = async (ctx, next) => {
  console.log('Post**********ctx*******', ctx)
  const retCheck = await checkDbModel(ctx)
  if (retCheck) {
    const data = await addItem(ctx.params, ctx.query)
    ctx.body = {
      result: data
    }
  }
  next()
}

export const Put = async (ctx, next) => {
  console.log('Put**********ctx*******', ctx, '  ', ctx.params, '  ', ctx.query)
  const retCheck = await checkDbModel(ctx)
  if (retCheck) {
    const data = await updateItem(ctx.params, ctx.query)
    console.log('Put**********data*******', data)
    ctx.body = {
      result: data
    }
  }
  next()
}

export const Delete = async (ctx, next) => {
  console.log('Delete**********ctx*******', ctx, '  ', ctx.params, '  ', ctx.query)
  const retCheck = await checkDbModel(ctx)
  if (retCheck) {
    const data = await deleteItem(ctx.params, ctx.query)
    console.log('Delete**********data*******', data)
    ctx.body = {
      result: data
    }
  }
  next()
}

export const Login = async (ctx, next) => {
  console.log('Login**********ctx*******', ctx)
  // TODO查询用户是否合法

  // 用户登录的时候返回token
  const token = GenerateToken('userName')
  ctx.body = {
    status: 200,
    result: 'success',
    token: token
  }

  next()
}
export const Upload = async (ctx, next) => {
  console.log('Upload**********ctx*******', ctx)
  const retCheck = await checkDbModel(ctx, false)
  if (retCheck) {
    UploadFile(ctx)
  }
  next()
}

export const Mock = async (ctx, next) => {
  console.log('Mock**********ctx*******', ctx)
  const module = ctx.params.module
  const method = ctx.request.method
  const cachKeys = Object.keys(__cache)
  if (cachKeys.length === 0) {
    console.log('Mock********load**__cache*******')
    __cache = LoadMockData()
  }
  console.log('Mock**********__cache*******', __cache[module])
  const queryMethod = method + ' /api/mock/' + module
  if (!Object.prototype.hasOwnProperty.call(__cache, module)) {
    ctx.status = 404
  } else {
    // TODO default?
    const mockData = __cache[module].default
    ctx.body = {
      result: mockData[queryMethod]
    }
  }

  next()
}
