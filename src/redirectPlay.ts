const destination = new URL(import.meta.env.BASE_URL, window.location.origin)
destination.search = window.location.search
destination.hash = window.location.hash
window.location.replace(destination.href)
