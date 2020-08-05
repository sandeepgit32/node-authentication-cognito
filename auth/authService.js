global.fetch = require('node-fetch');
const config = require('config-yml');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

const poolData = {
    UserPoolId: config.aws_config.UserPoolId,
    ClientId: config.aws_config.ClientId
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

/**
 * This function is used by the user for signing up a new account. 
 * @param {string} email 
 * @param {string} password 
 * @param {Function} callback - The callback that handles the response.
 */
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

/**
 * This function is used by the user to sign into the account. The response result contains the jwt token for the
 * usr session, which is used for authorization of the user.
 * @param {string} email 
 * @param {string} password 
 * @param {Function} callback - The callback that handles the response.
 */
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

/**
 * This function is used to get the verification code when the user forgets the password.
 * @param {string} email 
 * @param {Function} callback - The callback that handles the response.
 */
exports.Forgotpassword = function(email, callback) {
	
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
	
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser({
        Username: email,
        Pool: userPool
    });
		
    cognitoUser.forgotPassword({
        onSuccess: (result) => {
            callback(null, result);
        },
        onFailure: (err) => {
			callback(err);
        }
    });
}

/**
 * This function is used to set a new password when the user forgets the current password.
 * Apart from email and password, it requires a verification code which has been sent to 
 * the user's registered email.
 * @param {string} verificationCode 
 * @param {string} email 
 * @param {string} newPassword 
 * @param {Function} callback - The callback that handles the response.
 */
exports.Confirmpassword = function(verificationCode, email, newPassword, callback) {
	
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
	
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser({
        Username: email,
        Pool: userPool
    });
		
    cognitoUser.confirmPassword(verificationCode, newPassword, {
        onSuccess: (result) => {
            callback(null, result);
        },
        onFailure: (err) => {
			callback(err);
        }
    });
}
