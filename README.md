# tek-virtuozzo-prometheus

Este programa:
- Usa variables de entorno
- Se conecta a la instancia de Virtuozzo
- Usa las credenciales para adquirir el X Auth Token
- Recupera la lista de servidores
- Inserta los servidores en la tabla "hosts" de Tek.

To Do:
- Activar el node-cron de la aplicación (La consulta a la base de datos de Tek está almacenada)
- Realizar las consultas a Prometheus y su posterior almacenamiento
- Interacción con la tabla de procesos para almacenar tiempos Epoch, entre otros.

Archivos de variable de entorno:
`VIRTADDRESS="tek.zapto.org"
VIRTUSER="admin"
VIRTPASS="Tek.2022"
VIRTDOMAIN="default"
VIRTPROJNAME="admin"

MYSQLHOST="monitor.tlinecloud.cl"
MYSQLUSER="maburto"
MYSQLPASS="Mahjhh8948.9734"
MYSQLDATABASE="teksync_desa"
MYSQLPORT="8081"`
