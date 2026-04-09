const assetUrlLib = require('/lib/enonic/asset/assetUrl');
const t = require('/lib/xp/testing');

const fingerprint = __.newBean('com.enonic.lib.asset.AppHelper').getFingerprint(app.name);

exports.createAssetUrlWebapp = function () {
  const url = assetUrlLib.assetUrl({
    path: '/path/to/resource',
    params: {
      k1: ['v1', 'v2'],
      k2: 'v3',
    },
    type: 'server',
  });

  t.assertEquals(`/webapp/mywebapp/_/${app.name}:asset/${fingerprint}/path/to/resource?k1=v1&k1=v2&k2=v3`, url);
};

exports.createAssetUrlAdminSiteOnProject = function () {
  const url = assetUrlLib.assetUrl({
    path: '/path/to/resource/',
  });

  t.assertEquals(`/admin/site/preview/project/branch/_/${app.name}:asset/${fingerprint}/path/to/resource`, url);
};

exports.createAssetUrlOnSite = function () {
  const url = assetUrlLib.assetUrl({
    path: '/path/to/resource/',
  });

  t.assertEquals(`/site/project/branch/mysite/_/${app.name}:asset/${fingerprint}/path/to/resource`, url);
};

exports.createAssetUrlOnAdminTool = function () {
  const url = assetUrlLib.assetUrl({
    path: '/path/to/resource/'
  });

  t.assertEquals(`/admin/app/toolname/_/${app.name}:asset/${fingerprint}/path/to/resource`, url);
};

exports.createAssetUrlOnAdminToolXP8 = function () {
  const url = assetUrlLib.assetUrl({
    path: '/path/to/resource/',
  });

  t.assertEquals(`/admin/app/toolname/_/${app.name}:asset/${fingerprint}/path/to/resource`, url);
};

exports.testCreateAssetUrlOnAdminToolWithoutTrailingSlash = function () {
  const url = assetUrlLib.assetUrl({
    path: '/path/to/resource/',
  });

  t.assertEquals(`/admin/app/toolname/_/${app.name}:asset/${fingerprint}/path/to/resource`, url);
};
