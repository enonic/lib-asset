package com.enonic.lib.asset.etag;

import com.google.common.hash.Hashing;


public class Hasher
{
    public String getHash( byte[] contentBytes )
    {
        return Hashing.farmHashFingerprint64().
            hashBytes( contentBytes ).
            toString();
    }
}
