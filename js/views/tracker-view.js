var global=false;

var Issue_view = Backbone.View.extend({
	model : Issue_model,
	tagName : 'tr',
	template : _.template($('#table_row_template').html()),
	render : function(){
		//console.log(this.model.toJSON());
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});




var LocaleEv = Backbone.View.extend({
	el : '#locale',
	initialize : function () {
	},
	events : {
		'click #querybtn': 'loadissues'
	},

	loadissues : function(e) {
		e.preventDefault();
		this.removeChild();
		var str = 'https://api.github.com/repos/';
		str = str + document.getElementById('repouser').value+'/';
		str = str + document.getElementById('reponame').value+'/';
		str = str + 'issues?per_page='
		str = str + document.getElementById('issues').value;
		
		var data = new Repo_Model(str);
		var app = new Repo_view( data );
		
	},
	
	removeChild: function() {
		var el = document.getElementById('issue-table');
		while( el.hasChildNodes() ){
		    el.removeChild(el.lastChild);
		}
	}
});


var Repo_view = Backbone.View.extend({
	el : '#issue-table',
	initialize : function( data ) {
		this.collection = data;
		this.listenTo( this.collection, 'update', this.render, this );
		this.collection.fetch({ data: { fetch:true ,silent:true} });
		//this.render();
	},
	
	
	render: function() {
			console.log("called");
			var that = this;
			var temp_val = 1;
			_.each(this.collection.models, function(model) {
				model.set({count_id:temp_val++});
				that.renderIssues(model);
			},this);
	},
	renderIssues : function( issue ) {
		//console.log(issue.toJSON());
		var newIssue = new Issue_view({
			model : issue
		});
		//console.log(newIssue.render().el);
		$('#issue-table').append(newIssue.render().$el);
	}
})

