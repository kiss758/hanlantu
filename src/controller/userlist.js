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
    url: `${layui.setter.baseUrl}User/index`, //模拟接口
    height: 700,
    cellMinWidth: 100,
    page: true,
    limit: 40,
    limits: [40, 80, 160],
    cols: [
      [
        // { type: "checkbox", fixed: "left" },
        { type: "numbers", width: 80, title: "序号" },
        { field: "ID", title: "USER_ID", sort: true },
        { field: "Username", title: "登录用户名	" },
        { field: "True_name", title: "用户真名" },
        { field: "Logincount", title: "登录次数" },
        { field: "Subordinateinstitution", title: "部门" },
        { field: "Type", title: "类型" },
        { field: "paixu", title: "排序" },
        { field: "order_alias", title: "别名" },
        { field: "descr", title: "查看权限" },
        { field: "Competence", title: "用户权限" },
        { field: "Loginip", title: "是否禁止" },
        { field: "Logintime", title: "最近登录" },
        {
          title: "操作",
          align: "center",
          fixed: "right",
          toolbar: "#table-useradmin-admin",
        },
      ],
    ],
    text: "对不起，加载出现异常！",
  });

  // 部门列表
  $(() => {
    admin.req({
      moduleurl: "User/index",
      data: { GetToolbartop: 1 },
      done: (val) => {
        let opt = '<option value="" selected="">部门</option>';
        const { Department_list } = val.data;
        Department_list.map((item) => {
          opt += `<option value="${item.Department}">${item.Department}</option>`;
        });
        $("#department").html(opt);
        form.render("select");
      },
    });
  });

  //监听搜索
  form.on("submit(LAY-user-front-search)", function (data) {
    var field = data.field;
    console.log(field);
    let index = layer.msg("查询中,请稍后...", {
      icon: 16,
      time: false,
      shadow: 0,
    });
    //执行重载
    table.reload("LAY-user-back-role", {
      where: field,
      done: function (res, cur, count) {},
    });
    layer.close(index);
  });

  //监听工具条
  table.on("tool(LAY-user-back-role)", function (obj) {
    var data = obj.data;
    if (obj.event === "del") {
    } else if (obj.event === "edit") {
      admin.popup({
        title: "编辑用户",
        area: ["600px", "550px"],
        id: "LAY-popup-user-add",
        success: function (layero, index) {
          view(this.id)
            .render("user/usermanagent", data)
            .done(function () {
              form.render(null, "layuiadmin-form-role");
              //监听提交
              form.on("submit(LAY-user-role-submit)", function (data) {
                var field = data.field; //获取提交的字段
                //提交 Ajax 成功后，关闭当前弹层并重载表格
                //$.ajax({});
                layui.table.reload("LAY-user-back-role"); //重载表格
                layer.close(index); //执行关闭
              });
            });
        },
      });
    }
  });
  exports("userlist", {});
});
