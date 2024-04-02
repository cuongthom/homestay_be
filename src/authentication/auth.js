const { HttpStatusCode } = require("../exceptions/HttpStatusCode");
const jwt = require('jsonwebtoken');
const checkToken = (req, res, next) => {
    const JWT = req.headers?.authorization?.split(" ")[1]
    if(req.url == '/v1/login' || req.url == '/v1/register' ) {
        next()
        return
    }
    try{
        const jwtObject = jwt.verify(JWT, process.env.JWT_SECRET)
        const isExpired = Date.now() >= jwtObject.exp * 1000
        if(isExpired) {
            res.status(HttpStatusCode.BAD_REQUEST).json({
                message : "token is expired"
            })
            res.end()
        }else {
            next()
            return
        }
    }catch(err) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
            message: err
        })
    }
}

module.exports = checkToken