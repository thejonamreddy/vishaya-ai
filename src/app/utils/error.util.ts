import { toast } from "sonner"

export function showError(error: any) {
  let title = 'Something went wrong'
  let description = 'Please try again later'

  if (error instanceof Error) {
    title = error.name || title
    description = error.message || description
  }

  toast(title, { description })
}

export function showResponseError(response: Response[]) {
  let title = 'Something went wrong'
  let description = 'Please try again later'

  const error = response.find((r) => !r.ok)
  if (error) {
    title = error.status.toString() || title
    description = error.statusText || description
  }

  toast(title, { description })
  return
}