const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = path.join(__dirname, 'imageService.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const drawthings = grpc.loadPackageDefinition(packageDefinition);
console.log('Available services:', Object.keys(drawthings));

const client = new drawthings.ImageGenerationService('127.0.0.1:7859', grpc.credentials.createInsecure(), {
    'grpc.max_receive_message_length': -1,
    'grpc.max_send_message_length': -1,
    'grpc.default_compression_algorithm': 0,
    'grpc.default_compression_level': 0
});

client.Echo({ name: 'test', sharedSecret: '' }, (err, response) => {
    if (err) {
        console.error('Echo error:', err);
    } else {
        console.log('Echo response:', response);
    }
    process.exit(0);
});
