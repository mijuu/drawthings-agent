#!/usr/bin/env node

/**
 * Wrapper script to start Draw Things gRPC server with configured paths.
 */

const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Basic .env parser
function loadEnv() {
    const envPath = path.join(__dirname, '..', '.env');
    if (!fs.existsSync(envPath)) {
        console.error('Error: .env file not found.');
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

// Check if server is already running
try {
    const check = execSync('ps aux | grep gRPCServerCLI-macOS | grep -v grep').toString();
    if (check.trim()) {
        console.log('Draw Things server is already running. Skipping start.');
        process.exit(0);
    }
} catch (e) {
    // No process found, continue
}

const finalServerPath = serverPath.replace(/^~/, process.env.HOME);
const finalModelsPath = modelsPath.replace(/^~/, process.env.HOME);
const useTls = process.env.DRAWTHINGS_USE_TLS === 'true';

const logFile = path.join(__dirname, '..', 'logs', 'server.log');
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

const log = (msg) => {
    const timestamp = new Date().toISOString();
    const formattedMsg = `[${timestamp}] ${msg}\n`;
    process.stdout.write(formattedMsg);
    logStream.write(formattedMsg);
};

log(`Starting Draw Things server: ${finalServerPath}`);

const args = [
    '--model-browser',
    '--no-response-compression',
    '--address', addr[0] || '127.0.0.1',
    finalModelsPath
];

if (!useTls) {
    args.push('--no-tls');
}

const server = spawn(finalServerPath, args, { 
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: true // Allow it to live independently
});

server.stdout.on('data', (data) => logStream.write(data));
server.stderr.on('data', (data) => logStream.write(data));

server.unref();

// Write PID to a file for tracking
const pidFile = path.join(__dirname, '..', '.server.pid');
fs.writeFileSync(pidFile, server.pid.toString());

console.log(`Server started with PID: ${server.pid}. Process is detached.`);
process.exit(0); // Exit the wrapper but leave the spawned server running
