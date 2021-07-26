/**

 @Name：layuiAdmin 用户管理 管理员管理 角色管理
 @Author：star1029
 @Site：http://www.layui.com/admin/
 @License：LPPL
    
 */

layui.define(["table", "form", "laydate"], function (exports) {
  var $ = layui.$,
    laydate = layui.laydate,
    admin = layui.admin,
    view = layui.view,
    table = layui.table,
    form = layui.form;

  form.render();

  table.set({ headers: { token: layui.data("layuiAdmin").token } }); //通过 request 头传递
  //角色管理
  table.render({
    elem: "#LAY-user-back-returngood",
    url: `${layui.setter.baseUrl}Tuihuo/index`, //模拟接口
    height: 700,
    cellMinWidth: 100,
    page: true,
    limit: 40,
    limits: [40, 80, 160],
    cols: [
      [
        { type: "numbers", width: 80, title: "序号" },
        {
          field: "tuihuo_status",
          title: "退货状态",
          // templet: (d) => {
          //   return d.order.order_status;
          // },
        },
        {
          field: "order_coding",
          title: "订单编号关联退货订单(可点击)",
          templet: (d) => {
            return d.order.order_coding;
          },
          width: 150,
        },
        {
          field: "order_name",
          title: "客户姓名",
          templet: (d) => {
            return d.order.order_name;
          },
        },
        {
          field: "customer_service",
          title: "客服",
          templet: (d) => {
            return d.order.customer_service;
          },
        },
        {
          field: "order_type",
          title: "客户类型",
          templet: (d) => {
            return d.order.order_type;
          },
        },
        {
          field: "tuihuo_true_amount",
          title: "退货金额",
        },
        {
          field: "express_company",
          title: "退货单号快递",
        },
        {
          field: "founder_time",
          title: "退货时间",
        },
        {
          field: "descr",
          title: "收货人",
          templet: (d) => {
            return d.order.customer_service;
          },
        },
        {
          field: "teller",
          title: "出纳审核",
        },
        {
          field: "tuihuo_reason",
          title: "退货原因",
          width: 200,
        },
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

  //日期时间范围
  laydate.render({
    elem: "#start_end_time",
    type: "datetime",
    range: true,
    done: function (value, date, endDate) {
      var hours = endDate.hours;
      var minutes = endDate.minutes;
      var seconds = endDate.seconds;
      if (hours == "0" && minutes == "0" && seconds == "0") {
        $(
          ".layui-laydate-footer [lay-type='datetime'].laydate-btns-time"
        ).click();
        $(
          ".laydate-main-list-1 .layui-laydate-content li ol li:last-child"
        ).click();
      }
    },
  });

  // 退款状态
  // $(() => {
  //   admin.req({
  //     moduleurl: "User/index",
  //     data: { GetToolbartop: 1 },
  //     done: (val) => {
  //       let opt = '<option value="" selected="">部门</option>';
  //       const { Department_list } = val.data;
  //       Department_list.map((item) => {
  //         opt += `<option value="${item.Department}">${item.Department}</option>`;
  //       });
  //       $("#department").html(opt);
  //       form.render("select");
  //     },
  //   });
  // });

  //监听搜索
  form.on("submit(LAY-user-front-search)", function (data) {
    var field = data.field;
    let index = layer.msg("查询中,请稍后...", {
      icon: 16,
      time: false,
      shadow: 0,
    });
    //执行重载
    table.reload("LAY-user-back-returngood", {
      where: field,
      done: function (res, cur, count) {},
    });
    layer.close(index);
  });

  //监听工具条
  table.on("tool(LAY-user-back-returngood)", function (obj) {
    var data = obj.data;
    var jump =
      data.tuihuo_status === "待修改" ? "tuihuo/update" : "tuihuo/query";
    if (obj.event === "del") {
      console.log("delete");
    } else if (obj.event === "edit") {
      admin.popup({
        title: "查看退货信息",
        area: ["99%", "99%"],
        id: "LAY-popup-tuihuo-query",
        success: function (layero, index) {
          view(this.id)
            .render(jump, data)
            .done(function () {
              form.render(null, "layuiadmin-form-role");
              form.on("submit(LAY-user-role-submit)", function (data) {
                var field = data.field;
                layui.table.reload("LAY-user-back-returngood");
                layer.close(index);
              });
            });
        },
      });
    }
  });
  //监听表格双击
  table.on("rowDouble(LAY-user-back-returngood)", function (obj) {
    var data = obj.data;
    var jump =
      data.tuihuo_status === "待修改" ? "tuihuo/update" : "tuihuo/query";
    admin.popup({
      title: "订单信息",
      area: ["99%", "99%"],
      id: "LAY-popup-user-add",
      success: function (layero, index) {
        view(this.id)
          .render(jump, data)
          .done(function () {
            form.on("submit(LAY-user-tuihuiu-update-submit)", function (data) {
              var field = data.field;
              admin.req({
                moduleurl: "Tuihuo/modify_do",
                type: "POST",
                data: { ...field },
                done: function (res) {
                  admin.layer(res.msg);
                  layer.close(index);
                  layui.table.reload("LAY-user-back-returngood");
                },
              });
            });
          });
      },
    });
  });
  exports("tuihuo", {});
});
