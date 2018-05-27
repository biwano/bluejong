const HandlebarsDirectory = require('handlebars-directory');

const renderView = HandlebarsDirectory('/home/biwano/code/bluejong/server/templates', 'hbs');

module.exports = renderView;
