# Draw Things gRPC Protocol

This document describes the gRPC protocol used by Draw Things server.

## Server Configuration

**Default endpoint:** `127.0.0.1:7859`

**Start command:**
```bash
[SERVER_PATH] \
  --model-browser --no-tls --no-response-compression \
  --address 127.0.0.1 \
  [MODELS_PATH]
```

## Service Definition

The Draw Things gRPC service provides image generation capabilities.

### Services

#### MediaGenerationService

Main service for generating images.

**Methods:**

1. `GenerateImage(GenerateImageRequest) returns (GenerateImageResponse)`
   - Generates an image based on prompt and parameters

2. `GetModelList(GetModelListRequest) returns (GetModelListResponse)`
   - Lists available models

3. `Echo(EchoRequest) returns (EchoResponse)`
   - Health check endpoint

### Message Types

#### GenerateImageRequest

```protobuf
message GenerateImageRequest {
  string prompt = 1;                    // Text prompt
  string negative_prompt = 2;           // Negative prompt
  int32 width = 3;                      // Width (multiple of 64)
  int32 height = 4;                     // Height (multiple of 64)
  int32 steps = 5;                      // Inference steps
  int64 seed = 6;                       // Random seed (0 = random)
  float guidance = 7;                   // Guidance scale
  string sampler = 8;                   // Sampler name
  string model_name = 9;                // Model filename
  int32 batch_size = 10;                // Number of images (default: 1)
  float strength = 11;                  // For img2img (0-1)
  // ... additional fields for img2img, controlnet, etc.
}
```

#### GenerateImageResponse

```protobuf
message GenerateImageResponse {
  bytes image_data = 1;                 // PNG image data
  int32 width = 2;                      // Actual width
  int32 height = 3;                     // Actual height
  int64 seed = 4;                       // Actual seed used
  string model_name = 5;                // Model used
  int32 steps = 6;                      // Steps completed
  float inference_time = 7;             // Generation time in seconds
}
```

#### GetModelListRequest

```protobuf
message GetModelListRequest {
  // Empty or filter options
}
```

#### GetModelListResponse

```protobuf
message GetModelListResponse {
  repeated ModelInfo models = 1;
}

message ModelInfo {
  string name = 1;                      // Model filename
  string display_name = 2;              // Human-readable name
  string type = 3;                      // Model type (diffusion, vae, etc.)
  int64 size_bytes = 4;                 // File size
}
```

#### EchoRequest/Response

```protobuf
message EchoRequest {
  string message = 1;
}

message EchoResponse {
  string message = 1;
  int64 timestamp = 2;
}
```

## Usage Examples

### Health Check

```bash
# Using grpcurl (if available)
grpcurl -plaintext 127.0.0.1:7859 drawthings.MediaGenerationService/Echo
```

### List Models

```bash
grpcurl -plaintext 127.0.0.1:7859 drawthings.MediaGenerationService/GetModelList
```

### Generate Image (Node.js with @grpc/grpc-js)

```javascript
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load proto (need actual .proto file from Draw Things)
const packageDefinition = protoLoader.loadSync('drawthings.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const drawthingsProto = grpc.loadPackageDefinition(packageDefinition);
const client = new drawthingsProto.drawthings.MediaGenerationService(
  '127.0.0.1:7859',
  grpc.credentials.createInsecure()
);

const request = {
  prompt: 'a cat sitting on a windowsill',
  negative_prompt: 'blurry, low quality',
  width: 512,
  height: 512,
  steps: 8,
  seed: 0,
  guidance: 1.0,
  sampler: 'unicpc-trailing',
  model_name: 'z_image_turbo_1.0_q6p.ckpt'
};

client.GenerateImage(request, (err, response) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  
  // Save image
  const fs = require('fs');
  fs.writeFileSync('output.png', response.image_data);
  console.log('Image saved to output.png');
});
```

## Error Codes

| Code | Name | Description |
|------|------|-------------|
| 0 | OK | Success |
| 3 | INVALID_ARGUMENT | Invalid parameters (e.g., wrong dimensions) |
| 4 | DEADLINE_EXCEEDED | Timeout (model loading or generation) |
| 14 | UNAVAILABLE | Server not running or connection refused |
| 13 | INTERNAL | Server error during generation |

## Performance Notes

- **First request:** ~30s extra for model loading into GPU
- **Subsequent requests:** ~30-90s depending on resolution and steps
- **Model loading:** Happens once per model switch
- **GPU memory:** Models stay loaded until server restart

## Security Considerations

- Server binds to specified address (default 0.0.0.0)
- Use `--address 127.0.0.1` for local-only access
- Use `--shared-secret` for authentication in network deployments
- TLS can be enabled (default on, use `--no-tls` to disable)

## Getting Proto Definitions

The actual `.proto` file can be extracted from the Draw Things app or obtained from:
- Draw Things community releases
- Reverse engineering the gRPC server (using grpcurl reflection)

```bash
# If server supports reflection
grpcurl -plaintext 127.0.0.1:7859 list
grpcurl -plaintext 127.0.0.1:7859 describe drawthings.MediaGenerationService
```
