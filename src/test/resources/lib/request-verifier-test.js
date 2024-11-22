const t = require('/lib/xp/testing');

exports.testAssetRequestOnSite = function () {
  const bean = __.newBean('com.enonic.lib.asset.RequestVerifierHandler');
  t.assertTrue(bean.verify());
};

exports.testAssetRequestOnAdminSite = function () {
  const bean = __.newBean('com.enonic.lib.asset.RequestVerifierHandler');
  t.assertTrue(bean.verify());
};

exports.testAssetRequestOnProject = function () {
  const bean = __.newBean('com.enonic.lib.asset.RequestVerifierHandler');
  t.assertFalse(bean.verify());
};

exports.testAssetRequestOnAdminTool = function () {
  const bean = __.newBean('com.enonic.lib.asset.RequestVerifierHandler');
  t.assertTrue(bean.verify());
};

exports.testAssetRequestOnAdminToolXP8 = function () {
  const bean = __.newBean('com.enonic.lib.asset.RequestVerifierHandler');
  t.assertTrue(bean.verify());
}

exports.testAssetRequestOnAdminToolInvalid = function () {
  const bean = __.newBean('com.enonic.lib.asset.RequestVerifierHandler');
  t.assertFalse(bean.verify());
};

exports.testAssetRequestOnWebapp = function () {
  const bean = __.newBean('com.enonic.lib.asset.RequestVerifierHandler');
  t.assertTrue(bean.verify());
};

exports.testAssetRequestOnWebappInvalid = function () {
  const bean = __.newBean('com.enonic.lib.asset.RequestVerifierHandler');
  t.assertFalse(bean.verify());
};

exports.testAssetRequestOnWebappInvalidPattern = function () {
  const bean = __.newBean('com.enonic.lib.asset.RequestVerifierHandler');
  t.assertFalse(bean.verify());
};

exports.testAssetRequestInvalidURLNoEndpoint = function () {
  const bean = __.newBean('com.enonic.lib.asset.RequestVerifierHandler');
  t.assertFalse(bean.verify());
};

exports.testAssetRequestInvalidURLPattern = function () {
  const bean = __.newBean('com.enonic.lib.asset.RequestVerifierHandler');
  t.assertFalse(bean.verify());
};

exports.testAssetRequestOnProjectAppNotInstalled = function () {
  const bean = __.newBean('com.enonic.lib.asset.RequestVerifierHandler');
  t.assertFalse(bean.verify());
};

exports.testAssetRequestOnRoot = function () {
  const bean = __.newBean('com.enonic.lib.asset.RequestVerifierHandler');
  t.assertTrue(bean.verify());
};
