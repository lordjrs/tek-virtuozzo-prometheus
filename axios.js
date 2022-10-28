require('dotenv').config();
const cron = require('node-cron');
const axios = require('axios');
var mysql = require('mysql');
var cronometro = "SELECT prog_setting FROM programming WHERE prog_id = 29"

var con = mysql.createConnection(
    { host: process.env.MYSQLHOST,
      user: process.env.MYSQLUSER,
      password: process.env.MYSQLPASS,
      database: process.env.MYSQLDATABASE,
      port: process.env.MYSQLPORT
    });

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const data = {
    "auth": {
        "identity": {
            "methods": [
                "password"
            ],
            "password": {
                "user": {
                    "name": process.env.VIRTUSER,
                    "domain": {
                        "id": process.env.VIRTDOMAIN
                    },
                    "password": process.env.VIRTPASS
                }
            }
        },
        "scope": {
            "project": {
                "name": process.env.VIRTPROJNAME,
                "domain": {
                    "id": process.env.VIRTDOMAIN
                }
            }
        }
    }
}

con.connect(function(err) {
    if (err) throw err;
    console.log('Conectado!');
  });

/*
con.query(cronometro, function (err, result, fields) {
      if (err) throw err;
      window.scheduler = result;
    });

/*cron.schedule(window.scheduler, () => {
    console.log('Introducir función completa aquí');
  });*/

axios.post('https://'+process.env.VIRTADDRESS+':5000/v3/auth/tokens', data)
    .then((res) => {
        console.log(`Status: ${res.status}`);
        console.log('Body: ', res.data);
        var token = res.headers['x-subject-token'];
        console.log(token);
        axios.get('https://'+process.env.VIRTADDRESS+':8774/v2.1/servers', { 'headers': { 'x-auth-token': token } })
            .then(res => {
                console.log(`Server Status: ${res.status}`);
                console.log('Server Body: ', res.data);
                console.log('Server Headers: ', res.headers);
                var contents = res.data;
                var incrementable = Number(process.env.STARTAI);
                let count = contents.servers.length;
                console.log(count);
                for (count in res.data.servers){
                    var host_tag = contents.servers[count].id;
                    var host_name = contents.servers[count].name;
                    var incrementable = Number(incrementable+1);
                    console.log('JSON COMPLETO: ', contents);
                    console.log('JSON ID: ', host_tag);
                    console.log('JSON NAME: ', host_name);
                    var insertar = "INSERT INTO hosts (host_id, host_tag, host_name, host_agent_type, host_status, host_system) VALUES ("+ incrementable + ", '"  + host_tag + "', '" + host_name + "', 'metrics', 'ACTIVE', 'ZABBIX')";
                    //Conexión para insertar valores a hosts
                    // con.connect(function(err) {
                    //    if (err) throw err;
                        con.query(insertar, function (err, result, fields) {
                          if (err) throw err;
                          console.log(result);
                          console.log(incrementable);
                        });
                    //  });
                    //Conexión para hacer llamadas a Prometheus
                    axios.get('https://'+process.env.VIRTADDRESS+':8888/prometheus/api/v1/query_range?query=', { 'headers': { 'x-auth-token': token } })
                    .then(res => {   
                        console.log(`Server Status: ${res.status}`);
                        console.log('Server Body: ', res.data);
                        console.log('Server Headers: ', res.headers);
                        }).catch((err) => {
                            console.error(err);
                        })
                    }}).catch((err) => {
                        console.error(err);
                    })
    }).catch((err) => {
        console.error(err);
    });