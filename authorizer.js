/**
* @Author: mars
* @Date:   2017-01-16T23:59:10-05:00
* @Last modified by:   mars
* @Last modified time: 2017-01-17T02:03:02-05:00
*/



const generatePolicy = function(principalId, effect, resource) {
  'use strict';
    var authResponse = {};

    authResponse.principalId = principalId;
    if (effect && resource) {
        var policyDocument = {};
        policyDocument.Version = '2012-10-17'; // default version
        policyDocument.Statement = [];
        var statementOne = {};
        statementOne.Action = 'execute-api:Invoke'; // default action
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }

    // Can optionally return a context object of your choosing.
    authResponse.context = {};
    authResponse.context.stringKey = 'stringval';
    authResponse.context.numberKey = 123;
    authResponse.context.booleanKey = true;
    return authResponse;
};

exports.handler =  (event, context, callback) => {
  'use strict';
  console.log('got event', event);
    var token = event.authorizationToken;
    // Call oauth provider, crack jwt token, etc.
    // In this example, the token is treated as the status for simplicity.

    let tmp = event.methodArn.split(':'),
    apiGatewayArnTmp = tmp[5].split('/'),
    awsAccountId = tmp[4],
    region = tmp[3],
    restApiId = apiGatewayArnTmp[0],
    stage = apiGatewayArnTmp[1];


    switch (token.toLowerCase()) {
        case 'bearer 8476140343958127-ugvvesoxdjdvy-2046773791185872':

          let resource1 = 'arn:aws:execute-api:' + region + ':'  + awsAccountId + ':' + restApiId + '/' + stage + '/GET/analyse';
          let resource2 = 'arn:aws:execute-api:' + region + ':'  + awsAccountId + ':' + restApiId + '/' + stage + '/GET/find-location';
          let resource3 = 'arn:aws:execute-api:' + region + ':'  + awsAccountId + ':' + restApiId + '/' + stage + '/GET/monitor';

            callback(null, generatePolicy('user', 'Allow', [resource1, resource2, resource3]));
            break;
        // case 'deny':
            // callback(null, generatePolicy('user', 'Deny', event.methodArn));
            // break;
        case 'unauthorized':
            callback('Unauthorized');   // Return a 401 Unauthorized response
            break;
        default:
          callback('Unauthorized');   // Return a 401 Unauthorized response
    }
};
