# How to install:
* ```npm install -g``` or ```npm install pnm-cli```
* Add nodejs binaries to the path (if not already)

# How to run:

### Example commands
* Create zone:
```pnm-cli -t <tenant_id> --auth_token <auth_token> --use_staging true create_zone```

* Create 10 zones
```pnm-cli -t <tenant_id> --auth_token <auth_token> --use_staging true -c 10 create_zone```

* Create entity:
```pnm-cli -t <tenant_id> --auth_token <auth_token> --use_staging true create_entity```

* Create 10 entities
```pnm-cli -t <tenant_id> --auth_token <auth_token> --use_staging true -c 10 create_entity```

* Create check:
```pnm-cli -t <tenant_id> --auth_token <auth_token> -e <entity_id> -z <zone_id> --target <target> --url <url> --method <method> --use_staging true create_check```

* Create 100 checks:
```pnm-cli -t <tenant_id> --auth_token <auth_token> -e <entity_id> -z <zone_id> --target <target> --url <url> --method <method> --use_staging true --target -c 100 create_check```