## 截图
![1682666978219](https://user-images.githubusercontent.com/16659637/235083359-a87f91af-b014-4f73-9089-0ff71d6c1e46.png)

![1682667060044](https://user-images.githubusercontent.com/16659637/235083578-7379cb5d-ca2f-46d7-9350-d5963c4686d9.png)

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
