DENOFLAGS =

fountains: $(shell find src -name "*.ts")
	deno compile $(DENOFLAGS) --allow-env --allow-net --output $@ src/main.ts
