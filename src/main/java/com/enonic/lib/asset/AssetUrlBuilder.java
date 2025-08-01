package com.enonic.lib.asset;

import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.function.Supplier;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import com.google.common.base.Splitter;
import com.google.common.collect.HashMultimap;
import com.google.common.collect.Multimap;
import com.google.common.net.UrlEscapers;

import com.enonic.xp.app.ApplicationKey;
import com.enonic.xp.content.ContentService;
import com.enonic.xp.portal.PortalRequest;
import com.enonic.xp.portal.url.GenerateUrlParams;
import com.enonic.xp.portal.url.PortalUrlService;
import com.enonic.xp.repository.RepositoryUtils;
import com.enonic.xp.script.ScriptValue;
import com.enonic.xp.script.bean.BeanContext;
import com.enonic.xp.script.bean.ScriptBean;
import com.enonic.xp.site.Site;

import static com.google.common.base.Strings.isNullOrEmpty;

public class AssetUrlBuilder
  implements ScriptBean
{
  private Supplier<PortalRequest> requestSupplier;

  private Supplier<PortalUrlService> portalUrlServiceSupplier;

  private Supplier<ContentService> contentServiceSupplier;

  private String application;

  private String fingerprint;

  private Multimap<String, String> params;

  private String type;

  private String path;

  @Override
  public void initialize( final BeanContext beanContext )
  {
    this.requestSupplier = beanContext.getBinding( PortalRequest.class );
    this.portalUrlServiceSupplier = beanContext.getService( PortalUrlService.class );
    this.contentServiceSupplier = beanContext.getService( ContentService.class );
  }

  public void setApplication( final String application )
  {
    this.application = application;
  }

  public void setFingerprint( final String fingerprint )
  {
    this.fingerprint = fingerprint;
  }

  public void setParams( final ScriptValue params )
  {
    this.params = resolveParams( params == null ? new HashMap<>() : params.getMap() );
  }

  public void setType( final String type )
  {
    this.type = type;
  }

  public void setPath( final String path )
  {
    this.path = path;
  }

  public String createUrl()
  {
    final PortalRequest portalRequest = requestSupplier.get();

    final String assetPath = generateAssetPath( portalRequest );

    final GenerateUrlParams generateUrlParams = new GenerateUrlParams();
    generateUrlParams.portalRequest( portalRequest );
    generateUrlParams.type( type );
    generateUrlParams.url( assetPath );

    return portalUrlServiceSupplier.get().generateUrl( generateUrlParams );
  }

  private String generateAssetPath( final PortalRequest portalRequest )
  {
    final StringBuilder str = new StringBuilder();

    appendPart( str, portalRequest.getBaseUri() );
    if ( portalRequest.getBaseUri().equals( "/site" ) || portalRequest.getBaseUri().startsWith( "/admin/site/" ) )
    {
      appendPart( str, RepositoryUtils.getContentRepoName( portalRequest.getRepositoryId() ) );
      appendPart( str, portalRequest.getBranch().toString() );

      final Site nearestSite = new ContentResolver( contentServiceSupplier.get() ).resolve( portalRequest ).getNearestSite();
      if ( nearestSite != null )
      {
        appendPart( str, nearestSite.getPath().toString() );
      }
    }
    appendPart( str, "_" );
    appendPart( str, "service" );

    final ApplicationKey applicationKey = application != null ? ApplicationKey.from( application ) : portalRequest.getApplicationKey();

    appendPart( str, applicationKey.toString() );
    appendPart( str, "asset" );
    appendPart( str, fingerprint );

    if ( !isNullOrEmpty( path ) )
    {
      appendPart( str, path.replaceAll( "/$", "" ) );
    }

    if ( params != null && !params.isEmpty() )
    {
      appendParams( str, params.entries() );
    }

    return str.toString();
  }

  private void appendPart( final StringBuilder str, final String urlPart )
  {
    if ( isNullOrEmpty( urlPart ) )
    {
      return;
    }

    final boolean endsWithSlash = str.length() > 0 && str.charAt( str.length() - 1 ) == '/';
    final String normalized = normalizePath( urlPart );

    if ( !endsWithSlash )
    {
      str.append( "/" );
    }

    str.append( normalized );
  }

  private String normalizePath( final String value )
  {
    if ( !value.contains( "/" ) )
    {
      return urlEncodePathSegment( value );
    }

    return StreamSupport.stream( Splitter.on( '/' ).trimResults().omitEmptyStrings().split( value ).spliterator(), false ).map(
      this::urlEncodePathSegment ).collect( Collectors.joining( "/" ) );
  }

  private String urlEncodePathSegment( final String value )
  {
    return UrlEscapers.urlPathSegmentEscaper().escape( value );
  }

  private Multimap<String, String> resolveParams( final Object params )
  {
    final Multimap<String, String> result = HashMultimap.create();

    if ( params instanceof Map )
    {
      for ( final Map.Entry<?, ?> entry : ( (Map<?, ?>) params ).entrySet() )
      {
        final String key = entry.getKey().toString();
        final Object value = entry.getValue();
        if ( value instanceof Iterable )
        {
          for ( final Object v : (Iterable<?>) value )
          {
            result.put( key, v.toString() );
          }
        }
        else
        {
          result.put( key, value.toString() );
        }
      }
    }
    return result;
  }

  private void appendParams( final StringBuilder str, final Collection<Map.Entry<String, String>> params )
  {
    if ( params.isEmpty() )
    {
      return;
    }
    str.append( "?" );
    final Iterator<Map.Entry<String, String>> it = params.iterator();
    appendParam( str, it.next() );
    while ( it.hasNext() )
    {
      str.append( "&" );
      appendParam( str, it.next() );
    }
  }

  private void appendParam( final StringBuilder str, final Map.Entry<String, String> param )
  {
    final String value = param.getValue();
    str.append( urlEncode( param.getKey() ) );
    if ( value != null )
    {
      str.append( "=" ).append( urlEncode( value ) );
    }
  }

  public static String urlEncode( final String value )
  {
    return UrlEscapers.urlFormParameterEscaper().escape( value );
  }

}
