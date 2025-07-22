// src/swagger/swagger-custom.ts
export const customSwaggerOptions = {
  customSiteTitle: 'Documentación API - SaluVet',
  customfavIcon: 'https://nestjs.com/img/logo-small.svg',
  customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',

  swaggerOptions: {
    persistAuthorization: true,

    docExpansion: 'none', // 'none' | 'list' | 'full' => Cómo se muestran las rutas al cargar
    displayRequestDuration: true, // ⏱ Muestra cuánto tarda cada request
    tryItOutEnabled: true, // ✅ Permite hacer pruebas desde el panel

    filter: true, // 🔍 Agrega un input para filtrar endpoints por nombre
    tagsSorter: 'alpha', // 🔠 Ordena los tags alfabéticamente
    operationsSorter: 'alpha', // 🔠 Ordena las operaciones dentro de cada tag

  },
};
