import * as shell from "shelljs";

shell.cp("-R", "node_modules/govuk-frontend/govuk/assets", "dist/");
shell.cp("-R", "node_modules/govuk-frontend/govuk/all.js", "dist/assets/");

shell.cp("-R", "node_modules/nhsuk-frontend/dist/", "dist/assets/nhsuk-frontend/");
