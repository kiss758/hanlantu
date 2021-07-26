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
    elem: "#LAY-user-back-downpayment",
    url: `${layui.setter.baseUrl}Downpayment/index`, //模拟接口
    height: 700,
    cellMinWidth: 100,
    page: true,
    limit: 40,
    limits: [40, 80, 160],
    cols: [
      [
        { type: "checkbox", fixed: "left" },
        { type: "numbers", width: 80, title: "编号" },
        {
          field: "order_id",
          title: "关联订单编号",
        },
        {
          field: "order_name",
          title: "客户姓名",
          templet: (d) => {
            return d.order.order_name;
          },
        },
        {
          field: "order_name",
          title: "客服",
          templet: (d) => {
            return `${d.order.founder_username}</br>${d.order.executive_director}`;
          },
        },
        {
          field: "founder",
          title: "创建人名称",
        },
        {
          field: "payment_type",
          title: "定金付款方式",
          width: 150,
        },
        {
          field: "collection_date",
          title: "定金收款时间",
        },
        {
          field: "collection_amount",
          title: "定金收款金额",
        },
        {
          field: "collection_handling_fee",
          title: "定金收款手续费",
          width: 130,
        },
        {
          field: "collection_true_amount",
          title: "定金收款真实金额",
          width: 150,
        },
        {
          field: "founder_time",
          title: "定金收款创建时间",
          width: 170,
        },
        {
          field: "is_shipping",
          title: "发货?",
          templet: (d) => {
            if (d.is_shipping === "是") {
              return `<span style="color:red;font-weight:bold;font-size:18px">${d.is_shipping}</span>`;
            }
            return `<span style="color:green;font-weight:bold;font-size:18px">${d.is_shipping}</span>`;
          },
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
  // 付款方式
  $(() => {
    admin.req({
      moduleurl: "Downpayment/index",
      data: { GetToolbartop: 1 },
      done: (val) => {
        let opt = '<option value="" selected="">收款方式</option>';
        const { Paymenttype_List } = val.data;
        Paymenttype_List.map((item) => {
          opt += `<option value="${item.paymenttype_name}">${item.paymenttype_name}</option>`;
        });
        $("#paymenttype_name").html(opt);
        form.render("select");
      },
    });
  });
  //监听搜索
  form.on("submit(LAY-user-front-search)", function (data) {
    var field = data.field;
    table.reload("LAY-user-back-downpayment", {
      where: field,
      done: function (res, cur, count) {},
    });
    layer.close(index);
  });

  // 数据导出
  form.on("submit(LAY-user-front-exportdownpayment)", function (data) {
    const { start_end_time } = data.field;
    admin.req({
      moduleurl: `Order/data_export`,
      type: "POST",
      data: { start_end_time },
      done: (res) => {
        const { url } = res.data;
        window.location.href = url;
      },
    });
  });

  //监听工具条
  table.on("tool(LAY-user-back-downpayment)", function (obj) {
    console.log(obj.event);
  });
  exports("downpayment", {});
});
