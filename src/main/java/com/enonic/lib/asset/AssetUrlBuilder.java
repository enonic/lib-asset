package com.enonic.lib.asset;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Supplier;
import java.util.stream.StreamSupport;

import com.enonic.xp.descriptor.DescriptorKey;
import com.enonic.xp.portal.url.ApiUrlParams;
import com.enonic.xp.portal.url.PortalUrlService;
import com.enonic.xp.script.ScriptValue;
import com.enonic.xp.script.bean.BeanContext;
import com.enonic.xp.script.bean.ScriptBean;

public class AssetUrlBuilder
  implements ScriptBean
{
  private Supplier<PortalUrlService> portalUrlServiceSupplier;

  private String application;

  private String fingerprint;

  private Map<String, List<String>> params;

  private String type;

  private String path;

  @Override
  public void initialize( final BeanContext beanContext )
  {
    this.portalUrlServiceSupplier = beanContext.getService( PortalUrlService.class );
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
    this.params = resolveQueryParams( params );
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
    final List<String> pathSegments = new ArrayList<>();
    pathSegments.add( this.fingerprint );

    if ( path != null )
    {
      pathSegments.addAll( Arrays.stream( path.split( "/" ) ).toList() );
    }

    final ApiUrlParams.Builder builder = ApiUrlParams.create()
      .setApi( DescriptorKey.from( application + ":asset" ) )
      .setType( this.type )
      .setPathSegments( pathSegments );

    if ( params != null && !params.isEmpty() )
    {
      builder.setQueryParams( params );
    }

    return this.portalUrlServiceSupplier.get().apiUrl( builder.build() );
  }

  private Map<String, List<String>> resolveQueryParams( final ScriptValue params )
  {
    if ( params == null )
    {
      return null;
    }

    final Map<String, List<String>> result = new LinkedHashMap<>();

    for ( final Map.Entry<String, Object> param : params.getMap().entrySet() )
    {
      final Object value = param.getValue();
      if ( value instanceof Iterable<?> values )
      {
        result.put( param.getKey(), StreamSupport.stream( values.spliterator(), false ).map( Object::toString ).toList() );
      }
      else
      {
        result.put( param.getKey(), List.of( value.toString() ) );
      }
    }

    return result;
  }
}
