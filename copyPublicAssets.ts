import * as shell from "shelljs";

shell.exec("rsync -a --include '*/' --include '*' src/public/ dist/assets");
shell.exec("rsync -a --include '*/' --include '*.njk' --exclude '*' src/ dist/");
