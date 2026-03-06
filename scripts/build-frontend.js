import { spawn } from 'node:child_process'
import { cp, rm } from 'node:fs/promises'
import { resolve } from 'node:path'

async function run(cmd, args, opts = {}) {
  return new Promise((resolveRun, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit', shell: true, ...opts })
    p.on('exit', (code) => (code === 0 ? resolveRun() : reject(new Error(`${cmd} ${args.join(' ')} failed`))))
  })
}

async function main() {
  const frontendDir = resolve(process.cwd(), 'public', 'frontend_ava1')
  const distDir = resolve(frontendDir, 'dist')
  const targetPublic = resolve(process.cwd(), 'public')

  console.log('Installing frontend deps...')
  await run('npm', ['install'], { cwd: frontendDir })

  console.log('Building frontend...')
  await run('npm', ['run', 'build'], { cwd: frontendDir })

  console.log('Copying build to backend public folder...')
  // remove existing static assets that would be replaced
  // copy dist/* -> public/
  await cp(distDir, targetPublic, { recursive: true })

  console.log('Frontend build copied to', targetPublic)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
