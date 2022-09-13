const pathQueryGenerator = (request: Record<string, string | null | boolean | number>): string =>
  Object.entries(request).reduce((acc, [key, value]) => {
    if (!acc) return value ? `?${key}=${value}` : acc
    return value ? `${acc}&${key}=${value}` : acc
  }, '')

export default pathQueryGenerator
