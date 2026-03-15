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
        console.warn('Warning: .env file not found. Using defaults.');
        return;
    }
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

const serverPath = process.env.DRAWTHINGS_SERVER_PATH;
const modelsPath = process.env.DRAWTHINGS_MODELS_PATH;
const addrStr = process.env.DRAWTHINGS_SERVER_ADDR || '127.0.0.1:7859';
const addr = addrStr.split(':');

if (!serverPath || !modelsPath) {
    console.error('Error: DRAWTHINGS_SERVER_PATH or DRAWTHINGS_MODELS_PATH not configured in .env');
    process.exit(1);
}

// Check if server is already running
try {
    const check = execSync('ps aux | grep gRPCServerCLI-macOS | grep -v grep').toString();
    if (check.trim()) {
        console.log(`Draw Things server is already running. (Address: ${addrStr})`);
        console.log('Use "npm run server:stop" first if you want to restart with new settings.');
        process.exit(0);
    }
} catch (e) {
    // No process found, continue
}

const finalServerPath = serverPath.replace(/^~/, process.env.HOME || '');
const finalModelsPath = modelsPath.replace(/^~/, process.env.HOME || '');
// Default to true unless explicitly set to 'false'
const useTls = process.env.DRAWTHINGS_USE_TLS !== 'false';

const logFile = path.join(__dirname, '..', 'logs', 'server.log');
const logDir = path.dirname(logFile);
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

// Open log file in append mode
const out = fs.openSync(logFile, 'a');
const err = fs.openSync(logFile, 'a');

const log = (msg) => {
    const timestamp = new Date().toISOString();
    const formattedMsg = `[${timestamp}] ${msg}\n`;
    process.stdout.write(formattedMsg);
    fs.writeSync(out, formattedMsg);
};

log(`Starting Draw Things server: ${finalServerPath}`);
log(`Models path: ${finalModelsPath}`);
log(`Address: ${addrStr}`);
log(`TLS Enabled: ${useTls}`);

const args = [
    '--model-browser',
    '--no-response-compression',
    '--address', addr[0] || '127.0.0.1',
    finalModelsPath
];

if (!useTls) {
    log('Adding --no-tls flag (Insecure mode)');
    args.push('--no-tls');
} else {
    log('Server starting in TLS mode (default)');
}

const server = spawn(finalServerPath, args, { 
    stdio: ['ignore', out, err],
    detached: true 
});

server.unref();

// Write PID to a file for tracking
const pidFile = path.join(__dirname, '..', '.server.pid');
fs.writeFileSync(pidFile, server.pid.toString());

log(`Server spawned with PID: ${server.pid}. Verification in 5s...`);

// Wait a few seconds to see if it crashes immediately
setTimeout(() => {
    try {
        process.kill(server.pid, 0);
        log('Server process is still running.');
        process.exit(0);
    } catch (e) {
        log('Server process failed to start or crashed immediately. Check logs.');
        process.exit(1);
    }
}, 5000);
