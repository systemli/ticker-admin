# ticker-admin

[![Integration](https://github.com/systemli/ticker-admin/actions/workflows/integration.yml/badge.svg)](https://github.com/systemli/ticker-admin/actions/workflows/integration.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=systemli_ticker-admin&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=systemli_ticker-admin)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=systemli_ticker-admin&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=systemli_ticker-admin)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=systemli_ticker-admin&metric=coverage)](https://sonarcloud.io/summary/new_code?id=systemli_ticker-admin)

The admin interface for the [Ticker project](https://github.com/systemli/ticker). Editors use it to
manage tickers, post messages, connect integrations and administer users.

It is a static single-page application and holds no data of its own; everything lives in the
[ticker](https://github.com/systemli/ticker) API.

## Documentation

**<https://systemli.github.io/ticker/>**

Installation, configuration, deployment and troubleshooting for the whole stack are documented
centrally:

- [Installation](https://systemli.github.io/ticker/installation/) — running the full stack with Docker
- [Configuration](https://systemli.github.io/ticker/configuration/)
- [Troubleshooting](https://systemli.github.io/ticker/troubleshooting/)

The published image is [`systemli/ticker-admin`](https://hub.docker.com/r/systemli/ticker-admin).

## Development

**Requirements:** Node 24 (see `.nvmrc`) and a running [ticker](https://github.com/systemli/ticker)
API.

```shell
nvm use
npm install
npm run dev        # http://localhost:3000
```

The dev server proxies `/api` to `http://localhost:8080/v1`, so run the API alongside it and nothing
needs configuring.

> **Delete a leftover `.env`.** `TICKER_API_URL` overrides the proxy with an absolute address.
> Requests still work, but attachment images do not: their URLs are relative and would resolve
> against the dev server instead of the API. The file is gitignored, so an old one may still be in
> your checkout.

### Commands

```shell
npm test           # vitest, watch mode
npm run coverage
npm run lint
npm run tsc        # type check
npm run build
npm run preview
```

See [AGENTS.md](AGENTS.md) for project structure, conventions and testing patterns, and the
[development guide](https://systemli.github.io/ticker/development/) for working across the three
repositories.

## Localization

Strings live in the [locales](./src/i18n/locales) folder. To add a language, update:

- [i18n.ts](./src/i18n/i18n.ts) to register it
- [UserListItem.tsx](./src/components/user/UserListItem.tsx) for `dayjs` relative times

Use the `t('stringKey')` notation for new strings and update all locales.

## Licence

GPL-3.0. See [LICENSE](LICENSE).
