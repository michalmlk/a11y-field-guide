// Accessible form errors with live regions — vanilla JS

/** @param {HTMLElement} container */
export function mountFormErrorsDemo(container) {
  container.innerHTML = `
    <form class="a11y-form" novalidate aria-label="Registration form demo">
      <div class="form-field">
        <label for="demo-email">Email address <span aria-hidden="true">*</span><span class="sr-only">(required)</span></label>
        <input
          type="email"
          id="demo-email"
          aria-required="true"
          aria-describedby="email-error"
          autocomplete="email"
        />
        <span id="email-error" role="alert" class="field-error" aria-live="assertive"></span>
      </div>
      <div class="form-field">
        <label for="demo-name">Full name <span aria-hidden="true">*</span><span class="sr-only">(required)</span></label>
        <input
          type="text"
          id="demo-name"
          aria-required="true"
          aria-describedby="name-error"
          autocomplete="name"
        />
        <span id="name-error" role="alert" class="field-error" aria-live="assertive"></span>
      </div>
      <button type="submit" class="submit-btn">Submit</button>
      <div role="status" aria-live="polite" id="form-status" class="form-status"></div>
    </form>
  `

  const form = container.querySelector('form')

  form.addEventListener('submit', e => {
    e.preventDefault()
    let valid = true

    const email = form.querySelector('#demo-email')
    const emailError = form.querySelector('#email-error')
    const name = form.querySelector('#demo-name')
    const nameError = form.querySelector('#name-error')
    const status = form.querySelector('#form-status')

    if (!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      emailError.textContent = 'Please enter a valid email address.'
      email.setAttribute('aria-invalid', 'true')
      if (valid) email.focus()
      valid = false
    } else {
      emailError.textContent = ''
      email.removeAttribute('aria-invalid')
    }

    if (!name.value.trim()) {
      nameError.textContent = 'Full name is required.'
      name.setAttribute('aria-invalid', 'true')
      if (valid) name.focus()
      valid = false
    } else {
      nameError.textContent = ''
      name.removeAttribute('aria-invalid')
    }

    if (valid) {
      status.textContent = 'Form submitted successfully!'
    }
  })
}
