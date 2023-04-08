packages/client 为客户端
packages/api 为服务器端

1. Install
```
yarn install
```
2. Dev
```
lerna run dev
```

3. Build
```
lerna run build
```

4. Add Package
```
lerna add module-1 packages/client
lerna add module-2 packages/api
```

5. Remove Package
```
lerna exec 'yarn remove module-1' --scope=client
```
