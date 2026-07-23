import sharp from 'sharp'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')

const svgBuffer = readFileSync(join(publicDir, 'logo.svg'))

const sizes = [
  { name: 'favicon', size: 32 },
  { name: 'icon-192', size: 192 },
  { name: 'icon-512', size: 512 },
]

async function generate() {
  for (const { name, size } of sizes) {
    const outputPath = join(publicDir, `${name}.png`)
    
    console.log(`Generating ${outputPath} (${size}x${size})...`)
    
    await sharp(svgBuffer)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .png()
      .toFile(outputPath)
  }
  
  // Also copy logo.svg as apple-icon.svg for apple touch icon
  const appleIconPath = join(publicDir, 'apple-icon.png')
  console.log(`Generating ${appleIconPath} (180x180)...`)
  await sharp(svgBuffer)
    .resize(180, 180, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .png()
    .toFile(appleIconPath)

  console.log('✅ All icons generated successfully!')
}

generate().catch(err => {
  console.error('❌ Error generating icons:', err)
  process.exit(1)
})
