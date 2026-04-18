Esto es un monorepo osea, que hay tres servicios corriendo.
Los scripts de consola fueron abreviados usando la dependencia turborepo si se quiere:

# Levantar los tres servicios en paralelo
npm run dev

# Buildear todo (respetando dependencias)
npm run build

# Solo un servicio específico
npx turbo run dev --filter=backend
npx turbo run dev --filter=frontend