package com.enonic.lib.asset;

import java.util.function.Supplier;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.enonic.xp.app.ApplicationKey;
import com.enonic.xp.content.ContentService;
import com.enonic.xp.portal.PortalRequest;
import com.enonic.xp.project.Project;
import com.enonic.xp.project.ProjectName;
import com.enonic.xp.project.ProjectService;
import com.enonic.xp.script.bean.BeanContext;
import com.enonic.xp.script.bean.ScriptBean;
import com.enonic.xp.site.Site;
import com.enonic.xp.web.WebException;

public class RequestVerifierHandler
  implements ScriptBean
{
  private static final Pattern PATTERN = Pattern.compile( "^/_/service/(?<appKey>[^/]+)/asset/?" );

  private static final Pattern WEBAPP_PATTERN = Pattern.compile( "^/webapp/(?<baseAppKey>[^/]+)/_/service/(?<appKey>[^/]+)/asset/?" );

  private PortalRequest request;

  private Supplier<ContentService> contentServiceSupplier;

  private Supplier<ProjectService> projectServiceSupplier;

  @Override
  public void initialize( final BeanContext beanContext )
  {
    this.request = beanContext.getBinding( PortalRequest.class ).get();
    this.contentServiceSupplier = beanContext.getService( ContentService.class );
    this.projectServiceSupplier = beanContext.getService( ProjectService.class );
  }

  public boolean verify()
  {
    final String endpointPath = request.getEndpointPath();

    if ( endpointPath == null )
    {
      return false;
    }

    final Matcher matcher = PATTERN.matcher( endpointPath );
    if ( !matcher.find() )
    {
      return false;
    }

    final ApplicationKey applicationKey = resolveApplicationKey( matcher.group( "appKey" ) );

    final String rawPath = request.getRawPath();

    if ( rawPath.startsWith( "/site/" ) || rawPath.startsWith( "/admin/site/" ) )
    {
      return verifyRequestMountedOnSites( applicationKey, request );
    }
    else if ( rawPath.startsWith( "/webapp/" ) )
    {
      return verifyPathMountedOnWebapps( applicationKey, request );
    }
    else
    {
      return rawPath.startsWith( "/admin/tool/_/service/" );
    }
  }

  private boolean verifyRequestMountedOnSites( final ApplicationKey applicationKey, final PortalRequest portalRequest )
  {
    final ContentResolverResult contentResolverResult = new ContentResolver( contentServiceSupplier.get() ).resolve( portalRequest );

    final Site site = contentResolverResult.getNearestSite();

    final boolean isAppInstalledOnSite = site != null && site.getSiteConfigs().get( applicationKey ) != null;

    if ( !isAppInstalledOnSite )
    {
      final Project project = projectServiceSupplier.get().get( ProjectName.from( request.getRepositoryId() ) );
      if ( project == null || project.getSiteConfigs().get( applicationKey ) == null )
      {
        return false;
      }
      else
      {
        return "/".equals( contentResolverResult.getSiteRelativePath() );
      }
    }
    else
    {
      return site.getPath().toString().equals( contentResolverResult.getSiteRelativePath() );
    }
  }

  private boolean verifyPathMountedOnWebapps( final ApplicationKey applicationKey, final PortalRequest portalRequest )
  {
    final Matcher matcher = WEBAPP_PATTERN.matcher( portalRequest.getRawPath() );
    if ( !matcher.find() )
    {
      return false;
    }

    final ApplicationKey baseAppKey = resolveApplicationKey( matcher.group( "baseAppKey" ) );
    return baseAppKey.equals( applicationKey );
  }

  private ApplicationKey resolveApplicationKey( final String appKey )
  {
    try
    {
      return ApplicationKey.from( appKey );
    }
    catch ( Exception e )
    {
      throw WebException.notFound( String.format( "Application key [%s] not found", appKey ) );
    }
  }
}
