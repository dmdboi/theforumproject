export function extractSlugsid(slugsid: string) {
  const slug = slugsid.slice(0, slugsid.lastIndexOf("-"));
  const sid = slugsid.slice(slugsid.lastIndexOf("-") + 1);
  return { slug, sid };
}
