import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, "../");

console.log("🔍 Diagnóstico de estructura:\n");

function checkFile(filePath) {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${path.relative(srcDir, filePath)}`);
    return true;
  } else {
    console.log(`❌ ${path.relative(srcDir, filePath)} (NO EXISTE)`);
    return false;
  }
}

// Verificar archivos clave
checkFile(path.join(srcDir, "services", "driveService.ts"));
checkFile(path.join(srcDir, "hooks", "usePhotos.ts"));
checkFile(path.join(srcDir, "types", "types.ts"));
checkFile(path.join(srcDir, "screens", "adventureBook.tsx"));

// Verificar exportaciones
console.log("\n📦 Verificando package.json...");
const pkg = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../../package.json"), "utf8"),
);
console.log("Scripts:", Object.keys(pkg.scripts).join(", "));

// Verificar dependencias
console.log("\n📚 Dependencias clave:");
const deps = { ...pkg.dependencies, ...pkg.devDependencies };
["react", "typescript", "vite"].forEach((dep) => {
  console.log(`${dep}: ${deps[dep] ? "✅" : "❌"}`);
});
