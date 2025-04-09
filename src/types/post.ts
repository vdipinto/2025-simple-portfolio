export type UpdatePostResult = {
    success: boolean
    slug?: string
    message?: string
    published?: boolean // 👈 add this
    errors?: {
      general?: string
      [key: string]: string | undefined
    }
  }