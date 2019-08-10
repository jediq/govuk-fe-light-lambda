import { Context } from "../Context";
import { Page } from "./Page";
import logger from "../util/logger";
import nunjucks from "nunjucks";
import fs from "fs";

export class GovUkPage extends Page {
    public render(context: Context): string {
        nunjucks.configure(["node_modules/govuk-frontend/"], {
            autoescape: true
        });

        var opts = {
            pageTitle: context.service.name
        };

        var output = nunjucks.renderString(this.template, opts);

        return output;
    }

    private template = `
{% extends "govuk/template.njk" %}

{% block pageTitle %}
  <title>{{pageTitle}}</title>
{% endblock %}

{% block header %}
{{ govukHeader({
  homepageUrl: "#",
  serviceName: "{{pageTitle}}",
  serviceUrl: "#"}) }}
{% endblock %}

`;
}
