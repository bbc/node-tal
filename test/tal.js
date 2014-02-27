'use strict';

var fs = require("fs");
var tal = require("../lib/helpers.js");
var talConfig = require("tal-config");
var sinon = require("sinon");
var sandbox = sinon.sandbox.create();

module.exports = {
  'setUp': function(done){
    this.configElementSpy = sandbox.stub(talConfig, 'getStrategyElement');
    var t = this.tal = new tal(talConfig);

    var configStub = sandbox.stub(t, 'getDeviceConfigFromRequest');
    configStub.withArgs({ brand: 'generic', model: 'tv1' }).returns(require(__dirname + '/testconfig/deviceconfig/generic-tv1.json'));
    configStub.withArgs({ brand: 'generic', model: 'tv2' }).returns(require(__dirname + '/testconfig/deviceconfig/generic-tv2.json'));

    var appConfigStub = sandbox.stub(t, 'getConfigurationFromFilesystem');
    appConfigStub.withArgs('generic-tv1', 'applicationconfig').returns(fs.readFileSync(__dirname + '/testconfig/applicationconfig/generic-tv1.json', 'utf8'));
    appConfigStub.withArgs('generic-tv2', 'applicationconfig').returns(fs.readFileSync(__dirname + '/testconfig/applicationconfig/generic-tv2.json', 'utf8'));

    done();
  },
  'tearDown': function(done){
    sandbox.restore();

    done();
  },
  'Generic TV1 Device has no Headers' : function(test) {
    var deviceConfig = this.tal.getDeviceConfigFromRequest({ brand: 'generic', model: 'tv1' });
    var headers = this.tal.getDeviceHeaders(deviceConfig);

    test.ok(headers == "", "The device headers are not empty. It contains: " + headers);
    test.done();
  },

  'Generic TV1 Device has no body'  : function(test) {
    var deviceConfig = this.tal.getDeviceConfigFromRequest({ brand: 'generic', model: 'tv1' });
    var body = this.tal.getDeviceBody(deviceConfig);

    test.ok(body == "", "The device body is not empty. It contains: " + body);
    test.done();
  },

  'Generic TV1 Device has default Mime type' : function(test) {
    var deviceConfig = this.tal.getDeviceConfigFromRequest({ brand: 'generic', model: 'tv1' });
    var mimeType = this.tal.getMimeType(deviceConfig);

    test.ok(mimeType == "text/html", "The mime type is not text/html. The value was " + mimeType);
    test.done();
  },

  'Generic TV1 Device has default Root element' : function(test) {
    var deviceConfig = this.tal.getDeviceConfigFromRequest({ brand: 'generic', model: 'tv1' });
    var rootElement = this.tal.getRootHtmlTag(deviceConfig);

    test.ok(rootElement == "<html>", "The root element is not '<html>'. The value was " + rootElement);
    test.done();
  },

  'Generic TV1 Device has default Doc type' : function(test) {
    var deviceConfig = this.tal.getDeviceConfigFromRequest({ brand: 'generic', model: 'tv1' });
    var rootElement = this.tal.getDocType(deviceConfig);

    test.ok(rootElement == "<!DOCTYPE html>", "The device does not have the default doc type (<!DOCTYPE html>). The value was " + rootElement);
    test.done();
  },

  'Generic TV2 Device has expected header' : function(test) {
    var deviceConfig = this.tal.getDeviceConfigFromRequest({ brand: 'generic', model: 'tv2' });
    var headers = this.tal.getDeviceHeaders(deviceConfig);

    var pageElement = this.configElementSpy.firstCall;

    test.ok(pageElement.calledWithExactly('pagestrategy1', 'header'), "The device header was not the expected value. The value was " + headers);
    test.done();
  },

  'Generic TV2 Device has expected body' : function(test) {
    var deviceConfig = this.tal.getDeviceConfigFromRequest({ brand: 'generic', model: 'tv2' });
    var body = this.tal.getDeviceBody(deviceConfig);

    var pageElement = this.configElementSpy.firstCall;

    test.ok(pageElement.calledWithExactly('pagestrategy1', 'body'), "The device body was not the expected value. The value was " + body);
    test.done();
  },

  'Generic TV2 Device has expected Mime type' : function(test) {
    var deviceConfig = this.tal.getDeviceConfigFromRequest({ brand: 'generic', model: 'tv2' });
    var mimeType = this.tal.getMimeType(deviceConfig);

    var pageElement = this.configElementSpy.firstCall;

    test.ok(pageElement.calledWithExactly('pagestrategy1', 'mimetype'), "The device mime type was not the expected value. It was " + mimeType);
    test.done();
  },

  'Generic TV2 Device has expected Root element' : function(test) {
    var deviceConfig = this.tal.getDeviceConfigFromRequest({ brand: 'generic', model: 'tv2' });
    var rootElement = this.tal.getRootHtmlTag(deviceConfig);

    var pageElement = this.configElementSpy.firstCall;

    test.ok(pageElement.calledWithExactly('pagestrategy1', 'rootelement'), "The device root element was not the expected value. It was " + rootElement);
    test.done();
  },

  'Generic TV2 Device has expected Doc type' : function(test) {
    var deviceConfig = this.tal.getDeviceConfigFromRequest({ brand: 'generic', model: 'tv2' });
    var docType = this.tal.getDocType(deviceConfig);

    var pageElement = this.configElementSpy.firstCall;

    test.ok(pageElement.calledWithExactly('pagestrategy1', 'doctype'), "The device doc type was not the expected value. It was " + docType);
    test.done();
  },

  'Normalise key names replaces special characters with underscores' : function(test) {
    test.ok(this.tal.normaliseKeyNames("one$two(three") == "one_two_three", "The key names did not have special characters replaced with underscores. The key names are one$two(three");
    test.done();
  },

  'Normalise key names replaces upper case to lower case' : function(test) {
    test.ok(this.tal.normaliseKeyNames("one_TWO_Three") == "one_two_three", "The key names were not set to lower case. The key names were: one_TWO_Three");
    test.done();
  },

  'Get generic device config' : function(test) {
    var deviceConfig = this.tal.getDeviceConfigFromRequest({ brand: 'generic', model: 'tv1' });
    var deviceConfigJSON = deviceConfig;

    test.ok(deviceConfigJSON.modules.base == "antie/devices/browserdevice", "The generic device config was not fetched. The returned json is: " + deviceConfigJSON.modules.base);
    test.done();
  },

  'Get generic app config' : function(test) {
    var appConfigJSON = JSON.parse(this.tal.getConfigurationFromFilesystem("generic-tv1", "applicationconfig"));

    test.ok(appConfigJSON.deviceConfigurationKey == "generic-tv1", "The generic app config was not parsed correctly. The returned json is: " + appConfigJSON);
    test.done();
  },

  'Get generic app config (Alt)' : function(test) {
    var appConfigJSON = JSON.parse(this.tal.getConfigurationFromFilesystem("generic-tv2", "applicationconfig"));

    test.ok(appConfigJSON.deviceConfigurationKey == "generic-tv2", "The generic app config (alt) was not parsed correctly. The returned json is: " + appConfigJSON);
    test.done();
  },

  'App config overrides device config when merged' : function(test) {
    var deviceConfigJSON = this.tal.getDeviceConfigFromRequest({ brand: 'generic', model: 'tv1' });
    var appConfigJSON = JSON.parse(this.tal.getConfigurationFromFilesystem("generic-tv1", "applicationconfig"));
    var mergedConfig = this.tal.mergeConfigurations(deviceConfigJSON, appConfigJSON);

    test.ok(mergedConfig.deviceelements.deviceelement1 == "overridetest", "The config override was unsuccessful. The merged config returned " + mergedConfig.deviceelements.deviceelement1);
    test.done();
  }
};

