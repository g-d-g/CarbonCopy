CarbonCopy
===========

CarbonCopy is a collaboration manager based in contexts that use the basis of communication
(transmitter, message, receiver). CarbonCopy is the channel.


Overview
------------

Each enterprise or team has their own communication culture, so CarbonCopy was developed for adaptate to
that culture.

All communication enviroment is based on participants, contexts, topics and interaction; they are the pillar of
the system.


Features
-----------

* Timeline organized information. Is posible see account, context and user timeline.
* Support n contexts.
* Is posible personalize context/topics labels.
* Support multiple accounts.


Configuration
-----------------

CarbonCopy is developed using CodeIgniter 2.2 PHP Framework and wiredesignz HMVC.

- No domain/Virtualhost

* Modify file application/nodomain/config.php:17 to set Base Site URL.
* Modify file application/nodomian/database.php to set database conection settings.
* Make sure that _accounts/cc is writeable recursively.

- Virtualhost/Domain

Is the same configuration that no domain depending environment. There is a development environment
using virtualhost as example.

- Database

Modify the file setup/cc.sql:51 to use your data and import  into database.
