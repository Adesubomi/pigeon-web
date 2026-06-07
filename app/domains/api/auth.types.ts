export interface User {
  id: string
  github_id: string
  email: string
  name: string
  avatar_url: string
  created_at: string
  updated_at: string
}

export interface GitHubLoginParams {
  redirect_uri?: string
  state?: string
}

export interface GitHubLoginResponse {
  url: string
}

export interface GitHubExchangeRequest {
  code: string
  redirect_uri: string
}

export interface AuthTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  user: User
}

export interface MeResponse {
  user: User
}
