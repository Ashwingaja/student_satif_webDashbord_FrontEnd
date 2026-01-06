import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function getRatingColor(rating: number): string {
  if (rating >= 4) return 'text-green-500';
  if (rating >= 3) return 'text-yellow-500';
  return 'text-red-500';
}

export function getRatingBgColor(rating: number): string {
  if (rating >= 4) return 'bg-green-500/10';
  if (rating >= 3) return 'bg-yellow-500/10';
  return 'bg-red-500/10';
}

export function getSatisfactionColor(level: string): string {
  switch (level.toLowerCase()) {
    case 'high':
      return 'text-green-500';
    case 'medium':
      return 'text-yellow-500';
    case 'low':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
}

export function getRiskColor(risk: string): string {
  if (risk.includes('High')) return 'text-red-500';
  if (risk.includes('Moderate')) return 'text-yellow-500';
  return 'text-green-500';
}

export function getRiskBgColor(risk: string): string {
  if (risk.includes('High')) return 'bg-red-500/10';
  if (risk.includes('Moderate')) return 'bg-yellow-500/10';
  return 'bg-green-500/10';
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
