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
    elem: "#LAY-user-back-returngood1",
    url: `${layui.setter.baseUrl}Rejected/index`, //模拟接口
    height: 700,
    cellMinWidth: 100,
    page: true,
    limit: 40,
    limits: [40, 80, 160],
    cols: [
      [
        { type: "numbers", width: 80, title: "序号" },
        {
          field: "order_status",
          title: "状态",
          templet: function (d) {
            return d.order.order_status;
          },
        },
        {
          field: "order_coding",
          title: " 订单编码",
          templet: (d) => {
            return d.order.order_coding;
          },
        },
        {
          field: "order_amount",
          title: "订单金额",
          templet: (d) => {
            return d.order.order_amount;
          },
        },
        {
          field: "order_type",
          title: "订单类型",
          templet: (d) => {
            return d.order.order_type;
          },
        },
        {
          field: "order_name",
          title: "客户姓名",
          templet: (d) => {
            return d.order.order_name;
          },
        },
        {
          field: "shared_customer_service",
          title: "客服",
          templet: (d) => {
            return d.order.shared_customer_service;
          },
        },
        { field: "rejected_back_amount", title: "退回金额" },
        { field: "rejected_back_bank_no", title: "退回银行卡号" },
        { field: "rejected_completed_time", title: "拒收完成时间" },
        { field: "founder_time", title: "拒收时间" },
        { field: "warehouse_receipt_time", title: "仓库收货时间" },
        { field: "rejected_reason", title: "拒收原因" },
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
        // 如果是datetime的范围选择，改变开始时间默认值
        //$(".laydate-main-list-0 .layui-laydate-content li ol li:last-child").click();
        // // 改变结束时间默认值
        $(
          ".laydate-main-list-1 .layui-laydate-content li ol li:last-child"
        ).click();
        // // 如果不是范围选择，只是日期时间选择
        // $(".laydate-main-list-0 .layui-laydate-content li ol li:last-child").click();
        // $(".layui-laydate-footer [lay-type='date'].laydate-btns-time").click();
      }
    },
  });

  // 退款状态
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

  // 数据导出
  form.on("submit(LAY-user-front-exportReturngoodData)", function (data) {
    const { start_end_time } = data.field;
    admin.req({
      moduleurl: `Rejected/data_export`,
      type: "POST",
      data: { start_end_time },
      done: (res) => {
        const { url } = res.data;
        window.location.href = url;
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
    table.reload("LAY-user-back-returngood1", {
      where: field,
      done: function (res, cur, count) {},
    });
    layer.close(index);
  });
  exports("rejected", {});
});
