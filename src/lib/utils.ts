import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn (...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalizeFirstLetter (string: string) {
  if (!string) return

  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function formatDate (dateString: string): string {
  const date = new Date(dateString)

  return new Intl.DateTimeFormat('es-Es', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

export function capitalizeString (str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
