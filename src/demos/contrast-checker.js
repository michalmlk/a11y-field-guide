// Canvas-based contrast ratio checker — vanilla JS

/** @param {HTMLElement} container */
export function mountContrastChecker(container) {
  container.innerHTML = `
    <form class="contrast-form" aria-label="Contrast checker">
      <div class="field-group">
        <label for="fg-color">Foreground color</label>
        <input type="color" id="fg-color" value="#000000" />
      </div>
      <div class="field-group">
        <label for="bg-color">Background color</label>
        <input type="color" id="bg-color" value="#ffffff" />
      </div>
      <div class="contrast-preview" id="contrast-preview" aria-live="polite">
        <span id="sample-text">Sample text</span>
        <p id="contrast-result"></p>
      </div>
    </form>
  `

  const fgInput = container.querySelector('#fg-color')
  const bgInput = container.querySelector('#bg-color')
  const preview = container.querySelector('#contrast-preview')
  const sampleText = container.querySelector('#sample-text')
  const result = container.querySelector('#contrast-result')

  function hexToRgb(hex) {
    const n = parseInt(hex.slice(1), 16)
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  }

  function luminance([r, g, b]) {
    return [r, g, b].map(c => {
      const s = c / 255
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
    }).reduce((acc, c, i) => acc + c * [0.2126, 0.7152, 0.0722][i], 0)
  }

  function contrastRatio(fg, bg) {
    const l1 = luminance(hexToRgb(fg))
    const l2 = luminance(hexToRgb(bg))
    const lighter = Math.max(l1, l2)
    const darker = Math.min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)
  }

  function update() {
    const fg = fgInput.value
    const bg = bgInput.value
    preview.style.background = bg
    sampleText.style.color = fg
    const ratio = contrastRatio(fg, bg)
    const aa = ratio >= 4.5
    const aaa = ratio >= 7
    result.textContent = `Ratio: ${ratio.toFixed(2)}:1 — AA: ${aa ? 'Pass' : 'Fail'} / AAA: ${aaa ? 'Pass' : 'Fail'}`
    result.style.color = fg
  }

  fgInput.addEventListener('input', update)
  bgInput.addEventListener('input', update)
  update()
}
