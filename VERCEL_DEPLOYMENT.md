# Instrucciones para deployment en Vercel

## Pasos para solucionar el problema de localhost vs Vercel:

### 1. Configurar Variables de Entorno en Vercel:
   - Ve a tu proyecto en Vercel Dashboard
   - Settings → Environment Variables
   - Agrega TODAS las variables del archivo .env.example

### 2. Forzar nuevo deployment:
   ```bash
   # Hacer un commit con cambios
   git add .
   git commit -m "Fix: Configure environment variables for Vercel"
   git push origin main
   ```

### 3. Si el problema persiste, forzar re-deployment:
   - Ve a Vercel Dashboard → tu proyecto
   - Deployments → Find latest deployment
   - Click "..." → "Redeploy"

### 4. Verificar que las variables estén configuradas:
   - En tu app desplegada, abre Developer Tools (F12)
   - Console → escribe: `console.log(import.meta.env)`
   - Verifica que las variables VITE_ estén presentes

### 5. Limpiar caché si es necesario:
   - Vercel Dashboard → Settings → General
   - Scroll down → "Reset Deployment Cache"

## Problemas comunes:
- ❌ Variables no configuradas en Vercel
- ❌ Cache de Vercel mostrando versión anterior
- ❌ Diferencias de timezone en timestamps
- ❌ CORS issues entre localhost y producción