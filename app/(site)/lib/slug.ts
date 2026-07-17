const PREFIX = "proj-";

export function idToSlug(id: string): string {
  return id.startsWith(PREFIX) ? id.slice(PREFIX.length) : id;
}

export function slugToId(slug: string): string {
  return slug.startsWith(PREFIX) ? slug : `${PREFIX}${slug}`;
}
