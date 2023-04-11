require('dotenv').config
const jwt = require('jsonwebtoken')
const { v4: uuid } = require('uuid')
const { user: User } = require('../app/models')

function GenerateAccessToken(uid) {
    try {
        return jwt.sign(
            { uid: uid },
            process.env.TOKEN_SECRET,
            {
                algorithm: 'HS256',
                jwtid: process.env.JWT_ID,
                expiresIn: process.env.ACCESS_EXPIRES_IN
            }
        )
    } catch (err) {
        return null;
    }
}
async function GenerateRefreshToken(uid) {
    try {
        let temp_uuid = uuid()
        console.log("Refresh id " + temp_uuid)

        while ((await User.find({ refresh: temp_uuid }, 'refresh')).length) temp_uuid = uuid()
        const user = await User.findById(uid)
        user.refresh = temp_uuid
        await user.save();

        return jwt.sign(
            {
                uid: uid,
                refresh: temp_uuid
            },
            process.env.TOKEN_SECRET,
            {
                algorithm: 'HS256',
                jwtid: process.env.JWT_ID,
                expiresIn: process.env.REFRESH_EXPIRES_IN
            }
        )
    }
    catch (err) {
        console.log(err)
        return null
    }
}

module.exports.auth = async function (req, res, next) {
    try {
        const Cookie = req.cookies.evmpskavt
        if (!Cookie) {
            //Cooike expire; Loggout the user
            res.setHeader(`Set-Cookie`, `${process.env.TOKEN_NAME}=${null}; Secure; HttpOnly; Path=/; SameSite=Strict; Expires=${new Date(null)}`)
            return res.status(401).json({ msg: "Cookie Expires; Unauthorized Access" });
        }
        const token = JSON.parse(Cookie)

        //Verify Refresh Token
        jwt.verify(token.refresh, process.env.TOKEN_SECRET, { jwtid: process.env.JWT_ID }, (err, rDecoded) => {
            if (err) {
                // Refresh token is expire; Loogout the user
                res.setHeader(`Set-Cookie`, `${process.env.TOKEN_NAME}=${null}; Secure; HttpOnly; Path=/; SameSite=Strict; Expires=${new Date(null)}`)
                return res.status(401).json({ msg: "Refresh Token Expires; Unauthorized Access" })
            }
            else {
                const refreshId = rDecoded.refresh
                const uid = rDecoded.uid
                // Verify Access Token
                jwt.verify(token.access, process.env.TOKEN_SECRET, { jwtid: process.env.JWT_ID }, async (err, aDecoded) => {
                    if (err) {
                        // Access token expires; Generate new access token by vaildating Refresht token
                        try {
                            const userFound = await User.findById(uid);
                            if (userFound === null) {
                                // Invaild user; No such User exists
                                res.setHeader(`Set-Cookie`, `${process.env.TOKEN_NAME}=${null}; Secure; HttpOnly; Path=/; SameSite=Strict; Expires=${new Date(null)}`)
                                return res.status(401).json({ msg: "No such User Exists; Unauthorized Access" })
                            }

                            // Now check refresh id; 
                            if (userFound.refresh !== refreshId) {
                                // Refresh Id does not match
                                userFound.refresh = ""
                                res.setHeader(`Set-Cookie`, `${process.env.TOKEN_NAME}=${null}; Secure; HttpOnly; Path=/; SameSite=Strict; Expires=${new Date(null)}`)
                                return res.status(401).json({ msg: "ReUse of Refresh Token; Unauthorized Access" })
                            }

                            //Refresh token matches with that in database
                            //Now generate new Access and Refresh token
                            const newToken = JSON.stringify({ access: GenerateAccessToken(userFound._id), refresh: await GenerateRefreshToken(userFound._id) })
                            res.setHeader('Set-Cookie', `${process.env.TOKEN_NAME}=${newToken}; Secure; HttpOnly; Path=/; SameSite=Strict; Expires=${new Date(new Date().getTime() + parseInt(process.env.COOKIE_EXPIRES_IN))}`)
                            next()
                        }
                        catch (errDB) {
                            console.log(errDB)
                            res.setHeader(`Retry-After`, 120);//Retry after 120sec (2 minutes)
                            return res.status(503).json({ msg: "Something Went wrong; Retry After Sometime" })
                        }
                    }
                    else {
                        // Access token is valid; Grant the access to authorize routes
                        req.uid = aDecoded.uid
                        next()
                    }
                })
            }
        })
    }
    catch (err) {
        console.log(err)
        res.setHeader(`Retry-After`, 120);//Retry after 120sec (2 minutes)
        return res.status(503).json({ msg: "Something Went wrong; Retry After Sometime" })
    }
}

module.exports.GenerateAccessToken = GenerateAccessToken
module.exports.GenerateRefreshToken = GenerateRefreshToken
