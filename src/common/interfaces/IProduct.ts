export interface IProduct {
  id: string
  price: number
  title: string
  description: string
  category: string
  images: string[]
  total?: number
}

export interface ICategory {
  id: string
  category: string
}
