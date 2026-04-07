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
      return new Response("404 Not Found", { status: 404 })
    }

    const config = `
port: 7890
socks-port: 7891
allow-lan: false
mode: rule

proxy-providers:
  main:
    type: http
    url: https://clash-worker.darkblazespuky.workers.dev/?token=abc123
    interval: 3600
    path: ./providers.yaml
    health-check:
      enable: true
      interval: 600
      url: http://www.gstatic.com/generate_204

proxy-groups:

- name: AUTO
  type: select
  use:
    - main

rules:
- MATCH,AUTO

# actual proxies
proxies:

- name: proxy1
  type: http
  server: 144.48.108.121
  port: 5452

- name: proxy2
  type: http
  server: 144.48.108.122
  port: 5452
`

    return new Response(config, {
      headers: {
        "Content-Type": "text/plain"
      }
    })

  }
}
