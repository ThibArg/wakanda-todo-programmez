wakanda-todo-programmez
=======================

Version 1.0, 2012-08-08

##FR
Exemple de l'article paru dans Programmez de septembre 2012.

L'application est dynamiquement localisée fr/en (par défaut, les libellés sont en anglais)

Pour l'exemple, une liste d'utilisateurs est déjà fournie. Les mots de passe de tous les utilisateurs est "pass". Quand le Wakanda Server est lancé depuis le Studio, une demande d'authentification s'ouvre: utilisez "admin" et "pass"(les mots de passe peuvent être modifiés dans l'éditeur d'utilisateurs et groupes).

Les points les plus intéressants à regarder sont:

- Le modèle et son JavaScript associé, qui centralise la logique métier (initialisation d'une tâche, restriction d'accès, ...)
- La page "Index.html" qui est plus sophistiquée que l'exemple de l'article. Il y a des messages, des dialogues, des objects activs/inactivés, la saisie, etc.
- Dans le dossier WebFolder/smartphone se trouve également un page index.html qui est à utilisé sur un iPhone. Les fonctionnalités sont quasiment les mêmes que la page desktop.

##EN
This application was built for an article published in the french magazine "Programmez".

It is localized en/fr (default values are in english)

A predefined list of user is given. The password for all users is the same, "pass". When you start Wakanda Server from the Studio, an authentication dialog is displayed. Just enter "admin" and "pass" (passwords can be changed in the Users and Groups editor).

The main Main points:

- The model and its JavaScript that centralizes the business logic (initializing a task, restricting access, ...)
- The "index.html" page in the "WebFolder". It is more sophisticated than the one built in the article: Messages, dialogs, data entry, ...
- In WebFolder/smartphone you will find also a "index.html" page, built for iPhone. It has about the same features than the desktop page.