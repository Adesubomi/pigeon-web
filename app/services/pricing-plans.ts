import type { WorkspacePlanName } from '@/composables/useWorkspacePlan'

export interface PricingPlan {
  name: WorkspacePlanName
  price: string
  summary: string
  features: readonly string[]
  subscription_plan_id: string | null
}

export const pricingPlans = [
  {
    name: 'Solo',
    price: 'Free',
    summary: 'For focused webhook testing with one project, lighter traffic, and quick local iteration.',
    subscription_plan_id: null,
    features: [
      '5 endpoints',
      '2 clients',
      '6 hours of client connection lifespan',
      '500 events',
      '7 days retention',
      '50Mb storage capacity',
    ],
  },
  {
    name: 'Builder',
    price: '₦5,700',
    summary: 'For active teams testing multiple integrations, shared clients, and higher event volume.',
    subscription_plan_id: 'PLN_1vtbpu0coz7x8bw',
    features: [
      '20 endpoints',
      '10 clients',
      '24 hours of client connection lifespan',
      '5,000 events',
      '30 days retention',
      '500Mb storage capacity',
    ],
  },
  {
    name: 'Business',
    price: 'Contact Support',
    summary: 'For teams that need dedicated infrastructure, custom limits, and tailored support.',
    subscription_plan_id: null,
    features: [
      'Unlimited endpoints',
      'Unlimited clients',
      'Unlimited client connection lifespan',
      'Unlimited events',
      'Unlimited retention',
      'Unlimited storage capacity',
    ],
  },
] satisfies readonly PricingPlan[]
