import IdManage from "../src";

test(
  '创建新菜单',
  () => {
    const idManage = new IdManage();
    expect(idManage.create(null, '菜单管理')).toStrictEqual({
      id: 10,
      name: '菜单管理',
      parent: null,
      children: null,
      isActive: 1
    });
    expect(idManage.create(null, '审核管理')).toStrictEqual({
      id: 11,
      name: '审核管理',
      parent: null,
      children: null,
      isActive: 1
    });
    expect(idManage.create(null, '告警管理')).toStrictEqual({
      id: 12,
      name: '告警管理',
      parent: null,
      children: null,
      isActive: 1
    });
    expect(idManage.create(10, '添加菜单')).toStrictEqual({
      id: 1010,
      name: '添加菜单',
      parent: 10,
      children: null,
      isActive: 1
    });
    expect(idManage.storage[0].children![0]).toBe(1010);
    expect(idManage.create(10, '菜单权限')).toStrictEqual({
      id: 1011,
      name: '菜单权限',
      parent: 10,
      children: null,
      isActive: 1
    });
    expect(idManage.storage[0].children![1]).toBe(1011);
  }
);

test(
  '删除菜单',
  () => {
    const idManage = new IdManage();
    idManage.create(null, '菜单管理');
    idManage.create(null, '审核管理');
    idManage.create(null, '告警管理');
    expect(idManage.remove(10)).toStrictEqual({
      id: 10,
      name: '菜单管理',
      parent: null,
      children: null,
      isActive: 0
    });
  }
);

test(
  '测试展示菜单',
  () => {
    const idManage = new IdManage();
    idManage.create(null, '菜单管理');
    idManage.create(null, '审核管理');
    idManage.create(null, '告警管理');
    idManage.create(10, '新增菜单');
    idManage.create(10, '删除菜单');
    idManage.create(1011, '删除菜单审核');
    expect(idManage.tree()).toStrictEqual({
      10: {
        name: '菜单管理',
        children: {
          1010: {
            name: '新增菜单',
            children: null,
          },
          1011: {
            name: '删除菜单',
            children: {
              101110: {
                name: '删除菜单审核',
                children: null,
              },
            },
          },
        },
      },
      11: {
        name: '审核管理',
        children: null,
      },
      12: {
        name: '告警管理',
        children: null,
      },
    });
  }
);

test(
  '菜单缓存',
  () => {
    const idManage = new IdManage();
    idManage.create(null, '菜单管理');
    idManage.create(null, '审核管理');
    idManage.create(null, '告警管理');
    expect(idManage.create(null, '菜单管理')).toStrictEqual({
      id: 10,
      name: '菜单管理',
      parent: null,
      children: null,
      isActive: 1,
    });
    expect(idManage.storage.length).toBe(3);
    expect(idManage.remove(10)).toStrictEqual({
      id: 10,
      name: '菜单管理',
      parent: null,
      children: null,
      isActive: 0,
    });
    expect(idManage.storage.length).toBe(3);
    expect(idManage.create(null, '菜单管理')).toStrictEqual({
      id: 10,
      name: '菜单管理',
      parent: null,
      children: null,
      isActive: 1,
    });
    expect(idManage.storage.length).toBe(3);
  }
);

test(
  '错误的 parentId',
  () => {
    const idManage = new IdManage();
    idManage.create(null, '菜单管理');
    expect(() => {
      idManage.create(11, '审核管理');
    }).toThrow('parentId not found');
  }
);