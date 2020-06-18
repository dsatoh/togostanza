import Handlebars from 'handlebars/dist/handlebars.runtime';

class Stanza {
  constructor(root, metadata, templates) {
    this.root      = root;
    this.metadata  = metadata;
    this.templates = templates;
  }

  render(params) {
    const template = Handlebars.template(this.templates[params.template]);
    const html     = template(params.parameters);

    this.root.innerHTML = html;
  }

  select(selector) {
    return this.root.querySelector(selector);
  }
}

export default function _Stanza(main) {
  return function init({templates, metadata, outer}) {
    const id = metadata["@id"];

    class StanzaElement extends HTMLElement {
      constructor() {
        super(...arguments);

        ensureOuterInserted(id, outer);

        const root   = this.attachShadow({mode: "open"});
        const stanza = new Stanza(root, metadata, templates);
        const params = Object.fromEntries(Array.from(this.attributes).map(({name, value}) => [name, value]));

        main(stanza, params);
      }
    }

    customElements.define(`togostanza-${id}`, StanzaElement);
  }
};

function ensureOuterInserted(id, outer) {
  if (!outer) { return; }
  if (document.querySelector(`[data-togostanza-outer="${id}"]`)) { return; }

  const outerEl = document.createElement('div');

  outerEl.setAttribute('data-togostanza-outer', id);
  outerEl.innerHTML = outer;

  document.body.append(outerEl);

  outerEl.querySelectorAll('script').forEach((orig) => {
    const el = document.createElement('script');

    el.textContent = orig.textContent;

    Array.from(orig.attributes).forEach((attr) => {
      el.setAttribute(attr.nodeName, attr.textContent);
    });

    orig.replaceWith(el);
  });
}

// TODO check attribute updates
