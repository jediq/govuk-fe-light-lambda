import * as shell from "shelljs";

shell.cp("-R", "src/public/images", "dist/public/");
shell.cp("-R", "src/templates", "dist/templates/");
shell.cp("-R", "node_modules/govuk-frontend/assets", "dist/");
shell.cp("-R", "node_modules/govuk-frontend/all.js", "dist/assets/");
