
export const dateFomatter = (raw: Date | string | null | undefined): string => {
  if (!raw) return new Date().toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" });

  const d = raw instanceof Date ? raw : new Date(raw);
  if (Number.isNaN(d.getTime())) {
    return new Date().toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" });
  }

  return d.toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" });
};