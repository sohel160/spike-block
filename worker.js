export default {
  async fetch(request) {

    const url = new URL(request.url)

    // token check
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

  SPEED:
    type: http
    url: "https://spike-block.darkblazespuky.workers.dev/proxies?token=abc123"
    interval: 3600
    path: ./speed.yaml
    filter: "SPEED"
    health-check:
      enable: true
      url: http://www.gstatic.com/generate_204
      interval: 60

  FAST:
    type: http
    url: "https://spike-block.darkblazespuky.workers.dev/proxies?token=abc123"
    interval: 3600
    path: ./fast.yaml
    filter: "FAST"
    health-check:
      enable: true
      url: http://www.gstatic.com/generate_204
      interval: 60

proxy-groups:

- name: SPEED
  type: select
  use:
    - SPEED

- name: FAST
  type: select
  use:
    - FAST

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
