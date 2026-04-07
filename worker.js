port: 7890
socks-port: 7891
mode: rule

proxy-providers:
  hidden:
    type: http
    url: https://proxies-worker.darkblazespuky.workers.dev/?token=abc123
    interval: 3600
    path: ./hidden.yaml

proxy-groups:

- name: AUTO
  type: select
  use:
    - hidden

rules:
- MATCH,AUTO
