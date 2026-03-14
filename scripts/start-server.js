#!/usr/bin/env node

/**
 * Wrapper script to start Draw Things gRPC server with configured paths.
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Basic .env parser (avoiding extra dependency if possible, but standard is dotenv)
function loadEnv() {
    const envPath = path.join(__dirname, '..', '.env');
    if (!fs.existsSync(envPath)) {
        console.error('Error: .env file not found. Please copy .env.example to .env and configure it.');
        process.exit(1);
    }
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
        const [key, ...value] = line.split('=');
        if (key && value.length > 0) {
            process.env[key.trim()] = value.join('=').trim().replace(/^"(.*)"$/, '$1');
        }
    });
}

loadEnv();

const serverPath = process.env.DRAWTHINGS_SERVER_PATH;
const modelsPath = process.env.DRAWTHINGS_MODELS_PATH;
const addr = (process.env.DRAWTHINGS_SERVER_ADDR || '127.0.0.1:7859').split(':');

if (!serverPath || !modelsPath) {
    console.error('Error: DRAWTHINGS_SERVER_PATH or DRAWTHINGS_MODELS_PATH not configured in .env');
    process.exit(1);
}

// Resolve tilde (~) in paths
const finalServerPath = serverPath.replace(/^~/, process.env.HOME);
const finalModelsPath = modelsPath.replace(/^~/, process.env.HOME);

const useTls = process.env.DRAWTHINGS_USE_TLS === 'true';

console.log(`Starting Draw Things server: ${finalServerPath}`);
console.log(`Models directory: ${finalModelsPath}`);
console.log(`TLS: ${useTls ? 'Enabled' : 'Disabled (Insecure)'}`);

const args = [
    '--model-browser',
    '--no-response-compression',
    '--address', addr[0] || '127.0.0.1',
    finalModelsPath
];

if (!useTls) {
    args.push('--no-tls');
}

const server = spawn(finalServerPath, args, { stdio: 'inherit' });

server.on('error', (err) => {
    console.error(`Failed to start server: ${err.message}`);
});

server.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
});
