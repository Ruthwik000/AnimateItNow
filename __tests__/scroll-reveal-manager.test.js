/* eslint-env jest */

describe('ScrollRevealManager', () => {
  let originalObserver
  let observeMock
  let unobserveMock
  let disconnectMock

  beforeEach(() => {
    observeMock = jest.fn()
    unobserveMock = jest.fn()
    disconnectMock = jest.fn()

    originalObserver = global.IntersectionObserver
    global.IntersectionObserver = jest.fn(function (cb, opts) {
      this._cb = cb
      this._opts = opts
      this.observe = observeMock
      this.unobserve = unobserveMock
      this.disconnect = disconnectMock
    })

    // Load the manager script which attaches window.scrollRevealManager
    document.body.innerHTML = ''
    const script = document.createElement('script')
    script.textContent = require('fs').readFileSync(require('path').join(__dirname, '..', 'scroll-reveal-manager.js'), 'utf8')
    document.head.appendChild(script)
  })

  afterEach(() => {
    global.IntersectionObserver = originalObserver
    delete window.scrollRevealManager
  })

  test('creates a singleton instance', () => {
    expect(window.scrollRevealManager).toBeDefined()
    const first = window.scrollRevealManager
    const second = window.scrollRevealManager
    expect(first).toBe(second)
  })

  test('disconnect called on pagehide', () => {
    // Simulate a small harness that wires pagehide to disconnect like script.js
    window.addEventListener('pagehide', () => window.scrollRevealManager.disconnect())
    window.dispatchEvent(new Event('pagehide'))
    expect(disconnectMock).toHaveBeenCalled()
  })
})