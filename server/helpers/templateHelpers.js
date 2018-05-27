const HandlebarsDirectory = require('handlebars-directory');
const path = require('path');

const renderView = HandlebarsDirectory(path.join(__dirname, '..', 'templates'), 'hbs');

module.exports = renderView;
