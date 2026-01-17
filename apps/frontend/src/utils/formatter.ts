
export const dateFomatter = (raw: string | null | undefined): string => {
  if (!raw) return "";

  let time = new Date(raw);

  return time.toLocaleString().slice(0,-3);
};