export default {
  async fetch(request) {

    const url = new URL(request.url)

    if (url.searchParams.get("token") !== "abc123") {
      return new Response("Forbidden", { status: 403 })
    }

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

    const proxies = `
    proxies:
  - name: "speed"
    type: http
    server: 144.48.108.121
    port: 5452
  - name: "nice"
    type: http
    server: 144.48.108.122
    port: 5452
proxy-groups:
  - name: "FREE"
    type: load-balance
    strategy: round-robin
    proxies:
      - "speed"
      - "nice"
    url: "http://www.gstatic.com/generate_204" # Required for load-balance/health checks
    interval: 10

rules:
  - MATCH,FREE

`

    return new Response(proxies, {
      headers: {
        "Content-Type": "text/plain"
      }
    })

  }
}
