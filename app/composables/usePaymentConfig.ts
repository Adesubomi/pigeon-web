export type PaymentProvider = 'mock'

export interface PaymentConfig {
  appEnv: string
  provider: PaymentProvider
  paystackPublicKey: string
}

interface PublicPaymentRuntimeConfig {
  appEnv?: unknown
  payment?: {
    provider?: unknown
    paystackPublicKey?: unknown
  }
}

const defaultPaymentConfig = {
  appEnv: 'dev',
  provider: 'mock',
  paystackPublicKey: '',
} satisfies PaymentConfig

export function usePaymentConfig(): PaymentConfig {
  const publicConfig = useRuntimeConfig().public as PublicPaymentRuntimeConfig
  const paymentConfig = publicConfig.payment ?? {}

  return {
    appEnv: normalizeString(publicConfig.appEnv, defaultPaymentConfig.appEnv),
    provider: normalizePaymentProvider(paymentConfig.provider, defaultPaymentConfig.provider),
    paystackPublicKey: normalizeString(paymentConfig.paystackPublicKey, defaultPaymentConfig.paystackPublicKey),
  }
}

function normalizePaymentProvider(value: unknown, fallback: PaymentProvider): PaymentProvider {
  return value === 'mock' ? value : fallback
}

function normalizeString(value: unknown, fallback: string) {
  return typeof value === 'string' ? value : fallback
}
