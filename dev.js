const { spawn } = require('child_process');
const path = require('path');

console.log('======================================================================');
console.log('🏨 HotelPro — Full Stack Development Environment');
console.log('======================================================================');
console.log('  ▸ Web Application & UI : http://localhost:5000  (All-in-One)');
console.log('  ▸ Frontend Vite Dev    : http://localhost:3001  (Hot Reloading)');
console.log('  ▸ Backend REST API     : http://localhost:5000/api');
console.log('  ▸ Evaluator Logins     : admin@hotelpro.com / admin123');
console.log('                           guest@hotelpro.com / guest123');
console.log('======================================================================\n');

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

const serverProc = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'server'),
  stdio: 'inherit',
  shell: true,
});

const clientProc = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'client'),
  stdio: 'inherit',
  shell: true,
});

const shutdown = () => {
  console.log('\n[HotelPro]: Shutting down servers gracefully...');
  serverProc.kill();
  clientProc.kill();
  process.exit();
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
