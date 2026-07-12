const MINIMUM_HTML_FONT_SCALE = 0.5
const MAXIMUM_HTML_FONT_SCALE = 2

let htmlFontScale = 1

export function getHtmlFontScale(): number {
  return htmlFontScale
}

export function setHtmlFontScale(value: number): void {
  htmlFontScale = Number.isFinite(value)
    ? Math.min(
        MAXIMUM_HTML_FONT_SCALE,
        Math.max(MINIMUM_HTML_FONT_SCALE, value),
      )
    : 1
}

export function scaleHtmlFontSize(value: number): number {
  return Math.max(1, Math.round(value * htmlFontScale))
}
