package com.enonic.lib.asset;

import com.google.common.net.MediaType;

import com.enonic.xp.script.bean.BeanContext;
import com.enonic.xp.script.bean.ScriptBean;
import com.enonic.xp.util.MediaTypes;

public class IoService
    implements ScriptBean
{
    public String getMimeType( final Object key )
    {
        if ( key == null )
        {
            return MediaType.OCTET_STREAM.toString();
        }

        return MediaTypes.instance().fromFile( key.toString() ).toString();
    }

    @Override
    public void initialize( BeanContext context )
    {
    }
}
