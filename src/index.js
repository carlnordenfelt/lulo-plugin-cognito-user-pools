'use strict';

var aws = require('aws-sdk');
var cognitoIdentityServiceProvider = new aws.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });

var pub = {};

pub.schema = {
    AdminCreateUserConfig: {
        type: 'object',
        schema: {
            AllowAdminCreateUserOnly: { type: 'boolean' },
            UnusedAccountValidityDays: { type: 'integer' }
        }
    },
    DeviceConfiguration: {
        type: 'object',
        schema: {
            ChallengeRequiredOnNewDevice: { type: 'boolean' },
            DeviceOnlyRememberedOnUserPrompt: { type: 'boolean' }
        }
    },
    Policies: {
        type: 'object',
        schema: {
            PasswordPolicy: {
                type: 'object',
                schema: {
                    MinimumLength: { type: 'integer' },
                    RequireLowercase: { type: 'boolean' },
                    RequireNumbers: { type: 'boolean' },
                    RequireSymbols: { type: 'boolean' },
                    RequireUppercase: { type: 'boolean' }
                }
            }
        }
    },
    Schema: {
        type: 'array',
        schema: {
            DeveloperOnlyAttribute: { type: 'boolean' },
            Required: { type: 'boolean' },
            Mutable: { type: 'boolean' }
        }
    }
};

pub.validate = function (event) {
    if (!event.ResourceProperties.PoolName) {
        throw new Error('Missing required property PoolName');
    }
};

pub.create = function (event, _context, callback) {
    delete event.ResourceProperties.ServiceToken;
    var params = event.ResourceProperties;
    cognitoIdentityServiceProvider.createUserPool(params, function (error, response) {
        if (error) {
            return callback(error);
        }
        var data = {
            physicalResourceId: response.UserPool.Id
        };
        callback(null, data);
    });
};

pub.update = function (event, _context, callback) {
    delete event.ResourceProperties.ServiceToken;

    // UpdateUserPool does not accept the following attributes
    delete event.ResourceProperties.PoolName;
    delete event.ResourceProperties.AliasAttributes;
    delete event.ResourceProperties.Schema;

    var params = event.ResourceProperties;
    params.UserPoolId = event.PhysicalResourceId;
    cognitoIdentityServiceProvider.updateUserPool(params, function (error) {
        return callback(error);
    });
};

pub.delete = function (event, _context, callback) {
    if (!/[\w-]+_[0-9a-zA-Z]+/.test(event.PhysicalResourceId)) {
        return callback();
    }
    var params = {
        UserPoolId: event.PhysicalResourceId
    };
    cognitoIdentityServiceProvider.deleteUserPool(params, function (error) {
        return callback(error);
    });
};

module.exports = pub;
