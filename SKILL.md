# Skill: Draw Things for AI Agents

**Slug:** `drawthings-agent`  
**Display Name:** `Draw Things for AI Agents`

## Overview
This skill acts as an AI-native interface for the **Draw Things** macOS app. It doesn't replace the app; instead, it provides a powerful CLI and manages the official gRPC server, making professional-grade local image generation seamless for AI agents and developers.

- **Privacy First**: All generation happens locally on your Mac.
- **Agent Ready**: Structured CLI output and lifecycle management for gRPC servers.
- **High Performance**: Direct communication via gRPC with support for upscaling and custom models.

## 🛠 Target Tool
**Command**: `dt-skill`
**Subcommand**: `gen`

## 🤖 AI usage Instructions

### 1. Basic Generation
Always use `dt-skill gen`. You **MUST** provide a `--prompt`.
```bash
dt-skill gen --prompt "your detailed description"
```

### 2. High Quality & Upscaling (CRITICAL)
If the user asks for "high quality", "high resolution", "4K", or "clear" images, you **MUST** use the `--upscale` parameter **at the time of generation**.
- **For 2x Upscale**: `--upscale 2`
- **For 4x Upscale**: `--upscale 4` (Note: Takes significantly longer)
**Example**: `dt-skill gen --prompt "..." --upscale 2`

### 3. Aspect Ratio & Resolution
Default is `1024x576` (16:9). 
- **Square**: `--width 1024 --height 1024`
- **Portrait**: `--width 576 --height 1024`
- **Standard**: `--width 1024 --height 576`

### 4. Model Selection
- **Default**: `z_image_turbo_1.0_q6p.ckpt` (Fastest, 8 steps).
- **Listing Models**: Use `dt-skill models` to see what is available before suggesting a change.

### 5. Task Control & Sessions
When running in environments that support background tasks (like OpenClaw or OpenCode), use `is_background: true` to allow real-time progress monitoring.
- **Progress**: You will see `Sampling step: X/Y`.
- **Heartbeat**: Every 30s you will see `... still working ...`.
- **Timeout**: Default is 600s. For heavy 4x upscales, use `--timeout 1200`.

## ⚠️ CRITICAL CONSTRAINTS for AI
1. **NO TRUNCATION**: Never use "..." or "etc." in the prompt. Provide the complete text.
2. **NO POST-PROCESSING**: Upscaling **MUST** be part of the initial `gen` command.
3. **RESPONSE COMPRESSION**: Ensure "Response Compression" (FPY) is **DISABLED** in Draw Things settings.

## 📋 Parameter Reference (CLI)
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `--prompt` | String | (Required) Positive prompt |
| `--negative-prompt` | String | Elements to exclude |
| `--upscale` | Number | 1, 2, or 4 |
| `--model` | String | Filename of the model |
| `--steps` | Number | Number of sampling steps (8-30) |
| `--seed` | Number | 0 for random, or specific number |
| `--output` | Path | Custom path for result |
| `--timeout` | Number | Max runtime in seconds (Default 600) |
