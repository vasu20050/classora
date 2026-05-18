const { spawn, exec } = require('child_process');
const os = require('os');

// Start the Next.js development server
const nextProcess = spawn('npx', ['next', 'dev'], { stdio: 'inherit', shell: true });

// Wait 3.5 seconds to give Next.js time to start, then open the browser
setTimeout(() => {
  const url = 'http://localhost:3000';
  console.log(`\n🌐 Auto-opening browser to ${url}\n`);
  
  if (os.platform() === 'win32') {
    exec(`start ${url}`);
  } else if (os.platform() === 'darwin') {
    exec(`open ${url}`);
  } else {
    exec(`xdg-open ${url}`);
  }
}, 3500);
