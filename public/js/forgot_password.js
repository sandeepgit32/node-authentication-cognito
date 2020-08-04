global.fetch = require('node-fetch');
const config = require('config-yml');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

$(document).ready(function() {
    $('#forgot_password').on('click', function (e) {
        const poolData = {
            UserPoolId: config.aws_config.UserPoolId,
            ClientId: config.aws_config.ClientId
        };
        const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

        var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
	
        var cognitoUser = new AmazonCognitoIdentity.CognitoUser({
            Username: email,
            Pool: userPool
        });
            
        cognitoUser.forgotPassword({
            onSuccess: (result) => {
                console.log(result);
            },
            onFailure: (err) => {
                alert(err);
                console.log(err);
            },
            inputVerificationCode: () => {
                var verificationCode = prompt('Please input verification code ' ,'');
                var newPassword = prompt('Enter new password ' ,'');
                cognitoUser.confirmPassword(verificationCode, newPassword, this);
            }
        });
    });
}
