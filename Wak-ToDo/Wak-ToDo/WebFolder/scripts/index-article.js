
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var login2 = {};	// @login
	var documentEvent = {};	// @document
// @endregion// @endlock

// eventHandlers// @lock

	login2.logout = function login2_logout (event)// @startlock
	{// @endlock
		WAF.sources.todo.all();
	};// @lock

	login2.login = function login2_login (event)// @startlock
	{// @endlock
		WAF.sources.todo.all();
	};// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		WAF.sources.todo.all();
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("login2", "logout", login2.logout, "WAF");
	WAF.addListener("login2", "login", login2.login, "WAF");
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock
