# Fountains Backend

A simple server that fetches [OpenSteetMap][osm] (OSM) data and processes it.

**Note:** This repository contains backend code that was used by
[Water Finder][waterfinder], an android and iOS mobile app to find drinking fountains nearby. The app no longer relies on the backend to process OSM data.
This repository won't receive further updates.

## Build

You're going to need [Deno][deno] version 1.30.0 or better installed. To build
an executable with no dependencies run `make`.

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
    "language": undefined | string, // "accept-language" format
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
          "bottle": "unknown" | "no" | "yes",
          "wheelchair": "unknown" | "no" | "limited" | "yes",
          "mapillaryId": undefined | string,
          "checkDate": undefined | string, // yyyy-mm-dd
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

[waterfinder]: https://aguapp.nachbaur.dev
[osm]: https://www.openstreetmap.org/
[deno]: https://deno.land/
