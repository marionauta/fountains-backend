# Fountains Backend

A simple server that fetches OpenSteetMap data and processes it.

## Build

You're going to need [Deno][deno] installed. To build an executable with no dependencies run `make`.

You can pass extra flags to the `deno compile` command:

```sh
make DENOFLAGS="--target=x86_64-unknown-linux-gnu"
```

## Run

The `FOUNTAINS_AREA` environment variable is **required**. Defines the region where the server will look for data.

You can set the `PORT` environment variable to change the port. Default is `8080`.

### Systemd

An example systemd service file is provided. It makes the following assumptions:
- The executable is located at `/usr/local/bin/fountains`.
- A `/var/www/fountains/environment` file exists with environment variables.

```
FOUNTAINS_AREA="London, UK"
PORT="3000"
```

[deno]: https://deno.land/
