package com.enonic.lib.asset;

import org.junit.jupiter.api.Test;

import com.enonic.xp.app.ApplicationKey;
import com.enonic.xp.branch.Branch;
import com.enonic.xp.content.ContentPath;
import com.enonic.xp.data.PropertyTree;
import com.enonic.xp.project.Project;
import com.enonic.xp.project.ProjectName;
import com.enonic.xp.repository.RepositoryId;
import com.enonic.xp.security.RoleKeys;
import com.enonic.xp.security.acl.AccessControlEntry;
import com.enonic.xp.security.acl.AccessControlList;
import com.enonic.xp.site.Site;
import com.enonic.xp.site.SiteConfig;
import com.enonic.xp.site.SiteConfigs;
import com.enonic.xp.testing.ScriptTestSupport;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class RequestVerifierHandlerTest
  extends ScriptTestSupport
{
  @Test
  void testAssetRequestInvalidURLNoEndpoint()
  {
    portalRequest.setEndpointPath( null );
    portalRequest.setRawPath( "/site/project/master/mysite/" );
    runFunction( "lib/request-verifier-test.js", "testAssetRequestInvalidURLNoEndpoint" );
  }

  @Test
  void testAssetRequestInvalidURLPattern()
  {
    portalRequest.setEndpointPath( "/_/myservice/myapplication/asset/123456/path/to/resource" );
    portalRequest.setRawPath( "/site/project/master/mysite/_/myservice/myapplication/asset/123456/path/to/resource" );

    runFunction( "lib/request-verifier-test.js", "testAssetRequestInvalidURLPattern" );
  }

  @Test
  void testAssetRequestOnSite()
  {
    portalRequest.setContentPath( ContentPath.from( "/mysite" ) );
    portalRequest.setEndpointPath( "/_/service/myapplication/asset/123456/path/to/resource" );
    portalRequest.setRawPath( "/site/project/master/mysite/_/service/myapplication/asset/123456/path/to/resource" );
    portalRequest.setRepositoryId( RepositoryId.from( "com.enonic.cms.project" ) );
    portalRequest.setBranch( Branch.from( "master" ) );
    portalRequest.setContent( null );

    final Site site = mock( Site.class );
    when( site.getPath() ).thenReturn( ContentPath.from( "/mysite" ) );
    when( site.getPermissions() ).thenReturn(
      AccessControlList.of( AccessControlEntry.create().principal( RoleKeys.ADMIN ).allowAll().build() ) );
    when( site.getSiteConfigs() ).thenReturn(
      SiteConfigs.from( SiteConfig.create().application( ApplicationKey.from( "myapplication" ) ).config( new PropertyTree() ).build() ) );

    when( contentService.findNearestSiteByPath( any( ContentPath.class ) ) ).thenReturn( site );

    runFunction( "lib/request-verifier-test.js", "testAssetRequestOnSite" );
  }

  @Test
  void testAssetRequestOnAdminSite()
  {
    portalRequest.setContentPath( ContentPath.from( "/mysite" ) );
    portalRequest.setEndpointPath( "/_/service/myapplication/asset/123456/path/to/resource" );
    portalRequest.setRawPath( "/admin/site/preview/project/master/mysite/_/service/myapplication/asset/123456/path/to/resource" );
    portalRequest.setRepositoryId( RepositoryId.from( "com.enonic.cms.project" ) );
    portalRequest.setBranch( Branch.from( "master" ) );
    portalRequest.setContent( null );

    final Site site = mock( Site.class );
    when( site.getPath() ).thenReturn( ContentPath.from( "/mysite" ) );
    when( site.getPermissions() ).thenReturn(
      AccessControlList.of( AccessControlEntry.create().principal( RoleKeys.ADMIN ).allowAll().build() ) );
    when( site.getSiteConfigs() ).thenReturn(
      SiteConfigs.from( SiteConfig.create().application( ApplicationKey.from( "myapplication" ) ).config( new PropertyTree() ).build() ) );

    when( contentService.findNearestSiteByPath( any( ContentPath.class ) ) ).thenReturn( site );

    runFunction( "lib/request-verifier-test.js", "testAssetRequestOnAdminSite" );
  }

  @Test
  void testAssetRequestOnProject()
  {
    portalRequest.setContentPath( ContentPath.from( "/mysite" ) );
    portalRequest.setEndpointPath( "/_/service/myapplication/asset/123456/path/to/resource" );
    portalRequest.setRawPath( "/site/project/master/mysite/_/service/myapplication/asset/123456/path/to/resource" );
    portalRequest.setRepositoryId( RepositoryId.from( "com.enonic.cms.project" ) );
    portalRequest.setBranch( Branch.from( "master" ) );
    portalRequest.setContent( null );

    final SiteConfigs projectConfigs =
      SiteConfigs.from( SiteConfig.create().application( ApplicationKey.from( "myapplication" ) ).config( new PropertyTree() ).build() );

    final Project project = mock( Project.class );
    when( project.getSiteConfigs() ).thenReturn( projectConfigs );
    when( projectService.get( eq( ProjectName.from( portalRequest.getRepositoryId() ) ) ) ).thenReturn( project );

    runFunction( "lib/request-verifier-test.js", "testAssetRequestOnProject" );
  }

  @Test
  void testAssetRequestOnProjectAppNotInstalled()
  {
    portalRequest.setContentPath( ContentPath.from( "/mysite" ) );
    portalRequest.setEndpointPath( "/_/service/myapplication/asset/123456/path/to/resource" );
    portalRequest.setRawPath( "/site/project/master/mysite/_/service/myapplication/asset/123456/path/to/resource" );
    portalRequest.setRepositoryId( RepositoryId.from( "com.enonic.cms.project" ) );
    portalRequest.setBranch( Branch.from( "master" ) );
    portalRequest.setContent( null );

    final Project project = mock( Project.class );
    when( project.getSiteConfigs() ).thenReturn( SiteConfigs.empty() );
    when( projectService.get( eq( ProjectName.from( portalRequest.getRepositoryId() ) ) ) ).thenReturn( project );

    runFunction( "lib/request-verifier-test.js", "testAssetRequestOnProjectAppNotInstalled" );
  }

  @Test
  void testAssetRequestOnAdminTool()
  {
    portalRequest.setEndpointPath( "/_/service/myapplication/asset/123456/path/to/resource" );
    portalRequest.setRawPath( "/admin/tool/_/service/myapplication/asset/123456/path/to/resource" );

    runFunction( "lib/request-verifier-test.js", "testAssetRequestOnAdminTool" );
  }

  @Test
  void testAssetRequestOnRoot()
  {
    portalRequest.setEndpointPath( "/_/service/myapplication/asset/123456/path/to/resource" );
    portalRequest.setRawPath( "/_/service/myapplication/asset/123456/path/to/resource" );

    runFunction( "lib/request-verifier-test.js", "testAssetRequestOnRoot" );
  }

  @Test
  void testAssetRequestOnAdminToolInvalid()
  {
    portalRequest.setEndpointPath( "/_/service/myapplication/asset/123456/path/to/resource" );
    portalRequest.setRawPath( "/admin/tool/path/_/service/myapplication/asset/123456/path/to/resource" );

    runFunction( "lib/request-verifier-test.js", "testAssetRequestOnAdminToolInvalid" );
  }

  @Test
  void testAssetRequestOnWebapp()
  {
    portalRequest.setEndpointPath( "/_/service/myapplication/asset/123456/path/to/resource" );
    portalRequest.setRawPath( "/webapp/myapplication/_/service/myapplication/asset/123456/path/to/resource" );

    runFunction( "lib/request-verifier-test.js", "testAssetRequestOnWebapp" );
  }

  @Test
  void testAssetRequestOnWebappInvalid()
  {
    portalRequest.setEndpointPath( "/_/service/myapplication/asset/123456/path/to/resource" );
    portalRequest.setRawPath( "/webapp/myapp/_/service/myapplication/asset/123456/path/to/resource" );

    runFunction( "lib/request-verifier-test.js", "testAssetRequestOnWebappInvalid" );
  }

  @Test
  void testAssetRequestOnWebappInvalidPattern()
  {
    portalRequest.setEndpointPath( "/_/service/myapplication/asset/123456/path/to/resource" );
    portalRequest.setRawPath( "/webapp/myapp/path/_/service/myapplication/asset/123456/path/to/resource" );

    runFunction( "lib/request-verifier-test.js", "testAssetRequestOnWebappInvalidPattern" );
  }

}