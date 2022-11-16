export const UtilService = {
  capitalizeFirstLetter: (str: string): string => str.charAt(0).toUpperCase() + str.slice(1),

  replaceLineToSpace: (str: string): string => str.toLowerCase().replace(' ', '-'),

  replaceSpaceToLine: (str: string): string => str.replace('-', ' '),

  capitalizeString: (str: string): string =>
    str
      .split(' ')
      .map((word: string): string => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
}
