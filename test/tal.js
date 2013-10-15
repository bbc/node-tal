var fs = require("fs");
var tal = require("../index.js");


function getGenericDevice1Config(t) {
  var json = JSON.parse(t.getConfigurationFromFilesystem("generic-tv1", "deviceconfig"));
  return json;
}

function getGenericDevice2Config(t) {
  var json = JSON.parse(t.getConfigurationFromFilesystem("generic-tv2", "deviceconfig"));
  return json;
}


module.exports = {
  'setUp': function(done){
    this.tal = new tal(__dirname+"/testconfig/", __dirname+"/testconfig/config/");

    done();
  },
  'Generic TV1 Device has no Headers' : function(test) {
    var headers = this.tal.getDeviceHeaders(getGenericDevice1Config(this.tal));
    test.ok(headers == "", "The device headers are not empty. It contains: " + headers);
    test.done();
  },

  'Generic TV1 Device has no body'  : function(test) {
    body = this.tal.getDeviceBody(getGenericDevice1Config(this.tal));
    test.ok(body == "", "The device body is not empty. It contains: " + body);
    test.done();
  },

  'Generic TV1 Device has default Mime type' : function(test) {
    mimeType = this.tal.getMimeType(getGenericDevice1Config(this.tal));
    test.ok(mimeType == "text/html", "The mime type is not text/html. The value was " + mimeType);
    test.done();
  },

  'Generic TV1 Device has default Root element' : function(test) {
    rootElement = this.tal.getRootHtmlTag(getGenericDevice1Config(this.tal));
    test.ok(rootElement == "<html>", "The root element is not '<html>'. The value was " + rootElement);
    test.done();
  },

  'Generic TV1 Device has default Doc type' : function(test) {
    rootElement = this.tal.getDocType(getGenericDevice1Config(this.tal));
    test.ok(rootElement == "<!DOCTYPE html>", "The device does not have the default doc type (<!DOCTYPE html>). The value was " + rootElement);
    test.done();
  },

  'Generic TV2 Device has expected header' : function(test) {
    headers = this.tal.getDeviceHeaders(getGenericDevice2Config(this.tal));
    test.ok(headers == "expectedheader", "The device header was not the expected value. The value was " + headers);
    test.done();
  },

  'Generic TV2 Device has expected body' : function(test) {
    body = this.tal.getDeviceBody(getGenericDevice2Config(this.tal));
    test.ok(body == "expectedbody", "The device body was not the expected value. The value was " + body);
    test.done();
  },

  'Generic TV2 Device has expected Mime type' : function(test) {
    mimeType = this.tal.getMimeType(getGenericDevice2Config(this.tal));
    test.ok(mimeType == "expectedmimetype", "The device mime type was not the expected value. It was " + mimeType);
    test.done();
  },

  'Generic TV2 Device has expected Root element' : function(test) {
    rootElement = this.tal.getRootHtmlTag(getGenericDevice2Config(this.tal));
    test.ok(rootElement == "expectedrootelement", "The device root element was not the expected value. It was " + rootElement);
    test.done();
  },

  'Generic TV2 Device has expected Doc type' : function(test) {
    docType = this.tal.getDocType(getGenericDevice2Config(this.tal));
    test.ok(docType == "expecteddoctype", "The device doc type was not the expected value. It was " + docType);
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
    deviceConfigJSON = getGenericDevice1Config(this.tal);
    test.ok(deviceConfigJSON.modules.base == "antie/devices/browserdevice", "The generic device config was not fetched. The returned json is: " + deviceConfigJSON.modules.base);
    test.done();
  },

  'Get generic app config' : function(test) {
    appConfigJSON = JSON.parse(this.tal.getConfigurationFromFilesystem("generic-tv1", "applicationconfig"));
    test.ok(appConfigJSON.deviceConfigurationKey == "generic-tv1", "The generic app config was not parsed correctly. The returned json is: " + appConfigJSON);
    test.done();
  },

  'Get generic app config (Alt)' : function(test) {
    appConfigJSON = JSON.parse(this.tal.getConfigurationFromFilesystem("generic-tv2", "applicationconfig"));
    test.ok(appConfigJSON.deviceConfigurationKey == "generic-tv2", "The generic app config (alt) was not parsed correctly. The returned json is: " + appConfigJSON);
    test.done();
  },

  'App config overrides device config when merged' : function(test) {
    deviceConfigJSON = getGenericDevice1Config(this.tal);
    appConfigJSON = JSON.parse(this.tal.getConfigurationFromFilesystem("generic-tv1", "applicationconfig"));
    mergedConfig = this.tal.mergeConfigurations(deviceConfigJSON, appConfigJSON);
    test.ok(mergedConfig.deviceelements.deviceelement1 == "overridetest", "The config override was unsuccessful. The merged config returned " + mergedConfig.deviceelements.deviceelement1);
    test.done();
  }
};

