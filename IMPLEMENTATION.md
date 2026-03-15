# Draw Things Skill - Implementation Notes

## Architecture

1.  **gRPC Client**: Uses `@grpc/proto-loader` to dynamically load `imageService.proto`.
2.  **Configuration**: Parameters are serialized into a FlatBuffer using the `flatbuffers` library, matching the vtable slots required by the Draw Things server.
3.  **Image Processing**:
    -   The server returns raw tensors (68-byte header + Float16 HWC data).
    -   `scripts/generate.js` decodes these into 8-bit RGBA using a custom Float16 decoder.
    -   `pngjs` saves the final image as a standard PNG file.

## Usage

```bash
node scripts/generate.js --prompt "a beautiful landscape" --output output.png
```

## Known Issues

-   **gRPC Server Version**: Ensure you are using a version of `gRPCServerCLI-macOS` that implements `GenerateImage`. If you receive a `StatusCode.UNIMPLEMENTED` error, the server binary is likely outdated or incompatible.
- **FlatBuffer Slots**: The slot indices (e.g., `slotID = 0`, `slotStartWidth = 1`) are defined in `scripts/generate.js`. If the server protocol changes, these may need adjustment.

## Reference

-   Proto Definition: `scripts/imageService.proto`

