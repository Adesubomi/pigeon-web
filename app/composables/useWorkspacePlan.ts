export type WorkspacePlanName = 'Solo' | 'Builder' | 'Business'

export function useWorkspacePlan() {
  const activePlan = useState<WorkspacePlanName>('workspace:active-plan', () => 'Solo')

  function setActivePlan(plan: WorkspacePlanName) {
    activePlan.value = plan
  }

  return {
    activePlan,
    setActivePlan,
  }
}
