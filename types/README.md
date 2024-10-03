# Types for Asset library

## Install

```bash
npm i --save-dev @enonic-types/lib-asset
```

## Setup

Add lib-asset to compilerOptions.paths in the tsconfig.json file:

```json
{
  "compilerOptions": {
    "paths": {
      "/lib/enonic/asset": ["node_modules/@enonic-types/lib-asset"],
    }
  }
}
```

## Use

```typescript
import {assetUrl} from '/lib/enonic/asset';
```

assetUrl should now be typed.
