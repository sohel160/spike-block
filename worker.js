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
  - name: BDIX-SS1
    type: ss
    server: bdix.errorx.me
    port: 12545
    cipher: aes-128-gcm
    password: 925dca7a-7d12-4167-be86-4923be57a2d9

  - name: BDIX-VM1
    type: vmess
    server: bdix.errorx.me
    port: 12546
    uuid: 925dca7a-7d12-4167-be86-4923be57a2d9
    alterId: 0
    cipher: auto
    network: tcp

  - name: BDIX-VL1
    type: vless
    server: bdix.errorx.me
    port: 12547
    uuid: 925dca7a-7d12-4167-be86-4923be57a2d9
    network: tcp

`

    return new Response(proxies, {
      headers: {
        "Content-Type": "text/plain"
      }
    })

  }
}
