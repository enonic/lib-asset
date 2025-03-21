package com.enonic.lib.asset;

import org.junit.jupiter.api.Test;

import com.enonic.xp.resource.Resource;
import com.enonic.xp.resource.ResourceKey;
import com.enonic.xp.testing.ScriptTestSupport;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class IoServiceTest
  extends ScriptTestSupport
{
  private IoService bean;

  @Override
  protected void initialize()
    throws Exception
  {
    super.initialize();

    this.bean = new IoService();
    this.bean.initialize( newBeanContext( ResourceKey.from( "myapp:/test" ) ) );
  }

  @Test
  void readText()
    throws Exception
  {
    final String text1 = this.bean.readText( null );
    assertEquals( "", text1 );

    final String text2 = this.bean.readText( "value" );
    assertEquals( "", text2 );
  }

  @Test
  void getMimeType()
    throws Exception
  {
    final String type1 = this.bean.getMimeType( null );
    assertEquals( "application/octet-stream", type1 );

    final String type2 = this.bean.getMimeType( "test.txt" );
    assertEquals( "text/plain", type2 );
  }

  @Test
  void getResource()
  {
    final Resource res1 = this.bean.getResource( "/unknown.txt" );
    assertFalse( res1.exists() );

    final Resource res2 = this.bean.getResource( "./sample.txt" );
    assertTrue( res2.exists() );

    final Resource res3 = this.bean.getResource( ResourceKey.from( "myapp:/test/sample.txt" ) );
    assertTrue( res3.exists() );
  }
}
