export const storage = {
  async get(key: string) {
    try {
      const v = localStorage.getItem(key)
      return v === null ? null : { value: v }
    } catch (err) {
      console.error('storage.get error', err)
      return null
    }
  },

  async set(key: string, value: string) {
    try {
      localStorage.setItem(key, value)
      return true
    } catch (err) {
      console.error('storage.set error', err)
      return false
    }
  }
}
