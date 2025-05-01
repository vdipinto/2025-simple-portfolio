export type TiptapContent = {
    type: string
    content?: {
      type: string
      content?: {
        text?: string
        type?: string
      }[]
    }[]
  }