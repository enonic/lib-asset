package com.enonic.lib.asset;

import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.enonic.xp.branch.Branch;
import com.enonic.xp.content.ContentPath;
import com.enonic.xp.portal.url.ApiUrlParams;
import com.enonic.xp.portal.url.PortalUrlService;
import com.enonic.xp.repository.RepositoryId;
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

    when( portalUrlService.apiUrl( any( ApiUrlParams.class ) ) ).thenAnswer( invocation -> {
      ApiUrlParams params = invocation.getArgument( 0 );

      String strippedRawPath = portalRequest.getRawPath().replaceAll( "/+$", "" );
      String mountPath = !strippedRawPath.isEmpty()
        ? strippedRawPath
        : portalRequest.getBaseUri();

      String pathStr = params.getPathSegments().stream()
        .map( s -> s.replaceAll( "^/+|/+$", "" ) )
        .filter( s -> !s.isEmpty() )
        .collect( Collectors.joining( "/" ) );
      String url = mountPath + "/_/" + params.getApi() + "/" + pathStr;

      Map<String, List<String>> queryParams = params.getQueryParams();
      if ( queryParams == null || queryParams.isEmpty() )
      {
        return url;
      }
      String query = queryParams.entrySet().stream()
        .flatMap( e -> e.getValue().stream().map( v -> e.getKey() + "=" + v ) )
        .collect( Collectors.joining( "&" ) );
      return url + "?" + query;
    } );
  }

  @Test
  void testCreateAssetUrlWebapp()
  {
    portalRequest.setBaseUri( "/webapp/mywebapp" );
    portalRequest.setMode( null );
    runFunction( "lib/assetUrl-test.js", "createAssetUrlWebapp" );
  }

  @Test
  void testCreateAssetUrlAdminSiteOnProject()
  {
    portalRequest.setRepositoryId( RepositoryId.from( "com.enonic.cms.project" ) );
    portalRequest.setBranch( Branch.from( "branch" ) );
    portalRequest.setBaseUri( "/admin/site/preview" );
    portalRequest.setRawPath( "/admin/site/preview/project/branch/" );
    portalRequest.setContentPath( ContentPath.ROOT );

    runFunction( "lib/assetUrl-test.js", "createAssetUrlAdminSiteOnProject" );

    verify( portalUrlService, times( 1 ) ).apiUrl( any( ApiUrlParams.class ) );
  }

  @Test
  void testCreateAssetUrlOnSite()
  {
    portalRequest.setRepositoryId( RepositoryId.from( "com.enonic.cms.project" ) );
    portalRequest.setBranch( Branch.from( "branch" ) );
    portalRequest.setBaseUri( "/site" );
    portalRequest.setRawPath( "/site/project/branch/mysite" );
    portalRequest.setContentPath( ContentPath.from( "/mysite" ) );

    runFunction( "lib/assetUrl-test.js", "createAssetUrlOnSite" );

    verify( portalUrlService, times( 1 ) ).apiUrl( any( ApiUrlParams.class ) );
  }

  @Test
  void testCreateAssetUrlOnAdminTool()
  {
    portalRequest.setBaseUri( "/admin" );
    portalRequest.setRawPath( "/admin/app/toolname/" );
    portalRequest.setMode( null );

    runFunction( "lib/assetUrl-test.js", "createAssetUrlOnAdminTool" );

    verify( portalUrlService, times( 1 ) ).apiUrl( any( ApiUrlParams.class ) );
  }

  @Test
  void testCreateAssetUrlOnAdminToolXP8()
  {
    portalRequest.setBaseUri( "/admin" );
    portalRequest.setRawPath( "/admin/app/toolname" );
    portalRequest.setMode( null );

    runFunction( "lib/assetUrl-test.js", "createAssetUrlOnAdminToolXP8" );

    verify( portalUrlService, times( 1 ) ).apiUrl( any( ApiUrlParams.class ) );
  }

  @Test
  void testCreateAssetUrlOnAdminToolWithoutTrailingSlash()
  {
    portalRequest.setBaseUri( "/admin" );
    portalRequest.setRawPath( "/admin/app/toolname" );
    portalRequest.setMode( null );

    runFunction( "lib/assetUrl-test.js", "testCreateAssetUrlOnAdminToolWithoutTrailingSlash" );

    verify( portalUrlService, times( 1 ) ).apiUrl( any( ApiUrlParams.class ) );
  }
}
