# lulo Cognito User Pools

lulo Cognito User Pools creates user pools in Amazon Cognito

lulo Cognito User Pools is a [lulo](https://github.com/carlnordenfelt/lulo) plugin

# Installation
```
npm install lulo-plugin-cognito-user-pools --save
```

## Usage
### Properties
* PoolName: name of the User Pool. Required.
* For further properties, see the [AWS SDK Documentation for CognitoIdentityServiceProvider::createUserPool](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#createUserPool-property)

### Return Values
When the logical ID of this resource is provided to the Ref intrinsic function, Ref returns the **User Pool Id**.

`{ "Ref": "UserPool" }`

### Required IAM Permissions
The Custom Resource Lambda requires the following permissions for this plugin to work:
```
{
   "Effect": "Allow",
   "Action": [
       "cognito-idp:CreateUserPool",
       "cognito-idp:UpdateUserPool",
       "cognito-idp:DeleteUserPool"
   ],
   "Resource": "*"
}
```

## License
[The MIT License (MIT)](/LICENSE)

## Change Log
[Change Log](/CHANGELOG.md)
