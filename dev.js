import { spawn } from 'child_process';
import path from 'path';

console.log(`
🛡️ ==============================================================
🛡️   STARTING TRUSTGUARD AI (SERVER & CLIENT)
🛡️   Client: http://localhost:5173
🛡️   Server: http://localhost:5000
🛡️ ==============================================================
`);

const server = spawn('npm', ['run', 'dev'], {
  cwd: path.resolve('server'),
  stdio: 'inherit',
  shell: true
});

const client = spawn('npm', ['run', 'dev'], {
  cwd: path.resolve('client'),
  stdio: 'inherit',
  shell: true
});

function cleanup() {
  console.log('\n🛑 Shutting down TrustGuard AI...');
  server.kill();
  client.kill();
  process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
