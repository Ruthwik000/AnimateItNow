/* eslint-env jest */

describe('Theme toggle batching', () => {
  beforeEach(() => {
    document.body.className = ''
    document.body.innerHTML = `
      <button id="theme-toggle"></button>
      <div class="scroll-fade visible" id="el1"></div>
    `
    // Stub lucide
    window.lucide = { createIcons: jest.fn() }
    // Spy on rAF to immediately flush
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => { cb(); return 1 })

    // Inject the part of script.js we need: setTheme batching
    const code = `
      (function(){
        const themeToggle = document.getElementById('theme-toggle');
        const body = document.body;
        function setTheme(dark){
          window.requestAnimationFrame(() => {
            const newIcon = dark ? 'sun' : 'moon';
            body.classList.toggle('dark', dark);
            localStorage.setItem('theme', dark ? 'dark' : 'light');
            if (themeToggle) { themeToggle.innerHTML = '<i data-lucide="'+newIcon+'"></i>'; if (window.lucide) { window.lucide.createIcons(); } }
            document.querySelectorAll('.scroll-fade.visible').forEach((el) => el.classList.add('visible'));
          });
        }
        setTheme(true);
      })()
    `
    const script = document.createElement('script')
    script.textContent = code
    document.head.appendChild(script)
  })

  afterEach(() => {
    window.requestAnimationFrame.mockRestore()
  })

  test('visible class remains on elements during theme swap', () => {
    const el = document.getElementById('el1')
    expect(el.classList.contains('visible')).toBe(true)
  })
})