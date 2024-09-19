export function mockEtagService({
  resources = {},
}: {
  resources?: Record<string, {
    bytes?: string
    exists?: boolean
    etag?: string
    mimeType?: string
  }>
}): {
  getEtag: (path: string) => {
      etag: string;
  };
} {
  return {
    getEtag: (path: string) => {
      const name = path.replace(/^com\.example\.myproject:/, '');
      // console.debug('getEtag', {name, path, etagOverride});
      const resource = resources[name];
      if (resource) {
        return {
          etag: resource.etag ? `"${resource.etag}"` : undefined,
        };
      }
      throw new Error(`getEtag: Unmocked path:${path}`);
      // throw new Error(`getEtag: Unmocked path:${path} etagOverride:${etagOverride}!`);
    },
  }
}
