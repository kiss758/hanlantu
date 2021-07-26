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
    //监听搜索
    form.on("submit(LAY-user-front-search)", function (data) {
      var field = data.field;
      let index = layer.msg("查询中,请稍后...", {
        icon: 16,
        time: false,
        shadow: 0,
      });
      //执行重载
      table.reload("LAY-user-back-member", {
        where: field,
        done: function (res, cur, count) {
          admin.adjustment();
        },
      });
      layer.close(index);
    });

    $(() => {
      admin.req({
        moduleurl: "Member/index",
        data: { GetToolbartop: 1 },
        done: (val) => {
          let customersource_name =
            '<option value="" selected="">客户来源</option>';
          let department = '<option value="" selected="">部门</option>';
          let belonging_id = '<option value="" selected="">归属微信</option>';
          const { Department_list, Customersource_list, User_list } = val.data;
          Customersource_list.map((item) => {
            customersource_name += `<option value="${item.customersource_name}">${item.customersource_name}</option>`;
          });

          Department_list.map((item) => {
            department += `<option value="${item.department}">${item.department}</option>`;
          });
          User_list.map((item) => {
            belonging_id += `<option value="${item.ID}">${item.Username}</option>`;
          });
          $("#customersource_name").html(customersource_name);
          $("#department").html(department);
          $("#belonging_id").html(belonging_id);
          $("#founder_id").html(belonging_id);
          form.render("select");
        },
      });
    });

    //日期时间范围
    laydate.render({
      elem: "#start_end_time",
      type: "datetime",
      range: true,
    });

    table.set({ headers: { token: layui.data("layuiAdmin").token } }); //通过 request 头传递

    //订单列表
    table.render({
      elem: "#LAY-user-back-member",
      url: `${layui.setter.baseUrl}Member/index`, //模拟接口
      height: 700,
      cellMinWidth: 100,
      page: true,
      limit: 40,
      limits: [40, 80, 160],
      cols: [
        [
          {
            type: "numbers",
            title: "序号",
            fixed: "left",
            width: 50,
            align: "center",
          },
          { field: "id", title: "编号", sort: true, align: "center" },
          { field: "name", title: "姓名", align: "center", width: 90 },
          { field: "phone", title: "手机号", align: "center", width: 120 },
          { field: "wechat", title: "微信号", align: "center" },
          { field: "recommenders", title: "推广人", align: "center" },
          { field: "belonging", title: "归属微信", align: "center" },
          { field: "customer_source", title: "客户来源", align: "center" },
          {
            field: "topcustomer_date",
            title: "拓客时间",
            align: "center",
            width: 110,
          },
          { field: "customer_type", title: "类型", align: "center" },
          { field: "20210431type", title: "客户类别", align: "center" },
          { field: "address", title: "地址", align: "center", width: 220 },
          {
            field: "founder_id",
            title: "创建人",
            align: "center",
            templet: function (res) {
              return res.user.Username + "<br/>" + res.user.True_name;
            },
          },
          {
            field: "founder_time",
            title: "创建时间",
            align: "center",
            width: 110,
          },
          { field: "identification_code", title: "标识码", align: "center" },
          { field: "记录", width: 100, title: "记录", align: "center" },
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
      done: function (res) {
        admin.adjustment();
      },
    });

    //监听工具条
    table.on("tool(LAY-user-back-member)", function (obj) {
      var data = obj.data;
      if (obj.event === "downorder") {
        admin.popup({
          title: "下单",
          area: ["99%", "99%"],
          id: "LAY-popup-member-order",
          success: function (layero, index) {
            view(this.id)
              .render("member/downorder", data)
              .done(function () {
                form.on("submit(LAY-user-member-submit)", function (data) {
                  if($("#render tr").length<=0){
                    layer.msg("请至少选择一件商品",{offset: "15px", icon: 2, time: 2000,})
                    return
                  }
                  const { field } = data;
                  admin.req({
                    moduleurl: "Order/add_do",
                    type: "POST",
                    data: {...field},
                    done: function (res) {
                      layer.msg(`${res.msg}`, {
                        offset: "15px",
                        icon: 1,
                        time: 2000,
                      });
                    },
                  });
                  layui.table.reload("LAY-user-back-member"); //重载表格
                  layer.close(index); //执行关闭
                });
              });
          },
        });
      } else if (obj.event === "edit") {
        admin.popup({
          title: "编辑会员信息",
          area: ["60%", "80%"],
          id: "LAY-popup-user-add",
          success: function (layero, index) {
            view(this.id)
              .render("member/memberForm", data)
              .done(function () {
                form.render(null, "layuiadmin-form-role");
                //监听提交
                form.on("submit(LAY-user-member-submit)", function (data) {
                  var field = data.field; //获取提交的字段
                  admin.req({
                    moduleurl: "Member/edit_do",
                    type: "POST",
                    data: field,
                    done: function (res) {
                      layer.msg(`${res.msg}`, {
                        offset: "15px",
                        icon: 1,
                        time: 2000,
                      });
                    },
                  });
                  layui.table.reload("LAY-user-back-member"); //重载表格
                  layer.close(index); //执行关闭
                });
              });
          },
        });
      }
    });

    table.on("edtoolit(LAY-user-back-member)", function (obj) {
      //注：edit是固定事件名，test是table原始容器的属性 lay-filter="对应的值"
      console.log(obj.value); //得到修改后的值
      console.log(obj.field); //当前编辑的字段名
      console.log(obj.data); //所在行的所有相关数据
    });

    exports("member", {});
  }
);
