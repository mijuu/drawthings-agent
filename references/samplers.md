# Draw Things Samplers Reference

Samplers control how the model progressively removes noise to form an image.

## Quick Selection

**For z-image-turbo (recommended):**
- `unicpc-trailing` — Best quality/speed balance (default)
- `euler-a-trailing` — More diverse, slightly less consistent
- `dpmpp2m-ays` — Optimized for 5-10 step generation

**Avoid with turbo models:**
- Any sampler with `karras` suffix
- `plms`, `tcd`, `unicpc` (without suffix)

## Sampler Categories

### Base Algorithms

| Algorithm | Description | Best For |
|-----------|-------------|----------|
| **Euler A** | First-order solver with ancestral randomness | Diverse results, creative exploration |
| **DDIM** | Deterministic solver | Reproducible results, same seed = same image |
| **DPM++ 2M** | Second-order multistep solver | High quality, uses two previous steps |
| **DPM++ SDE** | Stochastic DPM++ variant | Richer details, ~2x slower |
| **UniPC** | Unified Predictor-Corrector | Good quality at low step counts |
| **LCM** | Latent Consistency Model | Ultra-fast (1-4 steps), less detail |

### Schedule Suffixes

| Suffix | Description | Use Case |
|--------|-------------|----------|
| **Trailing** | Uniform steps, ends at exactly zero noise | Turbo/few-step models (REQUIRED) |
| **Karras** | More steps at high noise, fewer at low noise | Traditional SD 1.5/SDXL models |
| **AYS** | Align Your Steps, mathematically optimized | 5-10 step generation |
| **Substep** | Subdivides each step for precision | Fine detail at same step count |

## Why Trailing Matters for Turbo

Turbo models like z-image-turbo are designed for 4-8 step generation. With so few steps:

- **Karras** schedules may stop at noise level > 0, producing slightly blurry results
- **Trailing** ensures the last step reaches exactly zero noise
- This is why Karras samplers fail with turbo models

## Full Sampler List

### Compatible with z-image-turbo

| CLI Value | Base | Schedule | Notes |
|-----------|------|----------|-------|
| `unicpc-trailing` | UniPC | Trailing | **Recommended default** |
| `euler-a` | Euler A | Default | Good for exploration |
| `euler-a-trailing` | Euler A | Trailing | Diverse + proper ending |
| `ddim` | DDIM | Default | Deterministic |
| `ddim-trailing` | DDIM | Trailing | Deterministic + proper ending |
| `lcm` | LCM | Default | Fastest (1-4 steps) |
| `euler-a-substep` | Euler A | Substep | Fine detail |
| `dpmpp2m-ays` | DPM++ 2M | AYS | Optimized 5-10 steps |
| `euler-a-ays` | Euler A | AYS | Optimized 5-10 steps |
| `dpmpp2m-trailing` | DPM++ 2M | Trailing | High quality |
| `dpmpp-sde-trailing` | DPM++ SDE | Trailing | Richest detail, 2x slower |
| `unicpc-ays` | UniPC | AYS | Optimized 5-10 steps |

### NOT Compatible with z-image-turbo

| CLI Value | Reason |
|-----------|--------|
| `dpmpp2m-karras` | Karras schedule incompatible |
| `plms` | Legacy sampler, not supported |
| `dpmpp-sde-karras` | Karras schedule incompatible |
| `unicpc` | Missing schedule suffix |
| `tcd` | Not supported by turbo models |
| `dpmpp-sde-substep` | Not supported |
| `dpmpp-sde-ays` | Not supported |

## Recommended Settings by Use Case

### Fast Thumbnails (30-40s)
```
--steps 4 --sampler lcm --width 512 --height 512
```

### Standard Quality (40-60s)
```
--steps 8 --sampler unicpc-trailing --width 512 --height 512
```

### High Quality (60-90s)
```
--steps 12 --sampler dpmpp2m-ays --width 768 --height 768
```

### Portrait/Optimized
```
--steps 8 --sampler euler-a-trailing --width 512 --height 768
```

### Landscape/Optimized
```
--steps 8 --sampler unicpc-trailing --width 768 --height 512
```

## Step Count Guidelines

| Steps | Quality | Time | Use Case |
|-------|---------|------|----------|
| 4 | Low | ~30s | Thumbnails, quick iteration |
| 6-8 | Medium | ~40-60s | Standard generation |
| 10-12 | High | ~60-90s | Final outputs |
| 16+ | Diminishing returns | 2min+ | Rarely needed |

## Troubleshooting Samplers

| Issue | Solution |
|-------|----------|
| Blurry output | Use `trailing` suffix, not `karras` |
| Artifacts | Try `unicpc-trailing` or reduce steps |
| Too random | Use `ddim` or `ddim-trailing` for determinism |
| Slow generation | Avoid `dpmpp-sde-*` samplers (2x slower) |
| Model error | Ensure sampler is compatible with model |
