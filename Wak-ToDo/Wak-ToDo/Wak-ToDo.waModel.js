
guidedModel =// @startlock
{
	Todo :
	{
		events :
		{
			onRestrictingQuery:function()
			{// @endlock
				var session = currentSession();
				if(session.belongsTo('Admin')) {
					return ds.Todo.all();
				} else if(session.belongsTo('User')) {
					return ds.Todo.query('userName = :1', session.user.name);
				} else {
					return ds.Todo.createEntityCollection();
				}
			},// @startlock
			onRemove:function()
			{// @endlock
				// Automatically delet the childs, if any
				this.todoList.remove();
			},// @startlock
			onValidate:function()
			{// @endlock
				var user, result = {};
				
				if(!this.userName && user && user.name !== 'default guest') {
					this.userName = user.name;
				}
				
				if(!this.userName) {
					result = {error: -200, errorMessage: "Missing a current user"};
				} else {
					if(this.done && !this.doneDate) {
						this.doneDate = new Date();
					}
				}
				
				if(this.priority < 0) {
					this.priority = 0;
				} else if(this.priority > 5) {
					this.priority = 5;
				}
				
				return result;
			},// @startlock
			onInit:function()
			{// @endlock
				var user = currentUser();
				
				this.priority = 2;
				this.done = false;
				this.creationDate = new Date();
				this.userName = user ? user.name : '';
			}// @startlock
		},
		userFullName :
		{
			onGet:function()
			{// @endlock
				var user = directory.user(this.userName);
				return user ? user.fullName : '';
			}// @startlock
		}
	}
};// @endlock
