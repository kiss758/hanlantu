/**

 @Name：layuiAdmin 用户管理 管理员管理 角色管理
 @Author：star1029
 @Site：http://www.layui.com/admin/
 @License：LPPL
    
 */

layui.define(
  ["table", "form", "laypage", "laydate", "layer"],
  function (exports) {
    var $ = layui.$,
      admin = layui.admin,
      view = layui.view,
      table = layui.table,
      form = layui.form;
    laydate = layui.laydate;
    layer = layui.layer;
    form.render();

    table.set({ headers: { token: layui.data("layuiAdmin").token } }); //通过 request 头传递

    //订单列表
    table.render({
      elem: "#LAY-user-back-persimmon",
      url: `${layui.setter.baseUrl}Competence/competence_index`, //模拟接口
      height: 700,
      page: true,
      limit: 40,
      limits: [40, 80, 160],
      cols: [
        [
          { type: "numbers", title: "序号", fixed: "left" },
          { field: "ID", title: "ID", sort: true },
          { field: "Cname", title: "模块名称" },
          { field: "ModuleUrl", title: "模块URL", width: 300 },
          { field: "Description", title: "描述" },
          { field: "Status", title: "状态" },
          { field: "Dtime", title: "时间", sort: true },
          {
            title: "操作",
            align: "center",
            fixed: "right",
            toolbar: "#table-useradmin-admin",
          },
        ],
      ],
      text: { none: "暂无相关数据" },
      done: function (res) {},
    });
    exports("persimmon", {});
  }
);
