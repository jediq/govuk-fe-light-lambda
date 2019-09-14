function env(str: string, defalt: string): string {
    return process.env["npm_config_" + str] || process.env[str] || defalt;
}

export default {
    debug: env("debug", "false") === "true",
    renderer: env("renderer", "govuk")
};
