# Asset library

## Documentation
[Asset library usage guide](https://developer.enonic.com/docs/lib-asset)

## Development

### Usage
Insert into `build.gradle` of your XP project, under `dependencies`, where `<version>` is the latest/requested version of this library - for example `1.0.0`:

```groovy
dependencies {
	include 'com.enonic.lib:lib-asset:<version>'
}

repositories {
    maven {
        url 'http://repo.enonic.com/public'
    }
}
```

<br/>

### Import
In any [XP controller](https://developer.enonic.com/docs/xp/stable/framework/controllers), import the library:

JavaScript:
```javascript
const libAsset = require('/lib/enonic/asset');
```

TypeScript:
```typescript
import { assetUrl } from '/lib/enonic/asset';
```

### Types

[Types for Asset library on NPM](https://www.npmjs.com/package/@enonic-types/lib-asset)
