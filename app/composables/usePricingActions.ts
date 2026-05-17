import {
  contactPlanSupportMock,
  downgradePlanMock,
  type ContactPlanSupportInput,
  type DowngradePlanInput,
} from '@/services/pricing-actions.mock'

export function pricingDowngradeActionKey() {
  return 'pricing:downgrade'
}

export function pricingContactSupportActionKey() {
  return 'pricing:contact-support'
}

export function usePricingActions() {
  const { isActionPending, runAction } = useActionRunner()

  async function downgradePlan(input: DowngradePlanInput) {
    return runAction({
      key: pricingDowngradeActionKey(),
      label: 'Downgrading plan',
      successMessage: 'Plan downgraded',
      successDescription: 'Your workspace is now on the Free plan.',
      errorMessage: 'Could not downgrade plan',
      task: () => downgradePlanMock(input),
    })
  }

  async function contactPlanSupport(input: ContactPlanSupportInput) {
    return runAction({
      key: pricingContactSupportActionKey(),
      label: 'Sending support request',
      successMessage: 'Support request sent',
      successDescription: 'We have the details we need to follow up.',
      errorMessage: 'Could not send support request',
      task: () => contactPlanSupportMock(input),
    })
  }

  return {
    contactPlanSupport,
    downgradePlan,
    isPricingActionPending: isActionPending,
  }
}
