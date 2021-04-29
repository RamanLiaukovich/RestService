import { LightningElement, api } from 'lwc';

export default class JsonPrettier extends LightningElement {
    @api json;
    isArray = false;
    containerClass = 'pretty-container';

    renderedCallback() {
        const container = this.template.querySelector('[data-id="container"]');
        container.innerHTML = this.syntaxHighlight(this.json);
    }

    syntaxHighlight(json) {
        if (typeof json != 'string') {
            json = JSON.stringify(json, undefined, 2);
        }

        if (json[0] === '[') {
            this.isArray = true;
            this.containerClass = 'pretty-container-arrow';
        }

        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').substring(1, json.length - 1);
        json = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            let cls = 'number';

            if (/^"/.test(match)) {

                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return cls != 'key' 
                        ? '<span class="' + cls + '">' + ' ' + match + '</span>' 
                        : '&emsp;<div class="new-line"><span class="' + cls + '">' + match + '</span>'
        });

        return (json.replaceAll('&emsp;', '</div>&emsp;') + '</div>')
                .replaceAll('</span>\n  },\n  {\n    </div>', '</div><div class="new-line-arrow">},</div><div class="new-line-arrow">{</div>');
    }
}