let loadingCount = 0

export function startLoading() {
  loadingCount += 1
  return loadingCount
}

export function stopLoading() {
  loadingCount = Math.max(0, loadingCount - 1)
  return loadingCount
}

export function isLoading() {
  return loadingCount > 0
}
