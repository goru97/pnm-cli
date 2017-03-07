#! /usr/bin/env node
var program = require('commander');
var request = require('request');
var readLine = require('readline');
var fs = require('fs');

program.arguments('<action>')
  .version('0.0.5')
  .option('-t, --tenant_id <tenant_id>', 'tenant id')
  .option('--auth_token <auth_token>', 'auth_token', '')
  .option('-z, --zone_id <zone_id>', 'private monitoring zone id', 'pzA')
  .option('-e, --entity_id <entity_id>', 'entity id')
  .option('--check_id <check_id>', 'check id')
  .option('--token_id <token_id>', 'token_id')
  .option('--target <target>', 'check target hostname', '127.0.0.1')
  .option('--port <port>', 'port', 80)
  .option('--url <url>', 'check url for http checks', 'http://www.rackspace.com')
  .option('-m, --method <method>', 'http method', 'GET')
  .option('--use_staging <use_staging>', 'whether to use staging endpoint for monitoring api', false)
  .option('-c, --count <count>', 'count of the actions to be performed', 1)
  .option('-f, --file <file>', 'file location to extract the ids from', null)
  .action(function(action) {
    var tenantId = program.tenant_id;
    var authToken = program.auth_token;
    var count = program.count;
    var useStaging = program.use_staging;
    var zoneId = program.zone_id;
    var entityId = program.entity_id;
    var checkId = program.check_id;
    var tokenId = program.token_id;
    var target = program.target;
    var url = program.url;
    var method = program.method;
    var port = program.port;
    var file = program.file;

    var check_types = [
      {
        label: 'Remote_HTTP_check',
        type: 'remote.http',
        details: {
          url: 'http://www.rackspace.com',
          method: 'GET'
        },
        monitoring_zones_poll: [
          'pzA'
        ],
        target_hostname: 'rackspace.com',
        timeout: 30,
        period: 100
      },
      {
        label: 'Remote_PING_check',
        type: 'remote.ping',
        details: {
          count: 2
        },
        monitoring_zones_poll: [
          'pzA'
        ],
        target_hostname: '127.0.0.1',
        timeout: 30,
        period: 100
      },
      {
        label: 'Remote_TCP_check',
        type: 'remote.tcp',
        details: {
          'port': 80
        },
        monitoring_zones_poll: [
          'pzA'
        ],
        target_hostname: '127.0.0.1',
        timeout: 30,
        period: 100
      }
    ];
    var monitoring_service_access_endpoints = {
      prod: 'https://monitoring.api.rackspacecloud.com/v1.0/',
      stage: 'https://staging.monitoring.api.rackspacecloud.com/v1.0/'
    };

    var postApi = function(url, payload, authToken, callback) {
      var body = JSON.parse(JSON.stringify(payload));
      var options = {
        url: url,
        method: 'POST',
        body: body,
        json: true,
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': authToken,
          'X-Roles': 'monitoring:admin',
          'x-impersonator-role': 'monitoring:service-admin,object-store:admin'
        },
        rejectUnauthorized: false
      };

      request(options, callback);
    };

    var deleteApi = function(url, authToken, callback) {
      var options = {
        url: url,
        method: 'DELETE',
        json: true,
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': authToken,
          'X-Roles': 'monitoring:admin',
          'x-impersonator-role': 'monitoring:service-admin,object-store:admin'
        },
        rejectUnauthorized: false
      };

      request(options, callback);
    };

    var monitoringPost = function(url, payload, authToken, callback) {
      if(useStaging === 'true'){
        postApi(monitoring_service_access_endpoints.stage + url, payload, authToken, callback);
      } else {
        postApi(monitoring_service_access_endpoints.prod + url, payload, authToken, callback);
      }
    };

    var monitoringDelete = function(url, authToken, callback) {
      if(useStaging === 'true'){
        deleteApi(monitoring_service_access_endpoints.stage + url, authToken, callback);
      } else {
        deleteApi(monitoring_service_access_endpoints.prod + url, authToken, callback);
      }
    };

    if (action == 'create_zone') {
      for(var i = 0; i < count; i++) {
        var zonePayload = {label: 'zone_' + i, maximum_checks: 500, maximum_agents: 500};
        monitoringPost(tenantId+'/monitoring_zones', zonePayload, authToken, function(err, res, body) {
          if(err) {
            console.log(err);
          } else {
            if(res.statusCode == 201){
              console.log(res.headers['x-object-id']);
            }
            else {
              console.log(res.statusCode);
              console.log(body);
            }
          }
        });
      }
    }
    else if (action == 'create_entity') {
      for(var j = 0; j< count; j++) {
        var entityPayload = {label: 'entity_' + j};
        monitoringPost(tenantId+'/entities', entityPayload, authToken, function(err, res, body) {
          if(err) {
            console.log(err);
          } else {
            if(res.statusCode == 201){
              console.log(res.headers['x-object-id']);
            }
            else {
              console.log(res.statusCode);
              console.log(body);
            }
          }
        });
      }
    }
    else if(action == 'create_check') {
      var typeCount = -1;
      for(var k = 0; k< count; k++) {
        typeCount++;
        if(typeCount == check_types.length) {
          typeCount = 0;
        }
        var check = check_types[typeCount];
        check.label = check.label + '_' + count;
        check.monitoring_zones_poll = [zoneId];
        check.target_hostname = target;

        if(check.type == 'remote.http') {
          check.details.url = url;
          check.details.method = method;
        }
        if(check.type == 'remote.tcp') {
          check.details.port = port;
        }

        monitoringPost(tenantId + '/entities/' + entityId + '/checks', check, authToken, function(err, res, body) {
          if(err) {
            console.log(err);
          } else {
            if(res.statusCode == 201){
              console.log(res.headers['x-object-id']);
            }
            else {
              console.log(res.statusCode);
              console.log(body);
            }
          }
        });
      }
    }
    else if (action == 'create_agent_token') {
      for(var l = 0; l< count; l++) {
        var tokenload = {label: 'agent_token_' + l};
        monitoringPost(tenantId+'/agent_tokens', tokenload, authToken, function(err, res, body) {
          if(err) {
            console.log(err);
          } else {
            if(res.statusCode == 201){
              console.log(res.headers['x-object-id']);
            }
            else {
              console.log(res.statusCode);
              console.log(body);
            }
          }
        });
      }
    }
    else if (action == 'delete_zone') {
      var deleteZone = function(id, token) {
        monitoringDelete(tenantId+'/monitoring_zones/' + id, token, function(err, res, body) {
          if(err) {
            console.log(err);
          } else {
            if(res.statusCode == 204){
              console.log('Successfully deleted zone: ' + id);
            }
            else {
              console.log(res.statusCode);
              console.log(body);
            }
          }
        });
      };
      if (file != null) {
        var lineReader = readLine.createInterface({
          input: fs.createReadStream(file)
        });

        lineReader.on('line', function (id) {
          deleteZone(id, authToken);
        });

      } else {
        deleteZone(zoneId, authToken);
      }
    }
    else if (action == 'delete_entity') {
      var deleteEntity = function(id, token) {
        monitoringDelete(tenantId+'/entities/' + id, token, function(err, res, body) {
          if(err) {
            console.log(err);
          } else {
            if(res.statusCode == 204){
              console.log('Successfully deleted entity: ' + id);
            }
            else {
              console.log(res.statusCode);
              console.log(body);
            }
          }
        });
      };
      if (file != null) {
        var lineReader = readLine.createInterface({
          input: fs.createReadStream(file)
        });

        lineReader.on('line', function (id) {
          deleteEntity(id, authToken);
        });

      } else {
        deleteEntity(entityId, authToken);
      }
    }
    else if (action == 'delete_check') {
      var deleteCheck = function(id, entityId, token) {
        monitoringDelete(tenantId+'/entities/' + entityId + '/checks/' + id, token, function(err, res, body) {
          if(err) {
            console.log(err);
          } else {
            if(res.statusCode == 204){
              console.log('Successfully deleted check: ' + id);
            }
            else {
              console.log(res.statusCode);
              console.log(body);
            }
          }
        });
      };
      if (file != null) {
        var lineReader = readLine.createInterface({
          input: fs.createReadStream(file)
        });

        lineReader.on('line', function (line) {
          var ids = line.split(',');
          deleteCheck(ids[1], ids[0], authToken);
        });

      } else {
        deleteCheck(checkId, entityId, authToken);
      }
    }
    else if (action == 'delete_agent_token') {
      var deleteAgentToken = function(id, authToken) {
        monitoringDelete(tenantId+'/agent_tokens/' + id, authToken, function(err, res, body) {
          if(err) {
            console.log(err);
          } else {
            if(res.statusCode == 204){
              console.log('Successfully deleted token: ' + id);
            }
            else {
              console.log(res.statusCode);
              console.log(body);
            }
          }
        });
      };
      if (file != null) {
        var lineReader = readLine.createInterface({
          input: fs.createReadStream(file)
        });

        lineReader.on('line', function (id) {
          deleteAgentToken(id, authToken);
        });

      } else {
        deleteAgentToken(tokenId, authToken);
      }
    }
  })
  .parse(process.argv);
