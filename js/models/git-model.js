var Issue_model = Backbone.Model.extend({
	defaults:{
		title:'none',
		created_at:'none',
		html_url:'none',
		count_id:0
	},
});

var nextModel = Backbone.Model.extend({
	defaults:{
		text:'next'
	},
});

var previousModel = Backbone.Model.extend({
	defaults:{
		text:'previous'
	},
});

var Repo_Model = Backbone.Collection.extend({
	model : Issue_model,
	initialize : function( arg) {
		this.url = arg;
		console.log(this.url);
	},
	url : ''
});
