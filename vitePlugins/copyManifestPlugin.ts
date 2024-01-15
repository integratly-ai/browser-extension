import fs from 'fs';
import path from 'path';
import { Plugin } from 'vite';

export function copyManifestPlugin(): Plugin {
  return {
    name: 'copy-manifest',
    writeBundle: () => {
      const browser = process.env.BROWSER || 'chrome';
      const baseManifest = JSON.parse(
        fs.readFileSync(path.resolve(__dirname, '../manifests', 'manifest.base.json'), 'utf-8'),
      );
      const browserManifest = JSON.parse(
        fs.readFileSync(
          path.resolve(__dirname, '../manifests', `manifest.${browser}.json`),
          'utf-8',
        ),
      );

      const mergedManifest = { ...baseManifest, ...browserManifest };
      const destPath = path.resolve(__dirname, '../dist', 'manifest.json');

      fs.writeFileSync(destPath, JSON.stringify(mergedManifest, null, 2));
      console.log(`Merged manifest for ${browser} created successfully.`);
    },
  };
}
