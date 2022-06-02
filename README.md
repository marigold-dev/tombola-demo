# BUILD

```bash
ligo compile contract tombola.jsligo -o tombola.tz

ligo compile storage tombola.jsligo '{participants : Map.empty as map<address,string>,admin : "tz1VApBuWHuaTfDHtKzU3NBtWFYsxJvvWhYk" as address,status : OPEN() }' -o  tombolaStorage.tz

```

# DEPLOY

```bash
tezos-client originate contract tombolaIthaca transferring 0 from tz1VApBuWHuaTfDHtKzU3NBtWFYsxJvvWhYk running tombola.tz --init "$(cat tombolaStorage.tz)" --burn-cap 1
```

REACT_APP_CONTRACT=KT1E5YodfeGfaRYsQUvHJLapEGCd9Tzj9DRs

# RUN FRONTEND

```bash
yarn install

yarn run start
```
