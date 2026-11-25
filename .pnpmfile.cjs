/**
 * Temporary bridge until typescript-eslint supports TypeScript 7.
 * Provides @typescript/typescript6 (TS 6.0 compiler API) exclusively to
 * eslint-config-next and typescript-eslint packages so the project itself,
 * `tsc`, and `next build` run on TypeScript 7.
 *
 * Tracking: https://github.com/typescript-eslint/typescript-eslint/issues/10940
 */
function readPackage(pkg) {
  if (
    pkg.name === 'eslint-config-next' ||
    pkg.name === 'typescript-eslint' ||
    (pkg.name && pkg.name.startsWith('@typescript-eslint/'))
  ) {
    if (pkg.peerDependencies && pkg.peerDependencies.typescript) {
      delete pkg.peerDependencies.typescript;
      if (pkg.peerDependenciesMeta && pkg.peerDependenciesMeta.typescript) {
        delete pkg.peerDependenciesMeta.typescript;
      }
      pkg.dependencies = {
        ...pkg.dependencies,
        typescript: 'npm:@typescript/typescript6@^6.0.2',
      };
    }
  }
  return pkg;
}

module.exports = {
  hooks: {
    readPackage,
  },
};
