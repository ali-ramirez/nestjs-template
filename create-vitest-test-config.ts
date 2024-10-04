import { loadEnv } from 'vite';
import { InlineConfig } from 'vitest';


export const createVitestTestConfig = (testingType: string): InlineConfig => {
  return {
    root: "./",
    globals: true,
    isolate: false,
    passWithNoTests: true,
    environment: "node",
    // Incluir los archivos de prueba con varios niveles de carpetas
    include: [
      `tests/${testingType}/**/*.test.ts`,  // Archivos .test.ts a cualquier nivel
      `tests/${testingType}/**/*.spec.ts`,  // Archivos .spec.ts a cualquier nivel
    ],
    env: loadEnv("test", process.cwd(), ""),
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      reportsDirectory: `coverage/${testingType}`,
      // Cobertura solo para archivos relevantes en src/
      include: ["src/**/*.ts", "src/**/**/*"],
      exclude: [
       "src/main.ts",  // Excluir archivos de arranque o configuraciones globales
        "src/**/*.module.ts",  // Excluir módulos de NestJS
        "src/**/*.dto.ts",  // Excluir DTOs, si no tienen lógica que probar
        "src/**/*.entity.ts",  // Excluir entidades, si no son relevantes para las pruebas
        "src/**/*.config.ts",  // Excluir configuraciones o servicios de configuración
        "**/node_modules/**",  // Excluir siempre los módulos de dependencias externas
      ],
    },
  };
};

