export default {
  async fetch(request) {

    const url = new URL(request.url)

    // token protection
    if (url.searchParams.get("token") !== "abc123") {
      return new Response("Forbidden", { status: 403 })
    }

    // allow clash family apps
    const ua = request.headers.get("User-Agent") || ""

    const allowedUA = [
      "Clash",
      "clash",
      "ClashMeta",
      "ClashforWindows",
      "ClashX",
      "Stash",
      "FiClash",
      "Meta",
      "okhttp"
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
  main:
    type: http
    url: "https://spike-block.darkblazespuky.workers.dev/proxies?token=abc123"
    interval: 3600
    path: ./main.yaml

proxy-groups:

- name: SPEED
  type: select
  proxies:
    - speed
    - nice

- name: FAST
  type: load-balance
  strategy: round-robin
  proxies:
    - speed
    - nice
  interval: 60

rules:
- MATCH,SPEED
`

    return new Response(config, {
      headers: {
        "Content-Type": "text/plain"
      }
    })

  }
}
