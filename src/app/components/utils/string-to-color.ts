export function stringToRGBColor(nickname: string): string {
  if (!nickname) return "#ffffff";
  let hash = 0;
  for (let i = 0; i < nickname.length; i++) {
    // tslint:disable-next-line: no-bitwise
    hash = nickname.charCodeAt(i) + ((hash << 5) - hash);
  }
  // tslint:disable-next-line: no-bitwise
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  const hex = "00000".substring(0, 6 - c.length) + c;
  return `#${hex}`;
}
