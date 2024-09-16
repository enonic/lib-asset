package com.enonic.lib.asset;

import java.util.Objects;

import com.enonic.xp.app.ApplicationKey;
import com.enonic.xp.context.ContextAccessor;
import com.enonic.lib.asset.HexCoder;
import com.enonic.xp.resource.Resource;
import com.enonic.xp.resource.ResourceKey;
import com.enonic.xp.resource.ResourceService;
import com.enonic.xp.script.bean.BeanContext;
import com.enonic.xp.script.bean.ScriptBean;
import com.enonic.xp.server.RunMode;

public class AppHelper implements ScriptBean
{
  protected ResourceService resourceService;

  public boolean isDevMode()
  {
    return RunMode.get() == RunMode.DEV;
  }

  public String getFingerprint(String application) {
    if (isDevMode())
    {
      return String.valueOf(stableTime());
    }

    final ApplicationKey applicationKey = ApplicationKey.from( application );

    final Resource resource = this.resourceService.getResource( ResourceKey.from( applicationKey, "META-INF/MANIFEST.MF" ) );
    if ( !resource.exists() )
    {
      throw new IllegalArgumentException( "Could not find application [" + applicationKey + "]" );
    }
    return HexCoder.toHex(resource.getTimestamp());
  }

  @Override
  public void initialize( final BeanContext context )
  {
      this.resourceService = context.getService( ResourceService.class ).get();
  }

  private static long stableTime()
  {
    final Long localScopeTime = (Long) ContextAccessor.current().getLocalScope().getAttribute( "__currentTimeMillis" );
    return Objects.requireNonNullElseGet( localScopeTime, System::currentTimeMillis );
  }
}
