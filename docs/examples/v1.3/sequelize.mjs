import assert from 'node:assert/strict';
import { Sequelize, DataTypes } from 'sequelize';

// 仅构造模型实例；不调用 authenticate、sync、save、create 或查询。
// mysql2 只为满足 v6 方言模块加载而安装，没有建立数据库连接。
const db = new Sequelize('unused', 'unused', 'unused', { dialect: 'mysql', logging: false });
try {
  const User = db.define('User', {
    name: DataTypes.STRING,
    favoriteColor: { type: DataTypes.STRING, defaultValue: 'green' },
  }, { timestamps: false });
  const user = User.build({ name: 'Ada' });
  const initial = user.toJSON();
  user.set({ favoriteColor: 'blue' });
  const edited = user.toJSON();
  assert.deepEqual(initial, { id: null, favoriteColor: 'green', name: 'Ada' });
  assert.deepEqual(edited, { id: null, favoriteColor: 'blue', name: 'Ada' });
  assert.equal(user.isNewRecord, true);
  console.log(JSON.stringify({ initial, edited, isNewRecord: user.isNewRecord }, null, 2));
} finally {
  await db.close();
}
