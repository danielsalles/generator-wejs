var _s = require('underscore.string');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var utils = require('../utils.js');

var WejsGenerator = yeoman.Base.extend({
  constructor: function () {
    yeoman.Base.apply(this, arguments);

    this.argument('name', { type: String, required: true });

    this.option('tpl');
  },
  prompting: function () {
    this.log(yosay(
      'We.js resource generator! |o/ |o/ \n generate one model, controller, resource and test for your resource!'
    ));

    var prompts = [];

    if (!this.name) {
      prompts.push({
        type    : 'input',
        name    : 'name',
        message : 'Your resource name',
        default : (this.name || this.appname) // Default to current folder name
      });
    }

    return this.prompt(prompts)
    .then(function (props) {
      this.name = (this.name || props.name);
      this.resourceName = _s.slugify(this.name);
      this.appConfigs = props;
    }.bind(this));
  },
  writing: {
    app: function app() {
      this.modelAttrs = utils.getModelAttrsFromArgs(this.args);
      this.modelAssociations = utils.getModelAssocsFromArgs(this.args);

      this.template('model.json', 'server/models/'+this.resourceName+'.json');
      this.template('controller.js', 'server/controllers/'+this.resourceName+'.js');
      this.template('resource.json', 'server/resources/'+this.resourceName+'.json');
      this.template('test.js', 'test/features/resources/'+this.resourceName+'.test.js');

      if (this.options.tpl) {
        // copy default templates for this resource
        this.directory('crud-tpls', 'server/templates/'+this.resourceName);
      }
    }
  }
});

module.exports = WejsGenerator;