#!/usr/bin/env node

/**
 * Utility to gracefully restart the Draw Things gRPC server.
 */

const { execSync, spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

async function restart() {
    console.log('Restarting Draw Things server...');

    // 1. Stop the server
    try {
        require('./stop-server.js');
    } catch (e) {
        console.error('Error calling stop-server:', e.message);
    }

    // 2. Wait for it to actually die
    let attempts = 0;
    while (attempts < 5) {
        try {
            const check = execSync('ps aux | grep gRPCServerCLI-macOS | grep -v grep').toString();
            if (!check.trim()) break;
            console.log('Waiting for old process to exit...');
            await new Promise(r => setTimeout(r, 1000));
            attempts++;
        } catch (e) {
            break; // No process found
        }
    }

    // 3. Start the server
    console.log('Starting fresh server...');
    const startScript = path.join(__dirname, 'start-server.js');
    spawnSync('node', [startScript], { stdio: 'inherit' });
}

restart();
