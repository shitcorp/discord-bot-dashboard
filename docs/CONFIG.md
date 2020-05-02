|         Config Item         	| Data Type 	| Required 	| Default Value         	| Info                                                                                   	|
|:---------------------------:	|:---------:	|:--------:	|-----------------------	|----------------------------------------------------------------------------------------	|
| ``clientSecret``            	|   string  	|    yes   	| none                  	| Your bot's client secret                                                               	|
| ``redirectURI``             	|   string  	|    yes   	| none                  	| You'r bot's redirect URI                                                               	|
| ``ssl``                     	|  boolean  	|    no    	| false                 	| Whether to use SSL or not                                                              	|
| ``port``                    	|   number  	|    no    	| 80                    	| Port of webserver. if SSL is true it is set to 443                                     	|
| ``insecurePort``            	|   number  	|    no    	| 80                    	| Port of redirect webserver from http to https                                          	|
| ``maintenanceNotification`` 	|  boolean  	|    no    	| false                 	| Whether to send notification that the bot in under maintenance                         	|
| ``baseGame``                	|   string  	|    no    	| !help | v0.0.6.3      	| The game the bot is playing                                                            	|
| ``baseBotStatus``           	|   string  	|    no    	| online                	| The status of the bot. Ex: "online", "offline", "idle", "dnd"                          	|
| ``maintenanceGame``         	|   string  	|    no    	| Bot is in maintenance 	| The game of the bot when set to "maintenance mode"                                     	|
| ``maintenanceStatus``       	|   string  	|    no    	| dnd                   	| The status of the bot when in maintenance. Ex: "online", "offline", "idle", "dnd"      	|
| ``enableLogs``              	|  boolean  	|    no    	| false                 	| Whether to enable logging                                                              	|
| ``logFolderPath``           	|   string  	|    no    	| none                  	| Required if ```enableLogs`` is set true. The path to the folder to store the log files 	|
|                             	|           	|          	|                       	|                                                                                        	|
|                             	|           	|          	|                       	|                                                                                        	|