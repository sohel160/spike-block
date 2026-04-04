export default {
  async fetch(request) {

    const url = new URL(request.url)

    const token = url.searchParams.get("token")

    if (token !== "abc123") {
      return new Response("Forbidden", { status: 403 })
    }

    const config = `
proxies:
  - name: "proxy1"
    type: http
    server: 144.48.108.121
    port: 5452

  - name: "proxy2"
    type: http
    server: 144.48.108.122
    port: 5452
`

    return new Response(config, {
      headers: {
        "content-type": "text/plain"
      }
    })

  }
}
