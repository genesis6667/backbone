var per_page = document.getElementById("issues").value;

var Issue_view = Backbone.View.extend({
	model : Issue_model,
	tagName : 'tr',
	template : _.template($('#table_row_template').html()),
	render : function(){
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

var nextView = Backbone.View.extend({
	model : nextModel,
	tagName : 'span',
	template : _.template($('#nextbuttontemp').html()),
	render : function(){
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

var previousView = Backbone.View.extend({
	model : previousModel,
	tagName : 'span',
	template : _.template($('#prevbuttontemp').html()),
	render : function(){
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});




var LocaleEv = Backbone.View.extend({
	el : '#locale',
	initialize : function () {
		this.page_count=1;
		this.issue_count=1;
		this.value="";
	},
	events : {
		'click #querybtn' : 'loadissues',
		'click #next' : 'loadnextpage' ,
		'click #previous' : 'loadprevpage',
		'change #repouser' : 'reinitvars',
		'change #op' : 'loadopen',
		'change #op24' : 'loadopen',
		'change #op7' : 'loadopen',
		'change #opg7' : 'loadopen'
	},

	reinitvars : function(e) {
		e.preventDefault();
		this.initialize();
	},
	
	
	loadissues : function(e) {
		this.initialize();
		e.preventDefault();
		this.removeChild();
		var v = 1;
		this.value="";
		var str = this.loadfilterurl("",v);
		var data = new Repo_Model(str);
		var app = new Repo_view( data,this );
	},
	
	
	loadnextpage: function(e) {
		this.removeChild();
		this.page_count++;
		var str = this.loadfilterurl(this.value,this.page_count);
		var data = new Repo_Model(str);
		var app = new Repo_view( data,this );
	},
	
	loadprevpage: function(e) {
		this.removeChild();
		this.page_count--;
		this.issue_count--;
		if(this.issue_count%per_page!=0) {
			this.issue_count = Number(this.issue_count) - Number(this.issue_count%per_page);
			this.issue_count = Number(this.issue_count) - Number(per_page);
		}else {
			this.issue_count = Number(this.issue_count) - Number(per_page) - Number(per_page);
		}
		this.issue_count++;
		
		console.log(this.issue_count);
		var str = this.loadfilterurl(this.value,this.page_count);
		var data = new Repo_Model(str);
		var app = new Repo_view( data,this );
	},
	
	loadopen: function (e) {
		this.initialize();
		e.preventDefault();
		this.removeChild();
		this.value = e.target.value;
		var str = this.loadfilterurl(e.target.value,this.page_count);
		var data = new Repo_Model(str);
		var app = new Repo_view( data,this );
	},
	
	
	loadfilterurl:function(value,v) {
		var str = 'https://api.github.com/repos/';
		str = str + document.getElementById('repouser').value+'/';
		str = str + document.getElementById('reponame').value+'/';
		str = str + 'issues?';
		var date = new Date();
		switch (value) {
		case 'open':
				str  = str + '&state=open';
			break;
		case '24hrs':
				str  = str + '&state=open';
				date.setDate(date.getDate()-1);
				str  = str + '&since=' + date.toISOString();
			break;
		case 'week':
				str  = str + '&state=open';
				date.setDate(date.getDate()-7);
				str  = str + '&since=' + date.toISOString();
			break;
		case 'opg7':
				str  = str + '&state=open';
				date.setMonth(0);
				date.setDate(1);
				date.setFullYear(date.getFullYear()-1)
				console.log(date.toISOString());
				str  = str + '&since=' + date.toISOString();
			break;
		default:
			break;
		}
		str = str + '&per_page='
		str = str + document.getElementById('issues').value;
		str = str + '&page=' + v;
		return str;
	},
	
	removeChild: function() {
		var el = document.getElementById('issue-table');
		while( el.hasChildNodes() ){
		    el.removeChild(el.lastChild);
		}
	},
});


var Repo_view = Backbone.View.extend({
	el : '#issue-table',
	initialize : function( data , glob_ev) {
		this.collection = data;
		this.listenTo( this.collection, 'update', this.render, this );
		this.collection.fetch({ data: { fetch:true ,silent:true} });
		this.gev = glob_ev;
		//this.render();
	},
	
	
	render: function() {
			var that = this;
			var temp_val = 1;
			_.each(this.collection.models, function(model) {
				model.set({count_id:this.gev.issue_count++});
				temp_val++;
				that.renderIssues(model);
			},this);
			if(temp_val>1) {
				var refv = new nextView({
					model : new nextModel()
				});
				this.removeChildEl();
				$('#nextb').append(refv.render().$el);
			}
			if(this.gev.page_count>1) {
				console.log("add prev button")
				var refv = new previousView({
					model : new previousModel()
				});
				$('#nextb').append(refv.render().$el);
			}
			
			if(temp_val<10) {
				document.getElementById("next").remove();
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

