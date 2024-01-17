/**
 * @file 菜单 id 管理器
 */

// 菜单状态 Map
enum activeState {
  // 活跃，只有活跃的菜单才会展示
  LIVE = 1,
  // 凋谢，凋谢的菜单，包括其的子孙菜单都不会展示
  DIE = 0,
};

// 菜单类型
type Menu = {
  id: number;
  name: string;
  parent: number | null;
  children: number[] | null;
  isActive: 1 | 0;
}

// 菜单树状结构类型
type MenuTree = {
  [key: number]: {
    name: string,
    children: MenuTree | null,
  };
}

class IdManage {
  public storage: Menu[];
  private startId: number;

  constructor(startId = 10) {
    // 使用扁平化结构管理菜单 id 数据，避免双向引用带来的复杂的数据结构
    this.storage = [];
    // 菜单的起始 id，默认为 10，是因为使用 2 位数可以拥有更多的同级菜单
    this.startId = startId;
  }

  // 创建 id 菜单
  create(parentId: number | null, menuName: string) {
    // 获取缓存，是否这个菜单创建过，如果创建过，直接返回之前的结果。
    const cache = this.getCache(parentId, menuName);
    if (cache) {
      // 如果有缓存数据，直接把缓存数据激活，然后返回缓存对象
      cache.isActive = activeState.LIVE;
      return cache;
    }

    let id: number;
    const result = ({} as Menu);
    if (parentId) {
      // 如果传递了 parentId，说明是用来创建子带单
      // 通过 parentId 获取 parent 对象
      const parent = this.storage.find((item) => item.id === parentId);
      if (typeof parent === 'undefined') {
        throw new Error('parentId not found');
      }
      // 获取 parent 对象的子菜单列表，如果没有，就进行创建
      const children = parent.children || (parent.children = []);
      // 如果子菜单有数据
      // ? 使用最后一个子菜单的 id + 1 作为新子菜单的 id
      // : 如果没有子菜单数据，使用 parent 的 id 进行字符串拼接上起始 id，然后转数字。
      id = children.length
        ? children[children.length - 1] + 1
        : Number(`${parent.id}${this.startId}`);
      // 挂在 parentId
      result.parent = parent.id;
      // parent 的 children 添加新的子菜单 id
      children.push(id);
    } else {
      // 如果没有 parentId，说明是创建的一级菜单
      // 获取当前的一级菜单列表，因为一级菜单的 parent 为 null
      const topList = this.storage.filter((item) => item.parent === null);
      // 如果当前一级菜单列表有数据
      // ? 使用最后一个一级菜单的 id + 1 作为最新的一级菜单 id
      // : 如果当前还没有顶级菜单, 使用起始 id 作为新的一级菜单 id
      id = topList.length ? topList[topList.length - 1].id + 1 : this.startId;
      // 挂在 parentId，一级菜单没有 父级，所以 parentId 为 null
      result.parent = null;
    }
    // 设置新菜单的 id
    result.id = id;
    // 新菜单的 children 默认为 null
    result.children = null;
    // 设置新菜单的名称
    result.name = menuName;
    // 默认激活新菜单
    result.isActive = activeState.LIVE;
    // 把新菜单添加到 storage 中进行存储
    this.storage.push(result);
    // 返回新菜单对象
    return result;
  }

  // 删除菜单
  remove(id: number) {
    // 找到需要删除的菜单对象
    const target = this.storage.find((item) => item.id === id);
    if (target) {
      // 如果找到了，并不会真的删除这个菜单，只是会把菜单设置成失活状态，失活状态下的菜单及其子孙菜单都不会再展示
      target.isActive = activeState.DIE;
    }
    return target;
  }

  // 获取缓存菜单，如果已存在不会重复创建，而是返回已创建的结果
  getCache(parentId: number | null, menuName: string) {
    return this.storage.find((item) => item.name === menuName && item.parent === parentId);
  }

  // 因为菜单的数据存储时扁平化的，并不利于查看，tree 方法会把扁平化的菜单转化成树状结构的数据，方便查看
  // 失活的菜单不会出现在返回结果中
  tree() {
    const result = ({} as MenuTree);
    // 获取一级菜单列表
    const topList = this.storage.filter((item) => item.parent === null && item.isActive);

    // 递归遍历的方法
    const deep = (list: Menu[], target: MenuTree) => {
      list.forEach((item) => {
        // 设置数据
        target[item.id] = {
          name: item.name,
          children: item.children ? {} : null,
        };
        if (item.children) {
          // 如果有子菜单，就获取当前的子菜单列表
          const childList = this.storage.filter((it) => item.children!.includes(it.id) && it.isActive);
          // 对子菜单列表进行遍历，并把数据添加到当前的 children 对象上
          deep(childList, target[item.id].children!);
        }
      });
    }

    // 从一级菜单列表开始递归遍历，把数据添加到 result 对象上。
    deep(topList, result);
    // 返回结果
    return result;
  }
}

export default IdManage;