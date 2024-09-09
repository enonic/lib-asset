export function getRootFromPath(path: string): string {
  // Remove leading and trailing slashes
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Split the path into segments
  const segments = trimmedPath.split('/');

  // Return the first segment (root folder)
  return segments[0] || '';
}
