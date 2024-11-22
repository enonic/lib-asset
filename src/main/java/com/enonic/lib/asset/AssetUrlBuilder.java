package com.enonic.lib.asset;

import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Objects;
import java.util.function.Supplier;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import com.google.common.base.Splitter;
import com.google.common.collect.HashMultimap;
import com.google.common.collect.Multimap;
import com.google.common.net.UrlEscapers;

import com.enonic.xp.content.ContentService;
import com.enonic.xp.portal.PortalRequest;
import com.enonic.xp.portal.url.UrlTypeConstants;
import com.enonic.xp.script.ScriptValue;
import com.enonic.xp.script.bean.BeanContext;
import com.enonic.xp.script.bean.ScriptBean;
import com.enonic.xp.site.Site;
import com.enonic.xp.web.servlet.ServletRequestUrlHelper;
import com.enonic.xp.web.servlet.UriRewritingResult;

import static com.google.common.base.Strings.isNullOrEmpty;

public class AssetUrlBuilder
  implements ScriptBean
{

  private static final Pattern ADMIN_SITE_CTX_PATTERN =
    Pattern.compile( "^(?<mode>edit|preview|admin|inline)/(?<project>[^/]+)/(?<branch>[^/]+)" );

  private static final Pattern SITE_CTX_PATTERN = Pattern.compile( "^(?<project>[^/]+)/(?<branch>[^/]+)" );

  private static final Pattern WEBAPP_CXT_PATTERN = Pattern.compile( "^([^/]+)" );

  private static final String ADMIN_SITE_PREFIX = "/admin/site/";

  private static final String TOOL_PREFIX_BASE = "/admin/tool";

  private static final String TOOL_PREFIX = TOOL_PREFIX_BASE + "/";

  private static final String NEW_TOOL_PREFIX_BASE = "/admin";

  private static final String NEW_TOOL_PREFIX = NEW_TOOL_PREFIX_BASE + "/";

  private static final String SITE_PREFIX = "/site/";

  private static final String WEBAPP_PREFIX = "/webapp/";

  private Supplier<PortalRequest> requestSupplier;

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
    final StringBuilder url = new StringBuilder();

    final PortalRequest portalRequest = requestSupplier.get();
    final String rawPath = portalRequest.getRawPath();

    if ( rawPath.startsWith( ADMIN_SITE_PREFIX ) )
    {
      processSite( url, rawPath, true );
    }
    else if ( rawPath.equals( TOOL_PREFIX_BASE ) || rawPath.startsWith( TOOL_PREFIX ) )
    {
      processTool( url );
    }
    else if ( rawPath.equals( NEW_TOOL_PREFIX_BASE ) || rawPath.startsWith( NEW_TOOL_PREFIX ) )
    {
      appendPart( url, "admin" );
    }
    else if ( rawPath.startsWith( SITE_PREFIX ) )
    {
      processSite( url, rawPath, false );
    }
    else if ( rawPath.startsWith( WEBAPP_PREFIX ) )
    {
      processWebapp( url, rawPath );
    }

    appendPart( url, "_" );
    appendPart( url, "service" );

    appendPart( url, Objects.requireNonNullElseGet( application, () -> portalRequest.getApplicationKey().toString() ) );
    appendPart( url, "asset" );

    appendPart( url, fingerprint );

    if ( !isNullOrEmpty( path ) )
    {
      appendPart( url, path.replaceAll( "/$", "" ) );
    }

    if ( params != null && !params.isEmpty() )
    {
      appendParams( url, params.entries() );
    }

    final String targetUri = url.toString();
    final UriRewritingResult rewritingResult = ServletRequestUrlHelper.rewriteUri( portalRequest.getRawRequest(), targetUri );

    if ( rewritingResult.isOutOfScope() )
    {
      throw new IllegalStateException( "URI out of scope" );
    }

    final String uri = rewritingResult.getRewrittenUri();

    if ( UrlTypeConstants.ABSOLUTE.equals( type ) )
    {
      return ServletRequestUrlHelper.getServerUrl( portalRequest.getRawRequest() ) + uri;
    }
    else
    {
      return uri;
    }
  }

  private void processSite( final StringBuilder url, final String requestURI, final boolean isSiteAdmin )
  {
    final String sitePrefix = isSiteAdmin ? ADMIN_SITE_PREFIX : SITE_PREFIX;
    final String subPath = subPath( requestURI, sitePrefix );
    final Pattern pattern = isSiteAdmin ? ADMIN_SITE_CTX_PATTERN : SITE_CTX_PATTERN;
    final Matcher matcher = pattern.matcher( subPath );
    if ( matcher.find() )
    {
      if ( isSiteAdmin )
      {
        appendPart( url, "admin" );
      }
      appendPart( url, "site" );
      if ( isSiteAdmin )
      {
        final String mode = matcher.group( "mode" );
        appendPart( url, "edit".equals( mode ) ? "preview" : mode );
      }
      appendPart( url, matcher.group( "project" ) );
      appendPart( url, matcher.group( "branch" ) );

      final ContentResolverResult contentResolverResult =
        new ContentResolver( contentServiceSupplier.get() ).resolve( requestSupplier.get() );
      final Site site = contentResolverResult.getNearestSite();
      if ( site != null )
      {
        appendPart( url, site.getPath().toString() );
      }
    }
    else
    {
      throw new IllegalArgumentException( String.format( "Invalid site context: %s", subPath ) );
    }
  }

  private void processWebapp( final StringBuilder url, final String requestURI )
  {
    final String subPath = subPath( requestURI, WEBAPP_PREFIX );
    final Matcher matcher = WEBAPP_CXT_PATTERN.matcher( subPath );

    if ( matcher.find() )
    {
      appendPart( url, "webapp" );
      appendPart( url, matcher.group( 0 ) );
    }
    else
    {
      throw new IllegalArgumentException( String.format( "Invalid webapp context: %s", subPath ) );
    }
  }

  private void processTool( final StringBuilder url )
  {
    appendPart( url, "admin" );
    appendPart( url, "tool" );
  }

  private String subPath( final String requestURI, final String prefix )
  {
    final int endpoint = requestURI.indexOf( "/_/" );
    final int endIndex = endpoint == -1 ? requestURI.length() : endpoint + 1;
    return requestURI.substring( prefix.length(), endIndex );
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
