import * as shell from "shelljs";

shell.cp("-R", "src/public/images", "dist/public/");
shell.cp("-R", "src/templates", "dist/templates/");
shell.cp("-R", "node_modules/govuk-frontend/govuk/assets", "dist/");
shell.cp("-R", "node_modules/govuk-frontend/govuk/all.js", "dist/assets/");
shell.exec("rsync -a --include '*/' --include '*.njk' --exclude '*' src/ dist/");
