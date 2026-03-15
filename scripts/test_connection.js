const path = require('path');
const fs = require('fs');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Basic .env parser
function loadEnv() {
    const envPath = path.join(__dirname, '..', '.env');
    if (!fs.existsSync(envPath)) return;
    const content = fs.readFileSync(envPath, 'utf8');
    content.split(/\r?\n/).forEach(line => {
        line = line.trim();
        if (!line || line.startsWith('#')) return;
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            const value = valueParts.join('=').trim().replace(/^["'](.*)["']$/, '$1');
            process.env[key.trim()] = value;
        }
    });
}
loadEnv();

const PROTO_PATH = path.join(__dirname, 'imageService.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true, longs: String, enums: String, defaults: true, oneofs: true
});

const drawthings = grpc.loadPackageDefinition(packageDefinition);
const addr = process.env.DRAWTHINGS_SERVER_ADDR || '127.0.0.1:7859';
const useTls = process.env.DRAWTHINGS_USE_TLS !== 'false';

console.log(`Testing connection to ${addr} (TLS: ${useTls})...`);

let credentials;
if (useTls) {
    const caCert = fs.readFileSync(path.join(__dirname, 'drawthings-ca.pem'));
    credentials = grpc.credentials.createSsl(caCert);
} else {
    credentials = grpc.credentials.createInsecure();
}

const client = new drawthings.ImageGenerationService(addr, credentials, {
    'grpc.max_receive_message_length': -1,
    'grpc.max_send_message_length': -1
});

client.Echo({ name: 'test' }, (err, response) => {
    if (err) {
        console.error('Connection failed:', err.message);
        if (useTls && err.code === 14) {
            console.error('Hint: If server is NOT using TLS, set DRAWTHINGS_USE_TLS=false in .env');
        } else if (!useTls && err.message.includes('SSL')) {
            console.error('Hint: If server IS using TLS, set DRAWTHINGS_USE_TLS=true in .env');
        }
    } else {
        console.log('Connection successful!');
        console.log('Server response:', response.message);
    }
    process.exit(0);
});
