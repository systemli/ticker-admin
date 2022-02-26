# ticker-admin [![Integration](https://github.com/systemli/ticker-admin/actions/workflows/integration.yml/badge.svg)](https://github.com/systemli/ticker-admin/actions/workflows/integration.yml)

## Development

**Requirement:** Running instance of [ticker](https://github.com/systemli/ticker), default: http://localhost:8080/v1

```
# Install dependencies
yarn

# Start development server (http://localhost:3000)
yarn start
```

## Configuration

Place configuration in `.env` file and restart/rebuild the ticker-admin

```
REACT_APP_API_URL=http://localhost:8080/v1
```
