const THEME_KEY = 'my-diary-theme'

export type ThemeMode = 'light' | 'dark'

export const themeService = {
  getTheme(): ThemeMode {
    return (localStorage.getItem(THEME_KEY) as ThemeMode) ?? 'light'
  },
  setTheme(theme: ThemeMode) {
    localStorage.setItem(THEME_KEY, theme)
    document.documentElement.dataset.theme = theme
  },
  toggleTheme() {
    const nextTheme = this.getTheme() === 'light' ? 'dark' : 'light'
    this.setTheme(nextTheme)
    return nextTheme
  },
}
