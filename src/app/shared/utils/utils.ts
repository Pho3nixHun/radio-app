export const isIpv4 = (ip: string) => /^(\d{1,3}\.){3}\d{1,3}$/.test(ip);

export const toUrl = (url?: string, fallback = null, exclude = ['null']) => {
  const tUrl = url?.trim() ?? '';
  if (exclude.includes(tUrl)) return fallback;
  return tUrl ? new URL(tUrl) : fallback;
}

export const toEnum = <T>(str: string, enumType: T, fallback: T[keyof T]): T[keyof T] => enumType[str as keyof T];
export const toNumber = (str: string | number, fallback: number): number => parseInt(str.toString(), 10) || fallback;
