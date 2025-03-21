package com.enonic.lib.asset;

import java.nio.charset.StandardCharsets;
import java.util.Objects;
import java.util.function.Supplier;

import com.google.common.io.ByteSource;
import com.google.common.io.CharSource;
import com.google.common.net.MediaType;

import com.enonic.xp.resource.Resource;
import com.enonic.xp.resource.ResourceKey;
import com.enonic.xp.resource.ResourceService;
import com.enonic.xp.script.bean.BeanContext;
import com.enonic.xp.script.bean.ScriptBean;
import com.enonic.xp.util.MediaTypes;

public class IoService
  implements ScriptBean
{
  private Supplier<ResourceService> resourceServiceSupplier;

  private BeanContext beanContext;

  @Override
  public void initialize( final BeanContext beanContext )
  {
    this.beanContext = beanContext;
    this.resourceServiceSupplier = beanContext.getService( ResourceService.class );
  }

  public String readText( final Object value )
    throws Exception
  {
    final CharSource source = toCharSource( value );
    return source.read();
  }

  public String getMimeType( final Object key )
  {
    if ( key == null )
    {
      return MediaType.OCTET_STREAM.toString();
    }

    return MediaTypes.instance().fromFile( key.toString() ).toString();
  }

  public Resource getResource( final Object key )
  {
    final ResourceKey resourceKey = toResourceKey( key );
    return resourceServiceSupplier.get().getResource( resourceKey );
  }

  private CharSource toCharSource( final Object value )
  {
    return toByteSource( value ).asCharSource( StandardCharsets.UTF_8 );
  }

  private ByteSource toByteSource( final Object value )
  {
    if ( value instanceof ByteSource )
    {
      return (ByteSource) value;
    }

    return ByteSource.empty();
  }

  private ResourceKey toResourceKey( final Object value )
  {
    if ( value instanceof ResourceKey )
    {
      return (ResourceKey) value;
    }
    else
    {
      return beanContext.getResourceKey().resolve( Objects.requireNonNull( value ).toString() );
    }
  }
}
