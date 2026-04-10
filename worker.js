export default {
  async fetch(request) {

    const url = new URL(request.url)

    if (url.searchParams.get("token") !== "abc123") {
      return new Response("Forbidden", { status: 403 })
    }

    const ua = request.headers.get("User-Agent") || ""

    if (!ua.includes("Clash") && !ua.includes("FiClash")) {
      return new Response("404", { status: 404 })
    }

    const proxies = `
proxies:

- name: proxy1
  type: http
  server: 
  port: 

- name: proxy2
  type: http
  server: 
  port: 
`

    return new Response(proxies)
  }
}
