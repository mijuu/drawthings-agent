#!/usr/bin/env node

/**
 * Utility to gracefully stop the Draw Things gRPC server.
 */

const { execSync } = require('child_process');

try {
    // Find PID of gRPCServerCLI-macOS
    const output = execSync('ps aux | grep gRPCServerCLI-macOS | grep -v grep').toString();
    const lines = output.trim().split('\n');
    
    if (lines.length === 0 || !lines[0]) {
        console.log('No Draw Things server process found.');
        process.exit(0);
    }

    console.log(`Found ${lines.length} server process(es). Stopping...`);
    
    lines.forEach(line => {
        const parts = line.trim().split(/\s+/);
        const pid = parts[1];
        if (pid) {
            console.log(`Killing PID ${pid}...`);
            process.kill(pid, 'SIGTERM');
        }
    });

    console.log('Stop signal sent successfully.');
} catch (e) {
    if (e.status === 1) {
        console.log('No Draw Things server process found.');
    } else {
        console.error(`Error stopping server: ${e.message}`);
    }
}
