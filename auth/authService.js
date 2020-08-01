global.fetch = require('node-fetch');
const config = require('config-yml');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

const poolData = {
    UserPoolId: config.aws_config.UserPoolId,
    ClientId: config.aws_config.ClientId
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);


exports.Signup = function (email, password, callback) {
    var attributeList = [];

    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
        Name: "email",
        Value: email
    }));

    userPool.signUp(email, password, attributeList, null, function (err, result) {
        if (err) {
            callback(err);
        } else{
            var cognitoUser = result.user;
            callback(null, cognitoUser);
        }
    })
}


exports.Signin = function (email, password, callback) {
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: email,
        Password: password
    });

    var cognitoUser = new AmazonCognitoIdentity.CognitoUser({
        Username: email,
        Pool: userPool
    });

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
            // var accesstoken = result.getAccessToken().getJwtToken();
            callback(null, result);
        },
        onFailure: (err) => {
            callback(err);
        },
    })
};


// exports.Forgotpassword = function (email, callback) {
	
//     var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
	
//     var cognitoUser = new AmazonCognitoIdentity.CognitoUser({
//         Username: email,
//         Pool: userPool
//     });
		
//     cognitoUser.forgotPassword({
//         onSuccess: (result) => {
//             callback(null, result);
//         },
//         onFailure: (err) => {
// 			callback(err);
//         },
//         inputVerificationCode: () => {
//             var verificationCode = prompt('Please input verification code ' ,'');
//             var newPassword = prompt('Enter new password ' ,'');
//             cognitoUser.confirmPassword(verificationCode, newPassword, this);
//         }
//     });
// }