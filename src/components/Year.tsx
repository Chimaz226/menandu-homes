/**
 * Current year, cached at build time. Next 16 Cache Components forbids a bare
 * new Date() during prerender; "use cache" makes it a deliberate snapshot that
 * refreshes on each deploy.
 */
export async function Year() {
  "use cache";
  return <>{new Date().getFullYear()}</>;
}
