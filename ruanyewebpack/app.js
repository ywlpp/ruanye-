let express = require('express');
let app = express();
let cors = require('cors');
// 中间件都是函数 中间件都是通过use调用
app.use(cors());
let bodyParse=require('body-parser');
//解析数据中的中间件 解析json数据
app.use(bodyParse.json());
let jwt = require('jsonwebtoken');
//通过一定规则进行加密解密的包
// 在登录页面登录成功之后拿到token，访问其他页面的时候发送一个请求来验证用户是否登录 通过携带token的方式
// 如果token解密正确 说明用户已经登录了 如果token解密错误 说明用户没有登录 或者登录已经过期
// 验证登录接口 通过token验证
//登录接口
// localhost:3000/validate
app.post('/validate',(req,res)=>{
    let token = req.headers.authorization;
    // 我们要对前段发过来的token进行验证 防止前段篡改 确保是服务端给前段的合法token
    // jwt.verify验证函数 第一个参数token 第二个参数 解密的规则 需要和加密一样 第三个参数cd（err，decode）
    // err解密失败 decode解密的对象{user:lilei}
    jwt.verify(token,"abcd",function(err,decode){
        // 如果token不合法
        if(err){
            res.json({
                msg:'用户未登录'
            })
        }else{
            res.json({
            // token合法 需要延长过期时间（重新再给前端发一个token）
                token:jwt.sign({user:decode.user},'abcd',{
                    expiresIn:'90s'
                }),
                user:decode.user
            })
        }
    })
    console.log(token);
})
app.post('/login',(req,res)=>{
    let {user}=req.body
    console.log(req.body)
    // 假设登录成功，登陆成功之后给前端返回一个加密的token 
    // jwt.sign加密函数 参数第一个对象你要加密的对象 第二个参数是加密规则 第三个配置 常用expiresIn过期时间
    res.json({
        token:jwt.sign({user:user},"abcd",{
            expiresIn:'30m'
        }),
        user
    })
})
app.listen(3000,()=>{
    console.log('服务器端启动，端口3000')
})//监听服务器端口