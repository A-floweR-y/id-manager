# 唯一 id 管理器

创建唯一的菜单 id

## 快速开始
```js
const idManager = new IdManager();

// 第一个参数是父级菜单，第二个参数是菜单名称
const menuId = idManager.create(null, '菜单管理');
console.log(menuId); // 输出: { id: 10, name: '菜单管理', parent: null, children: null, isActive: 1}

// 创建一个子菜单
const childMenuId = idManager.create(menuId.id, '子菜单');

// 删除一个菜单
idManager.delete(childMenuId.id);

// 展示菜单的树形结构
idManager.tree();
```

## API

### storage: menuItem[]
使用扁平化数据结构存储所有菜单的数组

### create(parentId: null | number, name: string): menuItem
创建一个菜单项，并返回创建的菜单对象。
- `parentId`: 父级菜单的 id，如果为 null 则表示这是一个顶级菜单。
- `name`: 菜单的名称，同一个父级下创建同样的名称不会创建多个，只会返回同一个 menuItem 对象。

每个菜单创建后会被缓存，删除后再次执行 create 方法时，如果之前创建过，则会返回之前的 menuItem 对象。

### remove(id: number): menuItem | undefined
删除一个菜单项，并返回删除的菜单对象。
- `id`: 要删除的菜单的 id。如果此菜单包含子菜单也会进行删除。

其实不会对菜单进行真正的删除，只是把它的 `isActive` 属性设置为 0。这个菜单对象依然在 storage 中，只是被标记为不可用。这就是为什么删除之后再次创建同样的菜单时，会返回同一个 menuItem 对象。

### show(): menuTree
因为 storage 中所存储的数据结构并不利于查看，所以此方法会返回一个菜单树，即所有菜单的树形结构。