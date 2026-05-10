// Focus trap demo — vanilla JS, no framework

/**
 * @param {HTMLElement} container
 * @param {{ theme: 'light' | 'dark' }} ctx
 */
export function mountModalDemo(container, ctx) {
  container.innerHTML = `
    <div class="modal-demo" data-theme="${ctx.theme}">
      <button class="demo-btn" id="open-modal">Open modal</button>
      <div role="dialog" aria-modal="true" aria-labelledby="dialog-title" class="dialog hidden" id="demo-dialog">
        <h2 id="dialog-title">Example Dialog</h2>
        <p>Focus is trapped inside this dialog while it is open. The dialog follows the app theme: <strong>${ctx.theme}</strong>.</p>
        <button class="demo-btn">Action</button>
        <button class="demo-btn" id="close-modal">Close</button>
      </div>
    </div>
  `

  const dialog = container.querySelector('#demo-dialog')
  const openBtn = container.querySelector('#open-modal')
  const closeBtn = container.querySelector('#close-modal')

  const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

  function trapFocus(e) {
    const focusable = [...dialog.querySelectorAll(focusableSelectors)]
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    if (e.key === 'Escape') close()
  }

  function open() {
    dialog.classList.remove('hidden')
    dialog.querySelector('button').focus()
    dialog.addEventListener('keydown', trapFocus)
  }

  function close() {
    dialog.classList.add('hidden')
    dialog.removeEventListener('keydown', trapFocus)
    openBtn.focus()
  }

  openBtn.addEventListener('click', open)
  closeBtn.addEventListener('click', close)

  return () => {
    openBtn.removeEventListener('click', open)
    closeBtn.removeEventListener('click', close)
    dialog.removeEventListener('keydown', trapFocus)
  }
}
