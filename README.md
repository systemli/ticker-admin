# ticker-admin [![Build Status](https://travis-ci.com/systemli/ticker-admin.svg?branch=master)](https://travis-ci.com/systemli/ticker-admin)

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

## Using in production

[INSTALLATION.MD](docs/INSTALLATION.MD)