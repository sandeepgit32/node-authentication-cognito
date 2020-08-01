var request = require('request');
var jwkToPem = require('jwk-to-pem');
var jwt = require('jsonwebtoken');
const config = require('config-yml');

const poolData = {
    UserPoolId: config.aws_config.UserPoolId,
    ClientId: config.aws_config.ClientId
};
const pool_region = config.aws_config.region;


exports.Validate = function (req, res, next) {
    var token = req.session['Authorization'];
    request({
        url: `https://cognito-idp.${pool_region}.amazonaws.com/${poolData.UserPoolId}/.well-known/jwks.json`,
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            pems = {};
            var keys = body['keys'];
            for (var i = 0; i < keys.length; i++) {
                var key_id = keys[i].kid;
                var modulus = keys[i].n;
                var exponent = keys[i].e;
                var key_type = keys[i].kty;
                var jwk = {
                    kty: key_type,
                    n: modulus,
                    e: exponent
                };
                var pem = jwkToPem(jwk);
                pems[key_id] = pem;
            }
            var decodedJwt = jwt.decode(token, {
                complete: true
            });
            if (!decodedJwt) {
                console.log("Not a valid JWT token");
                res.status(401);
                res.render("401_unauthorized");
            } else {
                var kid = decodedJwt.header.kid;
                var pem = pems[kid];
                if (!pem) {
                    console.log('Invalid token');
                    res.status(401);
                    return res.send("Invalid token");
                }
                jwt.verify(token, pem, function (err, payload) {
                    if (err) {
                        console.log("Invalid Token.");
                        res.status(401);
                        res.render("401_unauthorized");
                    } else {
                        console.log("Valid Token.");
                        return next();
                    }
                });
            }
        } else {
            console.log("Error! Unable to download JWKs");
            res.status(500);
            return res.send("Error! Unable to download JWKs");
        }
    });
}