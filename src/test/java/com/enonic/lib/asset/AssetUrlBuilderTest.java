package com.enonic.lib.asset;

import org.junit.jupiter.api.Test;

import com.enonic.xp.branch.Branch;
import com.enonic.xp.content.ContentPath;
import com.enonic.xp.portal.url.GenerateUrlParams;
import com.enonic.xp.portal.url.PortalUrlService;
import com.enonic.xp.repository.RepositoryId;
import com.enonic.xp.site.Site;
import com.enonic.xp.testing.ScriptTestSupport;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class AssetUrlBuilderTest
  extends ScriptTestSupport
{
  PortalUrlService portalUrlService;

  @Override
  protected void initialize()
    throws Exception
  {
    super.initialize();

    portalUrlService = mock( PortalUrlService.class );
    addService( PortalUrlService.class, portalUrlService );

    when( portalUrlService.generateUrl( any( GenerateUrlParams.class ) ) ).thenAnswer( invocation -> {
      GenerateUrlParams params = invocation.getArgument( 0 );
      return params.getPath();
    } );
  }

  @Test
  void testCreateAssetUrlWebapp()
  {
    portalRequest.setBaseUri( "/webapp/mywebapp" );

    runFunction( "lib/assetUrl-test.js", "createAssetUrlWebapp" );
  }

  @Test
  void testCreateAssetUrlAdminSiteOnProject()
  {
    when( contentService.findNearestSiteByPath( any( ContentPath.class ) ) ).thenReturn( null );

    portalRequest.setRepositoryId( RepositoryId.from( "com.enonic.cms.project" ) );
    portalRequest.setBranch( Branch.from( "branch" ) );
    portalRequest.setBaseUri( "/admin/site/preview" );
    portalRequest.setRawPath( "/admin/site/preview/project/branch/" );
    portalRequest.setContentPath( ContentPath.ROOT );

    runFunction( "lib/assetUrl-test.js", "createAssetUrlAdminSiteOnProject" );

    verify( portalUrlService, times( 1 ) ).generateUrl( any( GenerateUrlParams.class ) );
  }

  @Test
  void testCreateAssetUrlOnSite()
  {
    Site site = mock( Site.class );
    when( site.getPath() ).thenReturn( ContentPath.from( "/mysite" ) );
    when( contentService.findNearestSiteByPath( any( ContentPath.class ) ) ).thenReturn( site );

    portalRequest.setRepositoryId( RepositoryId.from( "com.enonic.cms.project" ) );
    portalRequest.setBranch( Branch.from( "branch" ) );
    portalRequest.setBaseUri( "/site" );
    portalRequest.setRawPath( "/site/project/branch/mysite" );
    portalRequest.setContentPath( ContentPath.from( "/mysite" ) );

    runFunction( "lib/assetUrl-test.js", "createAssetUrlOnSite" );

    verify( contentService, times( 1 ) ).findNearestSiteByPath( any( ContentPath.class ) );
    verify( portalUrlService, times( 1 ) ).generateUrl( any( GenerateUrlParams.class ) );
  }

  @Test
  void testCreateAssetUrlOnAdminTool()
  {
    portalRequest.setBaseUri( "/admin/tool" );
    portalRequest.setRawPath( "/admin/tool/app/toolname/" );

    runFunction( "lib/assetUrl-test.js", "createAssetUrlOnAdminTool" );

    verify( portalUrlService, times( 1 ) ).generateUrl( any( GenerateUrlParams.class ) );
  }

  @Test
  void testCreateAssetUrlOnAdminToolXP8()
  {
    portalRequest.setBaseUri( "/admin" );
    portalRequest.setRawPath( "/admin/app/toolname" );

    runFunction( "lib/assetUrl-test.js", "createAssetUrlOnAdminToolXP8" );

    verify( portalUrlService, times( 1 ) ).generateUrl( any( GenerateUrlParams.class ) );
  }

  @Test
  void testCreateAssetUrlOnAdminToolWithoutTrailingSlash()
  {
    portalRequest.setBaseUri( "/admin/tool" );
    portalRequest.setRawPath( "/admin/tool/app/toolname" );

    runFunction( "lib/assetUrl-test.js", "testCreateAssetUrlOnAdminToolWithoutTrailingSlash" );

    verify( portalUrlService, times( 1 ) ).generateUrl( any( GenerateUrlParams.class ) );
  }
}
