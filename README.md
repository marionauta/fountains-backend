# Fountains Backend

A simple server that fetches [OpenSteetMap][osm] (OSM) data and processes it.

## Build

You're going to need [Deno][deno] installed. To build an executable with no
dependencies run `make`.

You can pass extra flags to the `deno compile` command:

```sh
make DENOFLAGS="--target=x86_64-unknown-linux-gnu"
```

## Documentation

The server exposes two endpoints:

### `GET /v1/server`

```ts
{
  "data": {
    "cacheTime": number, // int, milliseconds
    "language": string, // "accept-language" format
    "area": {
      "osmId": number,
      "osmType": string,
      "displayName": string,
      "location": {
        "latitude": number,
        "longitude": number,
      },
    },
  },
}
```

### `GET /v1/drinking-fountains`

```ts
{
  "data": {
    "lastUpdated": string, // date, ISO-8601
    "fountains": [
      {
        "id": string,
        "name": string,
        "location": {
          "latitude": number,
          "longitude": number,
        },
        "properties": {
          "bottle": string,
          "wheelchair": string,
        },
      },
    ],
  },
}
```

## Run

Just compile the program and run it. You can configure it with environment
variables.

### Environment variables

| Name               | Description                                                                      | Default              | Required |
| ------------------ | -------------------------------------------------------------------------------- | -------------------- | -------- |
| `FOUNTAINS_AREA`   | Defines the region where the server will look for data, eg: `Berlin, Germany`    |                      | Yes      |
| `PORT`             | Port where the server will listen connections                                    | `8080`               | No       |
| `CACHE_TIME`       | Time (in milliseconds) the server will cache data before requesting to OSM again | `21600000` (6 hours) | No       |
| `LANGUAGE`, `LANG` | Language to query OSM                                                            |                      | No       |

### Systemd

An example systemd service file is provided. It makes the following assumptions:

- The executable is located at `/usr/local/bin/fountains`.
- A `/var/www/fountains/environment` file exists with environment variables.

```
FOUNTAINS_AREA="London, UK"
PORT="3000"
```

[osm]: https://www.openstreetmap.org/
[deno]: https://deno.land/
