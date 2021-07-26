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
    elem: "#LAY-user-look-persimmon",
    url: `${layui.setter.baseUrl}Showauthority/index`, //模拟接口
    page: true,
    limit: 10,
    limits: [40, 80, 160],
    cols: [
      [
        { type: "checkbox", fixed: "left" },
        { type: "numbers", title: "序号" },
        { field: "id", width: 80, title: "id", sort: true },
        { field: "explain", title: "权限备注" },
        { field: "show_phone", title: "手机号" },
        { field: "show_address", title: "地址" },
        { field: "show_wechat", title: "微信" },
        { field: "show_money", title: "金额", sort: true },
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
  table.on("tool(LAY-user-look-persimmon)", function (obj) {
    var data = obj.data;
    if (obj.event === "del") {
      layer.confirm("确定删除此角色？", function (index) {
        obj.del();
        layer.close(index);
      });
    } else if (obj.event === "edit") {
      //console.log(data);
      admin.popup({
        title: "修改用户信息",
        area: ["700px", "650px"],
        id: "LAY-popup-user-add",
        success: function (layero, index) {
          view(this.id)
            .render("system/showauthorityEditForm", data)
            .done(function () {
              form.render(null, "layuiadmin-form-role");

              //监听提交
              form.on("submit(LAY-user-role-submit)", function (data) {
                var field = data.field; //获取提交的字段
                //提交 Ajax 成功后，关闭当前弹层并重载表格
                admin.req({
                  moduleurl: "Role/role_add_do",
                  data: field,
                  done: function (res) {
                    layer.msg(`${res.msg}`, {
                      offset: "15px",
                      icon: 1,
                      time: 2000,
                    });
                  },
                });
                layui.table.reload("LAY-user-look-persimmon"); //重载表格
                layer.close(index); //执行关闭
              });
            });
        },
      });
    }
  });

  exports("showauthority", {});
});
