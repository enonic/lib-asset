export function generateErrorId() {
  return Math.floor(Math.random() * 1000000000000000).toString(36);
}
