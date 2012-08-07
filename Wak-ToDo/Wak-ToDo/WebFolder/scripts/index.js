/*	This example is a bit more complex than the one used in the "Programmez" article.
	It uses tabs, dialogs, etc. When a task is set to \"Done\", it is automatically moved
	to the "Done" list. The grids are read-only: Modification/deletion are done in dialogs. Etc.

	Exemple un peu plus sophistiqué que celui décrit dans l'article "Programmez".
	Ici, on utilise des onglets, des dialogues, etc. Quand un tâche est marquée "Faite",
	elle est automatiquement déplacée das la liste "Fait". La suppression affiche un dialogue
	de confirmation. Etc.


*/
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var bRedo = {};	// @button
	var bConfirmOK = {};	// @button
	var bConfirmCancel = {};	// @button
	var bDeleteDone = {};	// @button
	var bDeleteToDo = {};	// @button
	var bNewToDo = {};	// @button
	var dgToDo = {};	// @dataGrid
	var bModifyOK = {};	// @button
	var bModifyCancel = {};	// @button
	var documentEvent = {};	// @document
	var login1 = {};	// @login
// @endregion// @endlock
	
	// Some variables used in the code
	var _dialModifyMoved = false;
	
	// For quick'n dirty localization
	var _localizer = null;
	var _CONFIRM_DELETE = 'Do you really want to delete the entry: "';
	var _ERROR_OCCURED = 'An error occured while deleteing this entry.';
	var _COULD_NOT_ADD_TASK = 'Could not add a new task';
	var _ERROR_TASK_NOT_SAVED = "An error occured, the task could not be saved.";
	var _NOT_LOGGED_IN = "Please login";
	
	function _translate() {
		// Default values and labels are in english. We want some of them
		// to be in French, for the article in "Programmez"
		var l = WAF.utils && WAF.utils.getBrowserLang ? WAF.utils.getBrowserLang().toLowerCase() : '';

		if(l == 'fr') {
			_localizer = new WAFLocalizer(
				[ 	'Things done and to be done',
					'User: ', 'Pwd: ', 'Connection',
					'Label', 'Priority', 'Done', 'Double-click to modify', 'Done Date',
					'Confirm', 'To do',
					'Cancel',
					_ERROR_OCCURED,
					_COULD_NOT_ADD_TASK,
					_ERROR_TASK_NOT_SAVED,
					_CONFIRM_DELETE,
					_NOT_LOGGED_IN
				],
				[	'Liste des choses faites et à faire',
					'Utilisateur : ', 'Mot de passe : ', 'Connexion',
					'Libellé', 'Priorité', 'Fait', 'Doucle-clic pour modifier', 'Fait le',
					'Confirmer', 'À faire',
					'Annuler',
					'Une ereur est survenue lors de la suppression',
					"Impossible d'ajouter une tâche.",
					"Une erreur est survenue: impossible d'enregistrer la tâche.",
					"Supprimer l'entrée: \"",
					"Aucun utilisateur connecté"
				]
			);
			
			_localizer.localizeWidgets();
			_CONFIRM_DELETE = _localizer.localizeString(_CONFIRM_DELETE);
			_ERROR_OCCURED = _localizer.localizeString(_ERROR_OCCURED);
			_NOT_LOGGED_IN = _localizer.localizeString(_NOT_LOGGED_IN);
		}
	}
	
	

	/*	We update the lists and the interface every time the document is loaded,
		the user is logged in or the user is logged out => centralize everything
		in one function.
	
		Enbling/disabling the tabViw is handful: All subwidgets are automatically
		enabled/disabled. This is simpler than...
				WAF.widgets.bNewToDo.enable();
				WAF.widgets.bDeleteToDo.enable();
				WAF.widgets.bDeleteDone.enable();
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
			_message(_NOT_LOGGED_IN);
		}
	}
	
	// This one could also be called from different places
	function _displayModifyDialog() {
		if(!_dialModifyMoved) {
			$$('dialogModify').move(300, 100);
			_dialModifyMoved = true;
		}
		$$('dialogModify').displayDialog();
	}
	
	// fadeIn/fadeOut animations are done with jQuery.
	function _message(inMsg, inColor, inDuration) {
		if(typeof inColor === 'string' && inColor !== '') {
			$$('textMessage').setTextColor(inColor);
		} else {
			$$('textMessage').setTextColor("white");
		}
		
		inDuration = inDuration ? inDuration : 3500;
		
		$$('textMessage').setValue(inMsg);
		$("#textMessage").fadeIn('slow');
		
		setTimeout(function() {
			$("#textMessage").fadeOut('slow', function(ignore) {
				$$('textMessage').setValue('');
			});
		}, inDuration);
	}
	
	function _confirm(inMsg, inKind) {
		$$('dialogConfirm').move(300, 100);
		$$('textConfirm').setValue(inMsg);
		$$('dialogConfirm').displayDialog();
		$$('dialogConfirm').theKind = inKind;
	}
	
// eventHandlers// @lock

	bRedo.click = function bRedo_click (event)// @startlock
	{// @endlock
		var theLabel = WAF.sources.todoDone.label;
		WAF.sources.todoDone.done = false;
		WAF.sources.todoDone.doneDate = null;
		WAF.sources.todoDone.creationDate = new Date();
		WAF.sources.todoDone.save({
			onSuccess: function(evt) {
				if(_localizer) {
					_message('La tâche "' + theLabel + '" a été déplacée dans la liste "À Faire".');
				} else {
					_message('The task "' + theLabel + '" was moved to the "To do" list.');
				}
				_update();
			},
			onError: function(err) {
				alert(_ERROR_OCCURED);
				_update();
			}
		});
	};// @lock

	bConfirmOK.click = function bConfirmOK_click (event)// @startlock
	{// @endlock
		var theKind = $$('dialogConfirm').theKind, srce;
		
		if(theKind === 'deleteTodo' || theKind === 'deleteDone') {
			if(theKind === 'deleteTodo') {
				srce = WAF.sources.todo;
			} else if(theKind === 'deleteDone') {
				srce = WAF.sources.todoDone;
			}
			srce.removeCurrent( {
				onSuccess: function(evt) {
					_update();
				},
				onError : function(err) {
					_message(_ERROR_OCCURED, 'red');
					_update();
				}
			});
		}
		$$('dialogConfirm').closeDialog();
	};// @lock

	bConfirmCancel.click = function bConfirmCancel_click (event)// @startlock
	{// @endlock
		$$('dialogConfirm').closeDialog();
	};// @lock

	bDeleteDone.click = function bDeleteDone_click (event)// @startlock
	{// @endlock
		_confirm( _CONFIRM_DELETE + WAF.sources.todoDone.label + '"?', 'deleteDone');
	};// @lock

	bDeleteToDo.click = function bDeleteToDo_click (event)// @startlock
	{// @endlock
		_confirm( _CONFIRM_DELETE + WAF.sources.todo.label + '"?', 'deleteTodo');
	};// @lock

	bNewToDo.click = function bNewToDo_click (event)// @startlock
	{// @endlock
		WAF.sources.todo.addNewElement();
		// Ask the server to update default values and display
		// the dialog once it's done
		WAF.sources.todo.serverRefresh({
			onSuccess: function(evt) {
				_displayModifyDialog();
			},
			onError: function(err) {
				_message(_COULD_NOT_ADD_TASK, 'red');
			}
		});
	};// @lock

	dgToDo.onRowDblClick = function dgToDo_onRowDblClick (event)// @startlock
	{// @endlock
		_displayModifyDialog();
	};// @lock

	bModifyOK.click = function bModifyOK_click (event)// @startlock
	{// @endlock
		var theDone = WAF.sources.todo.done;
		var theLabel = WAF.sources.todo.label;
		WAF.sources.todo.save({
			onSuccess: function(evt) {
				if(evt.dataSource.done) {
					if(_localizer) {
						_message('La tâche "' + theLabel + '" a été déplacée dans la liste "Fait".');
					} else {
						_message('The task "' + theLabel + '" was moved to the "Done" list.');
					}
					_update();
				}
			},
			onError: function(err) {
				_message(_ERROR_TASK_NOT_SAVED, "red");
			}
		});
		$$('dialogModify').closeDialog();
	};// @lock

	bModifyCancel.click = function bModifyCancel_click (event)// @startlock
	{// @endlock
		if(WAF.sources.todo.isNewElement()) {
			_update();
		} else {
			WAF.sources.todo.serverRefresh();
		}
		$$('dialogModify').closeDialog();
	};// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		_translate();
		
		$$('textMessage').setValue('');
		$("#textMessage").fadeOut();
		
		$$('dgToDo').setRowHeight(25);
		$$('dgDone').setRowHeight(25);
		
		// Exemple de personnalisaiton de l'affichage du contenu d'une colonne
		function _drawPriority(inCell) {
			var val = inCell.value;
			if(val) {
				val = val < 0 ? 0 : (val > 5 ? 5 : val);
				return '<div style="background-color:#3baadd; width:' + ((val / 5) * 100) + '%; height:20px"></div>';
			} else {
				return '';
			}
		}
		$$('dgToDo').column(2).setRenderer(_drawPriority);
		$$('dgDone').column(2).setRenderer(_drawPriority);
		
		_update();
		
	};// @lock

	login1.logout = function login1_logout (event)// @startlock
	{// @endlock
		_update();
	};// @lock

	login1.login = function login1_login (event)// @startlock
	{// @endlock
		_update();
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("bRedo", "click", bRedo.click, "WAF");
	WAF.addListener("bConfirmOK", "click", bConfirmOK.click, "WAF");
	WAF.addListener("bConfirmCancel", "click", bConfirmCancel.click, "WAF");
	WAF.addListener("bDeleteDone", "click", bDeleteDone.click, "WAF");
	WAF.addListener("bDeleteToDo", "click", bDeleteToDo.click, "WAF");
	WAF.addListener("bNewToDo", "click", bNewToDo.click, "WAF");
	WAF.addListener("dgToDo", "onRowDblClick", dgToDo.onRowDblClick, "WAF");
	WAF.addListener("bModifyOK", "click", bModifyOK.click, "WAF");
	WAF.addListener("bModifyCancel", "click", bModifyCancel.click, "WAF");
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
	WAF.addListener("login1", "logout", login1.logout, "WAF");
	WAF.addListener("login1", "login", login1.login, "WAF");
// @endregion
};// @endlock
