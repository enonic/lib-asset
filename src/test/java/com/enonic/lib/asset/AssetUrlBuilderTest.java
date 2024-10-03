package com.enonic.lib.asset;

import javax.servlet.http.HttpServletRequest;

import org.junit.jupiter.api.Test;

import com.enonic.xp.content.ContentPath;
import com.enonic.xp.site.Site;
import com.enonic.xp.testing.ScriptTestSupport;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class AssetUrlBuilderTest
  extends ScriptTestSupport
{
  @Test
  void testCreateAssetUrlWebapp()
  {
    portalRequest.setRawPath( "/webapp/mywebapp" );

    runFunction( "lib/assetUrl-test.js", "createAssetUrlWebapp" );
  }

  @Test
  void testCreateAssetUrlAdminSiteOnProject()
  {
    when( contentService.findNearestSiteByPath( any( ContentPath.class ) ) ).thenReturn( null );

    portalRequest.setRawPath( "/admin/site/edit/project/branch/" );

    runFunction( "lib/assetUrl-test.js", "createAssetUrlAdminSiteOnProject" );
  }

  @Test
  void testCreateAssetUrlOnSite()
  {
    Site site = mock( Site.class );
    when( site.getPath() ).thenReturn( ContentPath.from( "/mysite" ) );
    when( contentService.findNearestSiteByPath( any( ContentPath.class ) ) ).thenReturn( site );

    portalRequest.setRawPath( "/site/project/branch/mysite" );

    runFunction( "lib/assetUrl-test.js", "createAssetUrlOnSite" );
  }

  @Test
  void testCreateAssetUrlOnAdminTool()
  {
    final HttpServletRequest req = mock( HttpServletRequest.class );
    when( req.getServerName() ).thenReturn( "localhost" );
    when( req.getScheme() ).thenReturn( "http" );
    when( req.getServerPort() ).thenReturn( 8080 );

    portalRequest.setRawRequest( req );
    portalRequest.setRawPath( "/admin/tool/" );

    runFunction( "lib/assetUrl-test.js", "createAssetUrlOnAdminTool" );
  }
}
