export default {
  async fetch(request) {

    const url = new URL(request.url)

    // token check
    if (url.searchParams.get("token") !== "abc123") {
      return new Response("Forbidden", { status: 403 })
    }

    // allow only Clash clients
    const ua = request.headers.get("User-Agent") || ""

    const allowedUA = [
      "Clash",
      "clash",
      "ClashMeta",
      "ClashforWindows",
      "ClashX",
      "Stash",
      "FiClash"
    ]

    let allowed = false

    for (const a of allowedUA) {
      if (ua.includes(a)) {
        allowed = true
        break
      }
    }

    if (!allowed) {
      return new Response("404 Not Found", { status: 404 })
    }

    const config = `
port: 7890
socks-port: 7891
allow-lan: true
mode: rule
log-level: info

proxy-providers:
  bdix:
    type: http
    url: "https://proxies-worker.darkblazespuky.workers.dev/?token=abc123"
    interval: 3600
    path: ./bdix.yaml
    health-check:
      enable: true
      url: http://www.gstatic.com/generate_204
      interval: 30

proxy-groups:

- name: PROXY
  type: select
  proxies:
    - AUTO-FAST
    - AUTO-STABLE
    - MANUAL
    - DIRECT

- name: MANUAL
  type: select
  use:
    - bdix

- name: AUTO-FAST
  type: load-balance
  strategy: round-robin
  use:
    - bdix
  interval: 20

- name: AUTO-STABLE
  type: load-balance
  strategy: consistent-hashing
  use:
    - bdix
  interval: 300

rules:
- MATCH,PROXY
`

    return new Response(config, {
      headers: {
        "Content-Type": "text/plain"
      }
    })

  }
}
