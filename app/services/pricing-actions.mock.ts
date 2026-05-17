export interface DowngradePlanInput {
  fromPlan: string
  toPlan: string
  reasons: string[]
  comment: string
}

export interface ContactPlanSupportInput {
  planName: string
  name: string
  email: string
  company: string
  expectedUsage: string
  message: string
}

interface MockWaitOptions {
  waitMs?: number
}

const mockActionWaits = {
  downgradePlan: 850,
  contactPlanSupport: 850,
} satisfies Record<string, number>

function waitForMockAction(waitMs: number) {
  return new Promise(resolve => window.setTimeout(resolve, waitMs))
}

export async function downgradePlanMock(input: DowngradePlanInput, options: MockWaitOptions = {}) {
  await waitForMockAction(options.waitMs ?? mockActionWaits.downgradePlan)

  return {
    ...input,
    changedAt: new Date().toISOString(),
  }
}

export async function contactPlanSupportMock(input: ContactPlanSupportInput, options: MockWaitOptions = {}) {
  await waitForMockAction(options.waitMs ?? mockActionWaits.contactPlanSupport)

  return {
    ...input,
    requestedAt: new Date().toISOString(),
  }
}
