# Gemini Project Context: Draw Things Skill
## Project Overview

-   **Purpose**: Local AI image generation using the Draw Things gRPC backend.
-   **Architecture**: A **Client-Server** model.
    -   **Control Layer (Inside Skill)**: Pure Node.js implementation using `@grpc/grpc-js` and `pngjs`.
    -   **Infrastructure Layer (External)**: The Draw Things macOS binary and ~10GB of model weights, managed outside this repository.
-   **Core Technologies**:
    -   **Language**: Node.js.
    -   **Communication**: gRPC (`imageService.proto`).
    -   **Configuration**: FlatBuffers binary.
    -   **Backend**: Draw Things (External macOS binary).

## External Infrastructure

This skill controls an external server. **Do not move or copy** these heavy assets into the skill directory.

-   **Server Binary**: `[Path to your Draw Things gRPC server binary, e.g., /path/to/gRPCServerCLI-macOS]`
-   **Models Directory**: `[Path to your Draw Things models, e.g., ~/Library/Containers/com.liuliu.draw-things/Data/Documents/Models]`
-   **Default Address**: `127.0.0.1:7859` (No TLS, no compression).

## Current Status: Pure Node.js Implementation

✅ **Pure Node.js**: High-performance gRPC implementation using `@grpc/grpc-js` and `pngjs`. No external dependencies other than the Draw Things server.
⚠️ **Note**: Ensure the server binary version is compatible with the `GenerateImage` method. Refer to `IMPLEMENTATION.md` for troubleshooting.

## Getting Started

### 1. Prerequisites
-   **Draw Things**: Installed on macOS with models downloaded (~10GB+).
-   **Node.js**: Installed (version 16+ recommended).
-   **Dependencies**:
    ```bash
    npm install
    ```

### 2. Start the External Server
The server must be running to process requests. The `start-server` command references the external binary path.
```bash
npm run start-server
```

### 3. Generate Images
Use the provided script to generate images from text prompts.
```bash
# Basic usage
node scripts/generate.js --prompt "a serene mountain lake at sunrise" --output output.png
```
# Advanced usage (Turbo model)
node scripts/generate.js --prompt "cyberpunk city" --model z_image_turbo_1.0_q6p.ckpt --steps 8
```

## Key Commands

| Command | Description |
| :--- | :--- |
| `npm run start-server` | Starts the Draw Things gRPC server on `127.0.0.1:7859`. |
| `npm run generate -- [options]` | Generates an image using `scripts/generate.js`. |
| `npm run health` | Checks if the gRPC server is responsive. |
| `npm run models` | Placeholder (model listing depends on local filesystem access). |

## Project Structure

-   `scripts/generate.js`: Core logic for gRPC communication, FlatBuffer building, and image saving.
-   `scripts/imageService.proto`: gRPC service and message definitions.
-   `references/`: Detailed documentation on gRPC protocols and sampler algorithms.
-   `SKILL.md`: User-facing documentation and quick start guide.
-   `IMPLEMENTATION.md`: Technical implementation details (FlatBuffer slots, tensor decoding).

## Development Conventions

-   **Pure Node.js**: All gRPC logic, binary serialization (FlatBuffers), and image decoding are handled in Node.js for maximum performance and portability.
-   **Error Handling**: Detailed status codes and troubleshooting tables are maintained in the documentation.
-   **Model Management**: Default models are optimized for speed (e.g., `z_image_turbo`).
-   **Sampler Selection**: Recommended samplers include `unicpc-trailing` and `euler-a-trailing`.
