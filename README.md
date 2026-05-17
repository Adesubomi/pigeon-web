# Pigeon Web Client

## Environment

Copy `.env.example` to `.env` for local overrides.

The app reads these Nuxt runtime values:
- `NUXT_ENV`: app environment label. Defaults to `dev`.
- `NUXT_APP_BASE_URL`: public app base URL used to compute endpoint preview URLs. In `dev`/`local`, endpoint URLs resolve to `/e/inspect/:endpoint_id`; in `prod`, they resolve to `:endpoint_id` as a subdomain of this base URL.
- `NUXT_PAYMENT_PROVIDER`: payment implementation to use. Defaults to `mock`.
- `NUXT_PAYSTACK_PUBLIC_KEY`: public Paystack key exposed as `payment.paystackPublicKey`.
