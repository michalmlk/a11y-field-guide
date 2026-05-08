// Custom ARIA listbox dropdown — vanilla JS

/** @param {HTMLElement} container */
export function mountDropdownDemo(container) {
  const options = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry']

  container.innerHTML = `
    <div class="dropdown-wrapper">
      <label id="fruit-label">Choose a fruit</label>
      <button
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded="false"
        aria-labelledby="fruit-label"
        aria-controls="fruit-listbox"
        class="dropdown-trigger"
        id="fruit-trigger"
      >Select…</button>
      <ul
        role="listbox"
        id="fruit-listbox"
        aria-labelledby="fruit-label"
        class="dropdown-list hidden"
        tabindex="-1"
      >
        ${options.map((o, i) => `<li role="option" aria-selected="false" data-index="${i}" tabindex="-1">${o}</li>`).join('')}
      </ul>
    </div>
  `

  const trigger = container.querySelector('#fruit-trigger')
  const listbox = container.querySelector('#fruit-listbox')
  const items = [...listbox.querySelectorAll('[role="option"]')]
  let activeIndex = -1

  function open() {
    listbox.classList.remove('hidden')
    trigger.setAttribute('aria-expanded', 'true')
    if (activeIndex >= 0) items[activeIndex].focus()
    else items[0].focus()
  }

  function close() {
    listbox.classList.add('hidden')
    trigger.setAttribute('aria-expanded', 'false')
    trigger.focus()
  }

  function select(index) {
    items.forEach(item => item.setAttribute('aria-selected', 'false'))
    items[index].setAttribute('aria-selected', 'true')
    trigger.textContent = items[index].textContent
    activeIndex = index
    close()
  }

  trigger.addEventListener('click', () =>
    listbox.classList.contains('hidden') ? open() : close()
  )

  trigger.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      open()
    }
  })

  listbox.addEventListener('keydown', e => {
    const current = items.indexOf(document.activeElement)
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      items[Math.min(current + 1, items.length - 1)].focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      items[Math.max(current - 1, 0)].focus()
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (current >= 0) select(current)
    } else if (e.key === 'Escape') {
      close()
    }
  })

  items.forEach((item, i) => {
    item.addEventListener('click', () => select(i))
  })
}
