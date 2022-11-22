DENOFLAGS =

fountains: $(shell find src -name "*.ts")
	deno compile $(DENOFLAGS) --import-map=src/importMap.json --allow-env --allow-net --output $@ src/main.ts
