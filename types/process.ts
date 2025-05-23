import {
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'fs';
import {join} from 'path';
import { exit } from 'process';
import propertiesReader from 'properties-reader';

function readGradleProperty(filePath: string, propertyName: string): string | null | undefined {
  try {
    const properties = propertiesReader(filePath);
    const propertyValue = properties.get(propertyName) as string | null;
    return propertyValue;
  } catch (error) {
    console.error(`Error reading Gradle property: ${error}`);
    return undefined;
  }
}

function replaceInFile(filePath: string, searchValue: string, replaceValue: string) {
  const content = readFileSync(filePath, 'utf8');
  const updatedContent = content.replace(new RegExp(searchValue, 'g'), replaceValue);
  writeFileSync(filePath, updatedContent, 'utf8');
}

function replaceInDir(dir: string, searchValue: string, replaceValue: string) {
  const files = readdirSync(dir);
  files.forEach(file => {
    const filePath = join(dir, file);
    if (statSync(filePath).isDirectory()) {
      replaceInDir(filePath, searchValue, replaceValue);
    } else {
      replaceInFile(filePath, searchValue, replaceValue);
    }
  });
}

// function prefixFile(filePath: string, message: string) {
//   const content = readFileSync(filePath, 'utf8');
//   const updatedContent = `${message}\n${content}`;
//   writeFileSync(filePath, updatedContent, 'utf8');
// }

function copyFile(from: string, to: string) {
  writeFileSync(to, readFileSync(from, 'utf8'), 'utf8');
}

function copyReplaceAndRename(from: string, to: string, searchValue: string, replaceValue: string) {
  const content = readFileSync(from, 'utf8');
  const updatedContent = content.replace(new RegExp(searchValue, 'g'), replaceValue);
  writeFileSync(to, updatedContent, 'utf8');
}

replaceInDir('./build/types', '/lib/enonic/asset', '.');

// This must come after the above replacements to avoid /lib/enonic/asset becoming . in the README.md
copyFile('types/README.md', 'build/types/README.md');

// prefixFile('build/types/index.d.ts', `declare global {
//   interface XpLibraries {
//     '/lib/enonic/asset': typeof import('./index');
//   }
// }`);

const version = readGradleProperty('gradle.properties', 'version');

if (version) {
  copyReplaceAndRename('types/package.template.json', 'build/types/package.json', '%VERSION%', version);
} else {
  console.error('Unable to read version from gradle.properties!!!');
  exit(1);
}

const xpVersion = readGradleProperty('gradle.properties', 'xpVersion');
if (xpVersion) {
  copyReplaceAndRename('build/types/package.json', 'build/types/package.json', '%XP_VERSION%', xpVersion);
} else {
  console.error('Unable to read version from gradle.properties!!!');
  exit(1);
}


