var page_count=1;
var issue_count = 1;

var Issue_view = Backbone.View.extend({
	model : Issue_model,
	tagName : 'tr',
	template : _.template($('#table_row_template').html()),
	render : function(){
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

var refsView = Backbone.View.extend({
	model : refModel,
	tagName : 'span',
	template : _.template($('#buttontemp').html()),
	render : function(){
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});




var LocaleEv = Backbone.View.extend({
	el : '#locale',
	initialize : function () {
	},
	events : {
		'click #querybtn': 'loadissues',
		'click #next': 'loadnextpage'	
	},

	loadissues : function(e) {
		e.preventDefault();
		this.removeChild();
		var v = 1;
		var str = this.loadurl(v);
		var data = new Repo_Model(str);
		var app = new Repo_view( data );
	},
	
	
	loadnextpage: function(e) {
		console.log("here");
		this.removeChild();
		page_count++;
		var str = this.loadurl(page_count);
		var data = new Repo_Model(str);
		var app = new Repo_view( data );
	},
	
	
	loadurl:function(v) {
		var str = 'https://api.github.com/repos/';
		str = str + document.getElementById('repouser').value+'/';
		str = str + document.getElementById('reponame').value+'/';
		str = str + 'issues?per_page='
		str = str + document.getElementById('issues').value;
		str = str + '&page=' + v;
		return str;
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
			var that = this;
			var temp_val = 1;
			_.each(this.collection.models, function(model) {
				model.set({count_id:issue_count++});
				temp_val++;
				that.renderIssues(model);
			},this);
			if(temp_val>1) 
			{
				var refv = new refsView({
					model : new refModel()
				});
				this.removeChildEl();
				$('#nextb').append(refv.render().$el);
			}
			if(temp_val<10) {
				console.log("here");
				document.getElementById("nextb").clear()
			}
	},
	
	
	renderIssues : function( issue ) {
		var newIssue = new Issue_view({
			model : issue
		});
		$('#issue-table').append(newIssue.render().$el);
	},
	
	
	removeChildEl: function() {
		var el = document.getElementById('nextb');
		while( el.hasChildNodes() ){
		    el.removeChild(el.lastChild);
		}
	}
});

