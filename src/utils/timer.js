const timer = () => {
  const startMillis = Date.now()
  return () => {
    const elapsed = Date.now() - startMillis
    return (elapsed / 1000).toFixed(1)
  }
}

export default timer
