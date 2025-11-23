export interface Link {
  id: string
  shortCode: string
  targetUrl: string
  clicks: number
  lastClicked: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface CreateLinkRequest {
  targetUrl: string
  shortCode?: string
}