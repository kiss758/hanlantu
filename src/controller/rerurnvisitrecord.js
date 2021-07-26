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
      table.reload("LAY-member-back-returnvisitrecord", {
        where: field,
        done: function (res, cur, count) {},
      });
      layer.close(index);
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
      elem: "#LAY-member-back-returnvisitrecord",
      url: `${layui.setter.baseUrl}Member/index`, //模拟接口
      height: 700,
      cellMinWidth: 100,
      page: true,
      limit: 40,
      limits: [40, 80, 160],
      cols: [
        [
          { type: "numbers", title: "序号", fixed: "left", width: 50 },
          { field: "name", title: "会员姓名" },
          { field: "phone", title: "回访标题" },
          { field: "wechat", title: "坚持服用" },
          { field: "recommenders", title: "服用量(袋)" },
          { field: "belonging", title: "服用口感" },
          { field: "customer_source", title: "有无效果" },
          { field: "topcustomer_date", title: "回访时间" },
          { field: "customer_type", title: "添加人" },
          { field: "20210431type", title: "创建时间" },
          { field: "address", title: "改善情况" },
          { field: "founder_id", title: "建议要求" },
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
    table.on("tool(LAY-member-back-returnvisitrecord)", function (obj) {
      console.log(obj);
      var data = obj.data;
      if (obj.event === "del") {
        layer.confirm("确定删除此角色？", function (index) {
          obj.del();
          layer.close(index);
        });
      } else if (obj.event === "edit") {
        admin.popup({
          title: "添加新角色",
          area: ["50%", "80%"],
          id: "LAY-popup-user-add",
          success: function (layero, index) {
            view(this.id)
              .render("member/memberForm", data)
              .done(function () {
                form.render(null, "layuiadmin-form-role");

                //监听提交
                form.on("submit(LAY-user-member-submit)", function (data) {
                  var field = data.field; //获取提交的字段
                  console.log(field);

                  //提交 Ajax 成功后，关闭当前弹层并重载表格
                  //$.ajax({});
                  layui.table.reload("LAY-member-back-returnvisitrecord"); //重载表格
                  layer.close(index); //执行关闭
                });
              });
          },
        });
      }
    });

    table.on("edtoolit(LAY-member-back-returnvisitrecord)", function (obj) {
      //注：edit是固定事件名，test是table原始容器的属性 lay-filter="对应的值"
      console.log(obj.value); //得到修改后的值
      console.log(obj.field); //当前编辑的字段名
      console.log(obj.data); //所在行的所有相关数据
    });

    exports("rerurnvisitrecord", {});
  }
);
