import type {
  AuthTokenResponse,
  GitHubExchangeRequest,
  GitHubLoginParams,
  GitHubLoginResponse,
  MeResponse,
} from '@/domains/api/auth.types'
import { useApiClient, type ApiClient } from '@/lib/api-client'

export function createAuthApi(client: ApiClient) {
  return {
    getGitHubLoginUrl(params: GitHubLoginParams = {}) {
      const query = new URLSearchParams()
      if (params.redirect_uri) query.set('redirect_uri', params.redirect_uri)
      if (params.state) query.set('state', params.state)

      const search = query.size > 0 ? `?${query.toString()}` : ''
      return client.request<GitHubLoginResponse>(`/auth/github${search}`)
    },

    exchangeGitHubCode(input: GitHubExchangeRequest) {
      return client.request<AuthTokenResponse>('/auth/github/exchange', {
        method: 'POST',
        json: input,
      })
    },

    getMe(accessToken: string) {
      return client.request<MeResponse>('/me', { token: accessToken })
    },

    logout(accessToken?: string) {
      return client.request<void>('/auth/logout', {
        method: 'POST',
        token: accessToken,
      })
    },
  }
}

export function useAuthApi() {
  return createAuthApi(useApiClient())
}
