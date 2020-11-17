export default function registerHandlebarsHelpers(Handlebars) {
  Handlebars.registerHelper('eq', (x, y) => x === y);
}
