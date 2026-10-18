/** Joins class names, skipping empty ones. (shadcn's `cn`, without the merge step this app has no need for.) */
export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
