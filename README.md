# OpenClaw Skill: Draw Things AI Image Generation

[中文版](README_CN.md)

A high-performance Node.js skill for [OpenClaw](https://github.com/mijuu/openclaw) / Gemini CLI that enables local AI image generation using the [Draw Things](https://drawthings.ai/) gRPC backend on macOS.

## 🚀 Key Features

- **Pure Node.js**: No Python or external image processing scripts required.
- **High Performance**: Uses gRPC protocol for low-latency communication and efficient binary serialization (FlatBuffers).
- **Secure**: Full support for SSL/TLS with integrated Draw Things Root CA.
- **Fast Generation**: Optimized for "Turbo" models (e.g., SDXL Turbo, Flux) with real-time progress updates.
- **Flexible Protocol**: Supports both gRPC (Port 7859) and HTTP (Port 7860).
- **Comprehensive Control**: Full access to prompts, negative prompts, seeds, samplers, and model selection.

## 🛠️ Prerequisites

- **macOS**: Draw Things is a macOS-native application.
- **Draw Things App**: Installed with models downloaded.
- **Node.js**: Version 16 or higher.

## 📦 Installation

Clone this repository into your OpenClaw skills directory:

```bash
cd ~/.openclaw/skills
git clone https://github.com/mijuu/openclaw-skill-drawthings.git drawthings
cd drawthings
npm install
```

## ⚙️ Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Edit `.env` and configure your local paths:
   - `DRAWTHINGS_SERVER_PATH`: Path to `gRPCServerCLI-macOS` (usually inside the App bundle or downloaded separately).
   - `DRAWTHINGS_MODELS_PATH`: Path to your Draw Things models directory.
   - `DRAWTHINGS_USE_TLS`: Set to `true` if you want to use encrypted connections (recommended).

## 🚀 Usage

### 1. Start the Server

You can start the server via the Draw Things App (Settings > Enable gRPC Server) or via CLI:

```bash
npm run start-server
```

### 2. Generate Images

Use the provided generation script:

```bash
# Basic generation
node scripts/generate.js --prompt "a serene mountain lake at sunrise" --output landscape.png

# Advanced usage (Turbo model)
node scripts/generate.js --prompt "cyberpunk city" --model z_image_turbo_1.0_q6p.ckpt --steps 8 --tls
```

### 3. Check Health & Models

```bash
# Check if server is responsive
npm run health

# List available models
npm run models
```

## 📂 Project Structure

- `scripts/generate.js`: Core generation logic and CLI.
- `scripts/start-server.js`: Server management wrapper.
- `scripts/imageService.proto`: gRPC service definitions.
- `scripts/drawthings-ca.pem`: Integrated Root CA for TLS.
- `references/`: Detailed documentation on gRPC protocols and samplers.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📜 License

MIT License. See [LICENSE](LICENSE) for details.
