export interface Endpoint {
  id: string
  name: string
  url: string
  status: 'active' | 'inactive' | 'error'
  devices: number
  eventsToday: number | null
}

export interface EndpointEvent {
  id: string
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'
  path: string
  time: string
  size: string
  source: string
  payload: string
  headers: Record<string, string>
}

type EventSeed = Omit<EndpointEvent, 'headers'>

const endpointSeeds: Endpoint[] = [
  { id: 'str', name: 'Stripe webhooks', url: 'https://relay.pigeon.sh/e/str_x9kq2mj4p', status: 'active', devices: 2, eventsToday: 842 },
  { id: 'gh', name: 'GitHub CI events', url: 'https://relay.pigeon.sh/e/gh_8wn3rlv0c', status: 'active', devices: 1, eventsToday: 217 },
  { id: 'sh', name: 'Shopify orders', url: 'https://relay.pigeon.sh/e/sh_4cv7xmk1z', status: 'active', devices: 1, eventsToday: 189 },
  { id: 'rs', name: 'Resend email events', url: 'https://relay.pigeon.sh/e/rs_2bf9dkw5m', status: 'error', devices: 0, eventsToday: 36 },
  { id: 'ln', name: 'Linear issues (paused)', url: 'https://relay.pigeon.sh/e/ln_7hq6tjy9r', status: 'inactive', devices: 1, eventsToday: null },
]

const rawEventSeeds: Record<string, EventSeed[]> = {
  str: [
    { id: 'evt_1001', method: 'POST', path: '/payment.succeeded', time: '2m ago', size: '4.2 KB', source: 'Stripe', payload: '{ "type": "payment.succeeded", "amount": 4200 }' },
    { id: 'evt_1002', method: 'POST', path: '/charge.failed', time: '5m ago', size: '3.8 KB', source: 'Stripe', payload: '{ "type": "charge.failed", "reason": "card_declined" }' },
    { id: 'evt_1003', method: 'POST', path: '/invoice.paid', time: '12m ago', size: '5.1 KB', source: 'Stripe', payload: '{ "type": "invoice.paid", "invoice": "in_84b" }' },
    { id: 'evt_1004', method: 'POST', path: '/subscription.updated', time: '18m ago', size: '4.7 KB', source: 'Stripe', payload: '{ "type": "subscription.updated", "status": "active" }' },
    { id: 'evt_1005', method: 'GET', path: '/health', time: '24m ago', size: '0 B', source: 'Monitor', payload: '' },
    { id: 'evt_1006', method: 'PUT', path: '/customers/cus_82a', time: '28m ago', size: '2.6 KB', source: 'Stripe', payload: '{ "customer": "cus_82a", "metadata": { "plan": "pro" } }' },
    { id: 'evt_1007', method: 'PATCH', path: '/subscriptions/sub_19e', time: '31m ago', size: '1.9 KB', source: 'Stripe', payload: '{ "subscription": "sub_19e", "quantity": 4 }' },
    { id: 'evt_1008', method: 'DELETE', path: '/payment_methods/pm_44c', time: '35m ago', size: '1.1 KB', source: 'Stripe', payload: '{ "payment_method": "pm_44c", "deleted": true }' },
    { id: 'evt_1009', method: 'HEAD', path: '/balance', time: '41m ago', size: '624 B', source: 'Monitor', payload: '{ "headers": { "content-type": "application/json" } }' },
    { id: 'evt_1010', method: 'OPTIONS', path: '/webhooks', time: '47m ago', size: '932 B', source: 'Browser preflight', payload: '{ "allow": "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS" }' },
  ],
  gh: [
    { id: 'evt_2001', method: 'POST', path: '/workflow.completed', time: '6m ago', size: '2.9 KB', source: 'GitHub', payload: '{ "workflow": "CI", "conclusion": "success" }' },
    { id: 'evt_2002', method: 'POST', path: '/pull_request.opened', time: '21m ago', size: '6.4 KB', source: 'GitHub', payload: '{ "action": "opened", "number": 128 }' },
    { id: 'evt_2003', method: 'POST', path: '/check_run.failed', time: '38m ago', size: '3.2 KB', source: 'GitHub', payload: '{ "check": "lint", "conclusion": "failure" }' },
  ],
  sh: [
    { id: 'evt_3001', method: 'POST', path: '/orders/create', time: '3m ago', size: '7.8 KB', source: 'Shopify', payload: '{ "order_id": 53192, "total": "84.00" }' },
    { id: 'evt_3002', method: 'POST', path: '/orders/paid', time: '16m ago', size: '6.9 KB', source: 'Shopify', payload: '{ "order_id": 53189, "financial_status": "paid" }' },
  ],
  rs: [
    { id: 'evt_4001', method: 'POST', path: '/email.delivered', time: '9m ago', size: '2.1 KB', source: 'Resend', payload: '{ "email_id": "em_92a", "status": "delivered" }' },
  ],
  ln: [
    { id: 'evt_5001', method: 'POST', path: '/issue.updated', time: '1h ago', size: '3.4 KB', source: 'Linear', payload: '{ "issue": "PIG-41", "state": "In Review" }' },
  ],
}

const sourceSignatureHeaders: Record<string, Record<string, string>> = {
  Stripe: { 'stripe-signature': 't=1714982412,v1=2e31fba4d7d9c1aa' },
  GitHub: { 'x-github-event': 'workflow_run', 'x-hub-signature-256': 'sha256=8c2f9d7b5a1e' },
  Shopify: { 'x-shopify-topic': 'orders/create', 'x-shopify-hmac-sha256': 'b0f6d74aa2cc' },
  Resend: { 'svix-signature': 'v1,0f9b7a813ad1' },
  Linear: { 'linear-signature': '1f0b9ac43e91' },
}

function withHeaders(event: EventSeed): EndpointEvent {
  const userAgent = event.source.toLowerCase().replace(/\s+/g, '-')

  return {
    ...event,
    headers: {
      'content-type': 'application/json',
      'user-agent': `${userAgent}/webhook`,
      'x-pigeon-event-id': event.id,
      'x-forwarded-method': event.method,
      ...sourceSignatureHeaders[event.source],
    },
  }
}

const eventSeeds = Object.fromEntries(
  Object.entries(rawEventSeeds).map(([endpointId, events]) => [
    endpointId,
    events.map(withHeaders),
  ]),
) as Record<string, EndpointEvent[]>

export function useEndpoints() {
  const endpoints = useState<Endpoint[]>('endpoints', () => endpointSeeds)
  const endpointEvents = useState<Record<string, EndpointEvent[]>>('endpoint-events', () => eventSeeds)

  const getEndpoint = (id: string) => endpoints.value.find(endpoint => endpoint.id === id) ?? null
  const getEvents = (endpointId: string) => endpointEvents.value[endpointId] ?? []
  const getEvent = (endpointId: string, eventId: string) => getEvents(endpointId).find(event => event.id === eventId) ?? null
  const getEventContext = (eventId: string) => {
    for (const endpoint of endpoints.value) {
      const event = getEvent(endpoint.id, eventId)
      if (event) return { endpoint, event }
    }

    return null
  }

  return {
    endpoints,
    getEndpoint,
    getEvents,
    getEvent,
    getEventContext,
  }
}
