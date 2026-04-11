export default {
  async fetch(request) {

    const url = new URL(request.url)

    // token protection
    if (url.searchParams.get("token") !== "abc123") {
      return new Response("Forbidden", { status: 403 })
    }

    // allow only clash clients
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
      return new Response("404", { status: 404 })
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
    url: "https://spike-block.darkblazespuky.workers.dev/proxies?token=abc123"
    interval: 3600
    path: ./bdix.yaml
    health-check:
      enable: true
      url: http://www.gstatic.com/generate_204
      interval: 60

proxy-groups:

- name: proxy1
  type: select
  use:
    - bdix

- name: proxy2
  type: load-balance
  strategy: round-robin
  use:
    - bdix
  interval: 60

rules:
- MATCH,proxy1
`

    return new Response(config, {
      headers: {
        "Content-Type": "text/plain"
      }
    })

  }
}
