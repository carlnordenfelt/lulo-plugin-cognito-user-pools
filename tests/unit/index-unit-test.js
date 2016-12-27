'use strict';

var expect = require('chai').expect;
var mockery = require('mockery');
var sinon = require('sinon');

describe('Index unit tests', function () {
    var subject;
    var createUserPoolStub = sinon.stub();
    var updateUserPoolStub = sinon.stub();
    var deleteUserPoolStub = sinon.stub();
    var event;

    before(function () {
        mockery.enable({
            useCleanCache: true,
            warnOnUnregistered: false
        });

        var awsSdkStub = {
            CognitoIdentityServiceProvider: function () {
                this.createUserPool = createUserPoolStub;
                this.updateUserPool = updateUserPoolStub;
                this.deleteUserPool = deleteUserPoolStub;
            }
        };

        mockery.registerMock('aws-sdk', awsSdkStub);
        subject = require('../../src/index');
    });
    beforeEach(function () {
        createUserPoolStub.reset().resetBehavior();
        createUserPoolStub.yields(undefined, { UserPool: { Id: 'UserPoolId' } });
        updateUserPoolStub.reset().resetBehavior();
        updateUserPoolStub.yields();
        deleteUserPoolStub.reset().resetBehavior();
        deleteUserPoolStub.yields();
        event = {
            ResourceProperties: {
                PoolName: 'UserPoolName'
            }
        };
    });
    after(function () {
        mockery.deregisterAll();
        mockery.disable();
    });

    describe('validate', function () {
        it('should succeed', function (done) {
            subject.validate(event);
            done();
        });
        it('should fail if PoolName is not set', function (done) {
            delete event.ResourceProperties.PoolName;
            function fn () {
                subject.validate(event);
            }
            expect(fn).to.throw(/Missing required property PoolName/);
            done();
        });
    });

    describe('create', function () {
        it('should succeed', function (done) {
            subject.create(event, {}, function (error, response) {
                expect(error).to.equal(null);
                expect(createUserPoolStub.calledOnce).to.equal(true);
                expect(updateUserPoolStub.called).to.equal(false);
                expect(deleteUserPoolStub.called).to.equal(false);
                expect(response.physicalResourceId).to.equal('UserPoolId');
                done();
            });
        });
        it('should fail due to createUserPool error', function (done) {
            createUserPoolStub.yields('createUserPool');
            subject.create(event, {}, function (error, response) {
                expect(error).to.equal('createUserPool');
                expect(createUserPoolStub.calledOnce).to.equal(true);
                expect(updateUserPoolStub.called).to.equal(false);
                expect(deleteUserPoolStub.called).to.equal(false);
                expect(response).to.equal(undefined);
                done();
            });
        });
    });

    describe('update', function () {
        it('should succeed', function (done) {
            event.PhysicalResourceId = 'UserPoolId';
            subject.update(event, {}, function (error) {
                expect(error).to.equal(undefined);
                expect(updateUserPoolStub.calledOnce).to.equal(true);
                expect(createUserPoolStub.called).to.equal(false);
                expect(deleteUserPoolStub.called).to.equal(false);
                done();
            });
        });
        it('should fail due to updateUserPool error', function (done) {
            updateUserPoolStub.yields('updateUserPool');
            subject.update(event, {}, function (error) {
                expect(error).to.equal('updateUserPool');
                expect(updateUserPoolStub.calledOnce).to.equal(true);
                expect(createUserPoolStub.called).to.equal(false);
                expect(deleteUserPoolStub.called).to.equal(false);
                done();
            });
        });
    });

    describe('delete', function () {
        it('should succeed', function (done) {
            event.PhysicalResourceId = 'eu-west-1_EXAMPLE';
            subject.delete(event, {}, function (error) {
                expect(error).to.equal(undefined);
                expect(deleteUserPoolStub.calledOnce).to.equal(true);
                expect(createUserPoolStub.called).to.equal(false);
                expect(updateUserPoolStub.called).to.equal(false);
                done();
            });
        });
        it('should succeed without calling delete', function (done) {
            event.PhysicalResourceId = 'UserPoolId';
            subject.delete(event, {}, function (error) {
                expect(error).to.equal(undefined);
                expect(deleteUserPoolStub.called).to.equal(false);
                expect(createUserPoolStub.called).to.equal(false);
                expect(updateUserPoolStub.called).to.equal(false);
                done();
            });
        });
        it('should fail due to deleteUserPool error', function (done) {
            event.PhysicalResourceId = 'eu-west-1_EXAMPLE';
            deleteUserPoolStub.yields('deleteUserPool');
            subject.delete(event, {}, function (error) {
                expect(error).to.equal('deleteUserPool');
                expect(deleteUserPoolStub.calledOnce).to.equal(true);
                expect(createUserPoolStub.called).to.equal(false);
                expect(updateUserPoolStub.called).to.equal(false);
                done();
            });
        });
    });
});
