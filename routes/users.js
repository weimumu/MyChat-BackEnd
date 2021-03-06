const Router = require('koa-router')
const multer = require('koa-multer')
const fs = require('fs')
const upload = multer({ dest: '../public/' })
const { usersCtrl } = require('../controllers')

const router = new Router({ prefix: '/api/users' });

router.get('/', async function (ctx, next) {
  ctx.body = 'this is a users api route'
})

// 上传头像
router.post('/upload', upload.single('avatar'), usersCtrl.uploadAvatar);

router.post('/signin', usersCtrl.signin)

router.post('/signup', usersCtrl.signup)

router.post('/weather', usersCtrl.gainWeather)
//获取邮箱验证码
router.post('/auth', usersCtrl.gainCode)

router.post('/:userid/attributes', usersCtrl.addAttributes)

router.delete('/:userid/attributes', usersCtrl.deleteAttributes)

router.post('/device_token', usersCtrl.saveDeviceToken);

exports = module.exports = router
