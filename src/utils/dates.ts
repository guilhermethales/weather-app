export const formatDate = (date: number) => {
  return new Date(date * 1000).toLocaleDateString(['en'], {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    weekday: 'long'
  })
}
