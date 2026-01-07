# ticker-admin

[![Integration](https://github.com/systemli/ticker-admin/actions/workflows/integration.yml/badge.svg)](https://github.com/systemli/ticker-admin/actions/workflows/integration.yml) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=systemli_ticker-admin&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=systemli_ticker-admin) [![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=systemli_ticker-admin&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=systemli_ticker-admin) [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=systemli_ticker-admin&metric=coverage)](https://sonarcloud.io/summary/new_code?id=systemli_ticker-admin)

## Development

**Requirement:** Running instance of [ticker](https://github.com/systemli/ticker), default: <http://localhost:8080/v1>

```shell
# Install dependencies
yarn install

# Start development server (http://localhost:3000)
yarn run dev
```

## Configuration

Place configuration in `.env` file and restart/rebuild the ticker-admin

```shell
TICKER_API_URL=http://localhost:8080/v1
```

## Localization

Strings are localized on the [locales](./src/i18n/locales) folder. To add more languages, please update those files:

- [i18n.ts](./src/i18n/i18n.ts) to localize all strings
- [UserListItem.tsx](./src/components/user/UserListItem.tsx) to localize `dayjs` relative times

To add a new string, please use the `t('stringKey')` notation and update all the locales.
