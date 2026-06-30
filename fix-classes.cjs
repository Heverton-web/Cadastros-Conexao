const fs = require("fs");
const file = "src/components/admin/CentralAcoesTab.tsx";
let content = fs.readFileSync(file, "utf8");
content = content.replace(
  /^\s*className="bg-bg-dark text-text-main"\s*$/gm,
  "",
);
content = content.replace(
  /^\s*className="bg-bg-dark text-text-muted"\s*$/gm,
  "",
);
fs.writeFileSync(file, content);
