import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'

const publicKey = fs.readFileSync(path.join(__dirname, '../../publicKey.pub'))
/**
 * 校验token是否合法
 */
export const CheckToken = async (ctx) => {
  const token = ctx.request.header.authorization
  var status = 403
  try {
    const decoded = await jwt.verify(token, publicKey)
    if (decoded.userInfo) {
      status = 200
    }
  } catch (err) {
    status = 503
  }
  return status
}
/**
 * 根据用户名生成token
 */
export const GenerateToken = (userInfo) => {
  // 用户登录的时候返回token
  const token = jwt.sign({
    userInfo: userInfo // 保存到token的数据
  }, publicKey, { expiresIn: '8h' })

  return token
}
