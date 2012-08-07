
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var bSave = {};	// @button
	var bRedo = {};	// @button
	var login1 = {};	// @login
	var documentEvent = {};	// @document
// @endregion// @endlock

	var _localizer = null;
	var _ERROR_OCCURED = "An error occured on the server.";
	
	/*	We update the lists and the interface every time the document is loaded,
		the user is logged in or the user is logged out => centralize everything
		in one function.
	
		Enbling/disabling the tabViw is handful: All subwidgets are automatically
		enabled/disabled. This is simpler than...
				WAF.widgets.bNew.enable();
				WAF.widgets.bDeleteTodo.enable();
				WAF.widgets.bRedo.enable();
				etc.
		...for all widgets
	*/
	function _update() {
		if(WAF.directory.currentUser()) {
			WAF.sources.todo.query('done # true order by priority desc');
			WAF.sources.todoDone.query('done = true order by doneDate desc');
			
			WAF.widgets.mainTabView.enable();
		
			// We want the grids to stay readonly (no dataentry, no add/remove button, ...)
			WAF.widgets.dgToDo.disable();
			WAF.widgets.dgDone.disable();
			
		} else {
			WAF.sources.todo.noEntities();
			WAF.sources.todoDone.noEntities();
			
			WAF.widgets.mainTabView.disable();
		}
	}
// eventHandlers// @lock

	bSave.click = function bSave_click (event)// @startlock
	{// @endlock
		var needRedraw = WAF.sources.todo.done;
		WAF.sources.todo.save({
			onSuccess: function(evt) {
				if(needRedraw) {
					_update();
				}
			},
			onError: function(err) {
				alert(_ERROR_OCCURED);
				_update();
			}
		});
	};// @lock

	bRedo.click = function bRedo_click (event)// @startlock
	{// @endlock
		WAF.sources.todoDone.done = false;
		WAF.sources.todoDone.doneDate = null;
		WAF.sources.todoDone.creationDate = new Date();
		WAF.sources.todoDone.save({
			onSuccess: function(evt) {
				_update();
			},
			onError: function(err) {
				alert(_ERROR_OCCURED);
				_update();
			}
		});
	};// @lock

	login1.logout = function login1_logout (event)// @startlock
	{// @endlock
		_update();
	};// @lock

	login1.login = function login1_login (event)// @startlock
	{// @endlock
		_update();
	};// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		// Localization
		var l = WAF.utils && WAF.utils.getBrowserLang ? WAF.utils.getBrowserLang().toLowerCase() : '';
				
		if(l == 'fr') {
			_localizer = new WAFLocalizer(
				[ 	'User: ', 'Pwd: ', 'Connection',
					'To do', 'Done',
					'Label', 'Priority', 'Done Date',
					'New', 'Delete', 'Save', 'Redo',
					_ERROR_OCCURED
				],
				[	'Utilisateur : ', 'Mot de passe : ', 'Connexion',
					'À faire', 'Fait',
					'Libellé', 'Priorité', 'Fait le',
					'Nouveau', 'Supprimer', 'Stocker', 'Refaire',
					'Une erreur est survenue sur le serveur.'
				]
			);
			
			_localizer.localizeWidgets();
			_ERROR_OCCURED = _localizer.localizeString(_ERROR_OCCURED);
		}
		
		
		// Fill data and update interface
		_update();
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("bSave", "click", bSave.click, "WAF");
	WAF.addListener("bRedo", "click", bRedo.click, "WAF");
	WAF.addListener("login1", "logout", login1.logout, "WAF");
	WAF.addListener("login1", "login", login1.login, "WAF");
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock
