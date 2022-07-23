export const formatDate = (date: number) => {
  return new Date(date * 1000).toLocaleDateString(['en'], {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })
}
