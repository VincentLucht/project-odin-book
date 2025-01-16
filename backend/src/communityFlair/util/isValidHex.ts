import tinycolor from 'tinycolor2';

export default function isValidHex(color: string): boolean {
  if (!color.startsWith('#')) {
    throw new Error('Color must be a valid hex code starting with "#"');
  }
  return tinycolor(color).isValid();
}
