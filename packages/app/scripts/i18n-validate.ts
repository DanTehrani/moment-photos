import * as path from 'path';
import en from '../src/translations/en.json';
import ja from '../src/translations/ja.json';
import fs from 'fs';
import * as glob from 'glob';

const translations = [
  {
    lang: 'en',
    translation: en,
  },
  {
    lang: 'ja',
    translation: ja,
  },
];

// 1. Use glob to find all TSX files in a directory (e.g., ./src)
const tsxFiles = glob.sync('src/**/*.tsx', {
  absolute: true, // Get absolute paths
});

// Load all translation files

for (const filePath of tsxFiles) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath, path.extname(filePath));

  if (fileName.includes('stories')) {
    continue;
  }

  // Extract all t() calls
  const regex = /t\(['"]([^:'"]+):([^'"]+)['"]\)/g;
  const matches = fileContent.matchAll(regex);

  if (!matches) {
    continue;
  }

  for (const match of matches) {
    const ns = match[1];
    const key = match[2];

    for (const { lang, translation } of translations) {
      const _expectedTranslation = translation[ns]?.[key];

      if (!_expectedTranslation) {
        // eslint-disable-next-line no-console
        console.log(`${lang} Translation not found for ${ns}:${key}`);
      }
    }
  }
}
