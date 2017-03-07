# How to install:
* ```npm install -g``` or ```npm install pnm-cli```
* Add nodejs binaries to the path (if not already)

# How to run:

## Example commands:

### Create

* Create zone:
```pnm-cli -t <tenant_id> --auth_token <auth_token> --use_staging true create_zone```

* Create multiple zones:
```pnm-cli -t <tenant_id> --auth_token <auth_token> --use_staging true -c <count> create_zone```

* Create entity:
```pnm-cli -t <tenant_id> --auth_token <auth_token> --use_staging true create_entity```

* Create multiple entities:
```pnm-cli -t <tenant_id> --auth_token <auth_token> --use_staging true -c <count> create_entity```

* Create check:
```pnm-cli -t <tenant_id> --auth_token <auth_token> -e <entity_id> -z <zone_id> --target <target> --url <url> --method <method> --use_staging true create_check```

* Create multiple checks:
```pnm-cli -t <tenant_id> --auth_token <auth_token> -e <entity_id> -z <zone_id> --target <target> --url <url> --method <method> --use_staging true --target -c <count> create_check```

* Create agent token:
```pnm-cli -t <tenant_id> --auth_token <auth_token> --use_staging true create_agent_token```

* Create multiple agent tokens:
```pnm-cli -t <tenant_id> --auth_token <auth_token> --use_staging true -c <count> create_agent_token```

### Delete (File examples are provided for reference):

* Delete zone:
```pnm-cli -t <tenant_id> --auth_token <auth_token> --use_staging true -z <zone_id> delete_zone```

* Delete multiple zones:
```pnm-cli -t <tenant_id> --auth_token <auth_token> --use_staging true -f <file_location> delete_zone```

* Delete entity:
```pnm-cli -t <tenant_id> --auth_token <auth_token> --use_staging true -e <entity_id> delete_entity```

* Delete multiple entities:
```pnm-cli -t <tenant_id> --auth_token <auth_token> --use_staging true -f <file_location> delete_entity```

* Delete check:
```pnm-cli -t <tenant_id> --auth_token <auth_token> --use_staging true -e <entity_id> --check_id <check_id> delete_check```

* Delete multiple checks:
```pnm-cli -t <tenant_id> --auth_token <auth_token> --use_staging true -f <file_location> delete_check```

* Delete agent token:
```pnm-cli -t <tenant_id> --auth_token <auth_token> --use_staging true --token_id <token_id> delete_agent_token```

* Delete multiple agent tokens:
```pnm-cli -t <tenant_id> --auth_token <auth_token> --use_staging true -f <file_location> delete_agent_token```