// Function to handle in-page navigation
export const scrollToElement = (id: string) => {
  if (typeof window === 'undefined') return
  // Remove the # if it's included
  window.history.pushState(null, '', `#${id}`) // Update the URL without reloading

  const element = document.getElementById(id)
  if (element) {
    // Smooth scroll to the element
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
}
