type Freshness = 'build-time' | 'time-window' | 'request-time' | 'live'
type SecretAccess = 'none' | 'read-secret' | 'write-secret'
type BrowserNeed = 'none' | 'state-or-events' | 'browser-api'

interface RouteRequirement {
  name: string
  freshness: Freshness
  secretAccess: SecretAccess
  browserNeed: BrowserNeed
  canStreamDynamicIsland: boolean
}

type RenderingDecision =
  | 'static-prerender'
  | 'cached-server-component'
  | 'dynamic-server-render'
  | 'client-component-island'
  | 'streamed-dynamic-island'

function decideRendering(req: RouteRequirement): RenderingDecision {
  if (req.browserNeed !== 'none') return 'client-component-island'
  if (req.canStreamDynamicIsland && req.freshness === 'request-time') return 'streamed-dynamic-island'
  if (req.secretAccess === 'write-secret') return 'dynamic-server-render'
  if (req.freshness === 'build-time') return 'static-prerender'
  if (req.freshness === 'time-window') return 'cached-server-component'
  return 'dynamic-server-render'
}

const routes: RouteRequirement[] = [
  {
    name: 'Marketing home hero',
    freshness: 'build-time',
    secretAccess: 'none',
    browserNeed: 'none',
    canStreamDynamicIsland: false,
  },
  {
    name: 'Startup details with cached body',
    freshness: 'time-window',
    secretAccess: 'read-secret',
    browserNeed: 'none',
    canStreamDynamicIsland: false,
  },
  {
    name: 'View counter',
    freshness: 'request-time',
    secretAccess: 'write-secret',
    browserNeed: 'none',
    canStreamDynamicIsland: true,
  },
  {
    name: 'Markdown editor',
    freshness: 'live',
    secretAccess: 'none',
    browserNeed: 'state-or-events',
    canStreamDynamicIsland: false,
  },
]

for (const route of routes) {
  console.log(`${route.name}: ${decideRendering(route)}`)
}

