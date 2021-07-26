/**

 @Name：layuiAdmin 用户管理 管理员管理 角色管理
 @Author：star1029
 @Site：http://www.layui.com/admin/
 @License：LPPL
    
 */

layui.define(["table", "form"], function (exports) {
  var $ = layui.$,
    admin = layui.admin,
    view = layui.view,
    table = layui.table,
    form = layui.form;

  form.render();

  table.set({ headers: { token: layui.data("layuiAdmin").token } }); //通过 request 头传递

  //角色管理
  table.render({
    elem: "#LAY-user-back-role",
    url: `${layui.setter.baseUrl}Menu/index`, //模拟接口
    page: true,
    limit: 10,
    limits: [40, 80, 160],
    cols: [
      [
        { type: "numbers", title: "序号", fixed: "left" },
        { field: "ID", width: 80, title: "编号", sort: true },
        { field: "Sid", title: "Sid" },
        { field: "jump", title: "jump" },
        { field: "title", title: "标题" },
        { field: "Status", title: "状态" },
        { field: "Dtime", title: "时间", sort: true },
        {
          field: "competence",
          title: "关联权限",
          templet: function (data) {
            if (data.competence) return data.competence.Cname;
            return "";
          },
        },
        {
          title: "操作",
          width: 150,
          align: "center",
          fixed: "right",
          toolbar: "#table-useradmin-admin",
        },
      ],
    ],
    text: { none: "暂无相关数据" },
  });

  //监听工具条
  // table.on("tool(LAY-user-back-role)", function (obj) {
  //   var data = obj.data;
  //   if (obj.event === "del") {
  //     layer.confirm("确定删除此角色？", function (index) {
  //       obj.del();
  //       layer.close(index);
  //     });
  //   } else if (obj.event === "edit") {
  //     //console.log(data);
  //     admin.popup({
  //       title: "编辑,添加新角色",
  //       area: ["700px", "650px"],
  //       id: "LAY-popup-user-add",
  //       success: function (layero, index) {
  //         view(this.id)
  //           .render("system/menuform", data)
  //           .done(function () {
  //             form.render(null, "layuiadmin-form-role");

  //             //监听提交
  //             form.on("submit(LAY-user-role-submit)", function (data) {
  //               var field = data.field; //获取提交的字段
  //               //提交 Ajax 成功后，关闭当前弹层并重载表格
  //               console.log(field);
  //               admin.req({
  //                 moduleurl: "Role/role_add_do",
  //                 data: field,
  //                 done: function (res) {
  //                   layer.msg(`${res.msg}`, {
  //                     offset: "15px",
  //                     icon: 1,
  //                     time: 2000,
  //                   });
  //                 },
  //               });
  //               layui.table.reload("LAY-user-back-role"); //重载表格
  //               layer.close(index); //执行关闭
  //             });
  //           });
  //       },
  //     });
  //   }
  // });

  exports("menu", {});
});
