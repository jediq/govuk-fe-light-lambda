import { Context } from "../Context";
import logger from "../util/logger";

export class Page {
    public render(context: Context) {
        return this.htmlTopWrap + this.renderContent(context) + this.htmlBottomWrap;
    }

    protected renderContent(context: Context) {
        return "";
    }

    private htmlTopWrap = `
<!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
  </head>

  <body>
    <script>
      document.body.className = document.body.className ? document.body.className + " js-enabled" : "js-enabled";
    </script>
  `;

    private htmlBottomWrap = `
  </body>
</html>
  `;
}
