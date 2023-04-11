const jwt = require('jsonwebtoken')

module.exports.TokenizeUser = function TokenizeUser(uid, username) {
    return jwt.sign({ userId: uid, username: username }, process.env.TOKEN_SECRET, { algorithm: 'HS256', jwtid: process.env.JWT_ID })
}

module.exports.RequireToken = function RequireToken(req, res, next) {
    let token = req.cookies.token

    if (token === null) return res.status(403).json({ msg: "Required token is not there" })

    jwt.verify(token, process.env.TOKEN_SECRET, { jwtid: process.env.JWT_ID }, (err, decoded) => {
        if (err) {
            // console.log(eval('4*60*60*1000'))
            // console.log(process.env.COOKIE_EXPIRES_IN)
            // console.log('Token Expires ')
            // res.setHeader(`Set-Cookie`, `token="ere"; Secure; HttpOnly; Path=/; SameSite=Strict;`)

            return res.sendStatus(403)
        }

        req.uid = decoded.userid
        req.username = decoded.username
        next()
    })
}