
import sequelize from '../lib/sequelize'
import dbFields from './model'

const getDbModel = (params) => {
  const module = params.module
  const dbModel = sequelize.define(
    module,
    dbFields[module],
    {
      tableName: module,
      timestamps: false,
      paranoid: true,
      freezeTableName: false,
      indexes: []
    }
  )
  return dbModel
}

export const getItem = async (params, query) => {
  const dbModel = getDbModel(params)
  const item = await dbModel.findAll({
    where: { id: query.id },
    raw: true
  })
  console.log('getItem***********item*******', item)
  return item
}

export const getList = async (params, query) => {
  const dbModel = getDbModel(params)
  const opt = {
    raw: true
  }
  // 支持分页
  if (Object.prototype.hasOwnProperty.call(query, 'currentPage')) {
    const currentPage = parseInt(query.currentPage) || 1
    const pageSize = parseInt(query.pageSize) || 20
    opt.offset = (currentPage - 1) * pageSize
    opt.limit = pageSize
  }

  const list = await dbModel.findAndCountAll(opt)
  console.log('getList***********list*******', list)
  return list
}

export const addItem = async (params, query) => {
  const module = params.module
  const dbModel = getDbModel(params)
  const fields = Object.keys(dbFields[module])
  const dataObj = {}
  fields.forEach(item => {
    if (Object.prototype.hasOwnProperty.call(query, item)) {
      dataObj[item] = query[item]
    }
  })
  const ret = await dbModel.create(dataObj)
  let result = ''
  if (ret) {
    result = 'success'
  }
  console.log('addItem***********result*******', result)
  return result
}

export const updateItem = async (params, query) => {
  const module = params.module
  const dbModel = getDbModel(params)
  const fields = Object.keys(dbFields[module])
  const dataObj = {}
  console.log('updateItem***********query*******', query)
  fields.forEach(item => {
    if (Object.prototype.hasOwnProperty.call(query, item)) {
      dataObj[item] = query[item]
    }
  })
  console.log('updateItem***********dataObj*******', dataObj)
  const ret = await dbModel.update(dataObj, {
    where: {
      id: query.id
    }
  })
  let result = ''
  if (ret) {
    result = 'success'
  }
  console.log('updateItem***********result*******', result)
  return result
}

export const deleteItem = async (params, query) => {
  const dbModel = getDbModel(params)
  console.log('deleteItem***********query*******', query)
  const ret = await dbModel.destroy({
    where: {
      id: query.id
    }
  })
  const result = ret ? 'success' : ret
  console.log('deleteItem***********result*******', result)
  return result
}
