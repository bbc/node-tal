'use strict';

var tal = require('./helpers.js');

module.exports = function(options) {
  var deviceHelpers = new tal();
  options = options || {};

  var app_id = options.application_id || process.env.npm_package_tal_default_application_id || 'default_tal_app';

  return function(req, res, next){
    var deviceConfig = deviceHelpers.getDeviceConfigFromRequest(req.query, {
      'application': app_id
    });

    res.type(deviceHelpers.getMimeType(deviceConfig));

    res.locals.tal = {
      app_id: app_id,
      doctype: deviceHelpers.getDocType(deviceConfig),
      rootTag: deviceHelpers.getRootHtmlTag(deviceConfig),
      deviceHeaders: deviceHelpers.getDeviceHeaders(deviceConfig),
      deviceBody: deviceHelpers.getDeviceBody(deviceConfig),
      config: {
        framework: {
          deviceConfiguration: deviceConfig
        }
      }
    };

    next();
  };
};
