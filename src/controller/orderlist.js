/**

 @Name：layuiAdmin 用户管理 管理员管理 角色管理
 @Author：star1029
 @Site：http://www.layui.com/admin/
 @License：LPPL
    
 */

layui.define(
  ["table", "form", "laypage", "laydate", "layer", "laytpl"],
  function (exports) {
    var $ = layui.$,
      admin = layui.admin,
      view = layui.view,
      table = layui.table,
      form = layui.form,
      laydate = layui.laydate,
      laytpl = layui.laytpl,
      layer = layui.layer;
    form.render();
    //监听搜索
    form.on("submit(LAY-user-front-search)", function (data) {
      var field = data.field;
      // console.log(field);
      //执行重载
      table.reload("LAY-user-back-order", {
        where: field,
        done: function (res, cur, count) {
          admin.adjustment();
        },
      });
    });

    //打开二次收款页面
    form.on("submit(LAY-user-second_payment_btn-submit)", function (data) {
      admin.popup({
        title: "提交二次收款信息",
        area: ["30%", "50%"],
        id: "LAY-popup-second_payment-add",
        success: function (layero, index) {
          view(this.id)
            .render("order/secondpayment/secondpayment", data)
            .done(function () {
              form.on("submit(LAY-user-secondpayment-submit)", function (data) {
                var field = data.field;
                admin.req({
                  moduleurl: "Secondpayment/add_do",
                  type: "POST",
                  data: field,
                  done: function (res) {
                    admin.layer(res.msg);
                    // layui.table.reload("LAY-user-back-order");
                    layer.close(index);
                  },
                });
              });
            });
        },
      });
    });
    //打开取消代收页面
    form.on("submit(LAY-user-cancel_collection_btn-submit)", function (data) {
      admin.popup({
        title: "提交取消代收信息",
        area: ["30%", "50%"],
        id: "LAY-popup-cancel_collection-add",
        success: function (layero, index) {
          view(this.id)
            .render(
              "order/cancelcollectionpayment/cancelcollectionpayment",
              data
            )
            .done(function (res) {});
        },
      });
    });
    //打开拒收按钮页面
    form.on("submit(LAY-user-rejected_btn-submit)", function (data) {
      admin.popup({
        title: "提交拒收信息",
        area: ["30%", "55%"],
        id: "LAY-popup-rejected_btn-add",
        success: function (layero, index) {
          view(this.id)
            .render("order/refuseorder/refuseorder", data)
            .done(function (res) {
              form.on("submit(LAY-user-rejectedbtn-submit)", function (data) {
                var field = data.field;
                admin.req({
                  moduleurl: "Rejected/add_do",
                  type: "POST",
                  data: field,
                  done: function (res) {
                    admin.layer(res.msg);
                    layui.table.reload("LAY-user-back-order");
                    layer.close(index);
                  },
                });
              });
            });
        },
      });
    });
    // 提交退货信息  user-tuihuo_btn-submit
    form.on("submit(LAY-user-tuihuo_btn-submit)", function (data) {
      admin.popup({
        title: "提交退货信息",
        area: ["75%", "75%"],
        id: "LAY-popup-tuihuo_btn-add",
        success: function (layero, index) {
          view(this.id)
            .render("order/refuseorder/refusendgoodinfo", data)
            .done(function (res) {
              form.on("submit(LAY-user-tuihuo_btn-submit)", function (data) {
                var field = data.field;
                if (!$(".render>tr").length) {
                  layer.msg("请至少选择一个商品", { icon: 2 });
                  return;
                }
                admin.req({
                  moduleurl: "Tuihuo/add_do",
                  type: "POST",
                  data: field,
                  done: function (res) {
                    admin.layer(res.msg);
                    layui.table.reload("LAY-user-back-order");
                    layer.close(index);
                  },
                });
              });
            });
        },
      });
    });
    // 111
    form.on("submit(LAY-user-show_rejected_btn-submit)", function (data) {
      admin.popup({
        title: "提交拒收信息",
        area: ["30%", "55%"],
        id: "LAY-popup-show_rejected_btn-add",
        success: function (layero, index) {
          view(this.id)
            .render("order/refuseorder/refuseorderbychuna", data)
            .done(function (res) {
              form.on(
                "submit(LAY-user-show_rejected_add_do-submit)",
                function (data) {
                  // var field = data.field;
                  const {
                    order_id,
                    rejected_back_amount,
                    refund_bank,
                    retund_date,
                  } = data.field;
                  admin.req({
                    moduleurl: "Rejected/teller_refund_do",
                    type: "POST",
                    data: {
                      order_id,
                      rejected_back_amount,
                      refund_bank,
                      retund_date,
                    },
                    done: function (res) {
                      admin.layer(res.msg);
                      layui.table.reload("LAY-user-back-order");
                      layer.close(index);
                    },
                  });
                }
              );
            });
        },
      });
    });
    $(() => {
      admin.req({
        moduleurl: "Order/index",
        data: { GetToolbartop: 1 },
        done: (val) => {
          let express_company =
            '<option value="" selected="">选择快递公司</option>';
          let order_type = '<option value="" selected="">选择客户类型</option>';
          let order_status = '<option value="" selected="">订单状态</option>';
          let founder_id = '<option value="" selected="">选择客服</option>';
          let department = '<option value="" selected="">选择部门</option>';

          const {
            Expresscompany_List,
            Customertype_List,
            State_List,
            Customerservice_List,
            Department_List,
          } = val.data;
          Expresscompany_List.map((item) => {
            express_company += `<option value="${item.express_company_name}">${item.express_company_name}</option>`;
          });
          Customertype_List.map((item) => {
            order_type += `<option value="${item.customertype_name}">${item.customertype_name}</option>`;
          });
          State_List.map((item) => {
            order_status += `<option value="${item.order_status}">${item.order_status}</option>`;
          });
          Customerservice_List.map((item) => {
            founder_id += `<option value="${item.ID}">${item.Username}(${item.True_name})</option>`;
          });
          Department_List.map((item) => {
            department += `<option value="${item.department}">${item.department}</option>`;
          });
          $("#express_company").html(express_company);
          $("#order_type").html(order_type);
          $("#order_status").html(order_status);
          $("#founder_id").html(founder_id);
          $("#department").html(department);

          form.render("select");
        },
      });
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

    table.set({ headers: { token: layui.data("layuiAdmin").token } }); //通过 request 头传递

    //订单列表
    var outerHeight = $(".layui-card-header").outerHeight(true);
    var outerHeight = parseInt(outerHeight) + 185;
    outerHeight = outerHeight.toString();

    table.render({
      elem: "#LAY-user-back-order",
      url: `${layui.setter.baseUrl}Order/index`,

      toolbar: "#toolbarDemo",

      // height: 750,
      // height: 'auto',
      // cellMinWidth: 30,
      // height: 'full-'+400,
      height: "full-" + outerHeight, //容器高度
      page: true,
      limit: 40,
      defaultToolbar: false,
      limits: [40, 80, 160],
      cols: [
        [
          { type: "checkbox", fixed: "left" },
          { type: "numbers", title: "序号", fixed: "left", width: 50 },
          // { field: "id", title: "ID", hide: true, sort: true },
          { field: "member_id", title: "会员id", hide: true },
          {
            field: "order_status",
            title: "状态",
            align: "center",
            width: 120,
            templet: function (d) {
              const { order_status, statuslist } = d;
              var state = `<font style='color: #${statuslist.color};font-size: 17px;font-weight: bold;'>${order_status}</font>`;
              //快递单当前状态，包括0在途，1揽收，2疑难，3签收，4退签，5派件，6退回，7转单，10待清关，11清关中，12已清关，13清关异常，14收件人拒签等13个状态
              if (d.order_status == "已发货") {
                switch (parseInt(d.Express_status)) {
                  case 0:
                    return (
                      state +
                      '<font style="font-weight:bold;  padding-left:10px;  color: #bb0303;">在途</font>'
                    );
                    break;
                  case 1:
                    return (
                      state +
                      '<font style="font-weight:bold;   padding-left:10px; color: #bb0303;">揽收</font>'
                    );
                    break;
                  case 2:
                    return (
                      state +
                      '<font style="font-weight:bold;  padding-left:10px;  color: #bb0303;">疑难</font>'
                    );
                    break;
                  case 3:
                    return (
                      state +
                      '<font style="font-weight:bold;   padding-left:10px; color: #bb0303;">签收</font>'
                    );
                    break;
                  case 4:
                    return (
                      state +
                      '<font style="font-weight:bold;   padding-left:10px; color: #bb0303;">退签</font>'
                    );
                    break;
                  case 5:
                    return (
                      state +
                      '<font style="font-weight:bold;  padding-left:10px;  color: #bb0303;">派件</font>'
                    );
                    break;
                  case 6:
                    return (
                      state +
                      '<font style="font-weight:bold;  padding-left:10px;  color: #bb0303;">退回</font>'
                    );
                    break;
                  case 7:
                    return (
                      state +
                      '<font style="font-weight:bold;   padding-left:10px; color: #bb0303;">转单</font>'
                    );
                    break;
                  case 10:
                    return (
                      state +
                      '<font style="font-weight:bold;  padding-left:10px;  color: #bb0303;">待清关</font>'
                    );
                    break;
                  case 11:
                    return (
                      state +
                      '<font style="font-weight:bold;  padding-left:10px;  color: #bb0303;">清关中</font>'
                    );
                    break;
                  case 12:
                    return (
                      state +
                      '<font style="font-weight:bold;  padding-left:10px;  color: #bb0303;">已清关</font>'
                    );
                    break;
                  case 13:
                    return (
                      state +
                      '<font style="font-weight:bold;  padding-left:10px;  color: #bb0303;">清关异常</font>'
                    );
                    break;
                  case 14:
                    return (
                      state +
                      '<font style="font-weight:bold;  padding-left:10px;  color: #bb0303;">收件人拒签</font>'
                    );
                    break;
                  default:
                    return (
                      state +
                      '<font style="font-weight:bold;  padding-left:10px;  color: #bb0303;">未知</font>'
                    );
                }
              }
              return state;
            },
          },
          {
            field: "order_coding",
            width: 130,
            title: "订单编号",
            align: "center",
          },
          { field: "order_name", width: 90, title: "收货人", align: "center" },
          {
            field: "order_phone",
            width: 120,
            title: "手机号码",
            align: "center",
          },
          {
            field: "founder_time",
            width: 105,
            title: "创建时间",
            align: "center",
          },
          {
            field: "shipment_time",
            width: 105,
            title: "发货时间",
            align: "center",
          },
          {
            field: "founder_username",
            width: 100,
            title: "创建人",
            align: "center",
            templet: function (d) {
              return d.founder_username + "<br/>" + d.user.True_name;
            },
          },
          {
            field: "归属号",
            width: 100,
            title: "归属号",
            align: "center",
            templet: function (d) {
              return d.member.belonging;
            },
          },
          { field: "order_type", title: "类型", align: "center" },
          { field: "order_amount", title: "总额", align: "center" },
          { field: "advance_payment", title: "定金", align: "center" },
          {
            field: "collection_amount",
            width: 100,
            title: "代收金额",
            align: "center",
          },
          {
            field: "payment_type",
            width: 100,
            title: "付款类型",
            align: "center",
          },
          {
            field: "express_company",
            width: 100,
            title: "快递公司",
            align: "center",
          },
          {
            field: "express_number",
            width: 120,
            title: "快递单号",
            align: "center",
          },
          {
            field: "order_address",
            width: 350,
            title: "地址",
            align: "center",
          },
          { field: "记录", title: "记录", align: "center" },
          {
            title: "操作",
            width: 120,
            align: "center",
            fixed: "right",
            toolbar: "#table-useradmin-admin",
          },
        ],
      ],
      text: { none: "暂无相关数据" },
      done: function (res) {
        const {
          daixiugai,
          daizhuguanshenhe,
          daifahuo,
          daichunashenhe,
          dailipinyuanshenhe,
          yifahuo,
          yanchifahuozhupin,
          yanchifahuozengpin,
          yishoukuandaifahuo,
          daicangkuquerenshouhuo,
          daichunaquerentuikuan,
          today_order_count,
        } = res.otherdata.Order_status_list;
        var orderStatus = $("#order_status .status_att>b");
        $(document).on("click", ".status_att", function () {
          var status = $(this).attr("data-index");
          callBack(status);
        });
        for (let i = 0; i < orderStatus.length; i++) {
          orderStatus[0].innerText = `${today_order_count}`;
          orderStatus[1].innerText = `${daixiugai}`;
          orderStatus[2].innerText = `${daizhuguanshenhe}`;
          orderStatus[3].innerText = `${daifahuo}`;
          orderStatus[4].innerText = `${daichunashenhe}`;
          orderStatus[5].innerText = `${dailipinyuanshenhe}`;
          orderStatus[6].innerText = `${yifahuo}`;
          orderStatus[7].innerText = `${yanchifahuozhupin}`;
          orderStatus[8].innerText = `${yanchifahuozengpin}`;
          orderStatus[9].innerText = `${yishoukuandaifahuo}`;
          orderStatus[10].innerText = `${daicangkuquerenshouhuo}`;
          orderStatus[11].innerText = `${daichunaquerentuikuan}`;
        }
        // Express_status_list
        const { lanshou, paijian, tuiqian, yinan, zaitu } =
          res.otherdata.Express_status_list;
        var expressStatus = $("#Express_status a>b");
        for (let i = 0; i < orderStatus.length; i++) {
          expressStatus[0].innerText = `${lanshou}`;
          expressStatus[1].innerText = `${paijian}`;
          expressStatus[2].innerText = `${tuiqian}`;
          expressStatus[3].innerText = `${yinan}`;
          expressStatus[4].innerText = `${zaitu}`;
        }
        // Statistics_list
        const {
          advance_payment_total,
          cancel_collection_amount_total,
          collection_amount_total,
          order_amount_total,
          second_payment_amount_total,
        } = res.otherdata.Statistics_list;
        var Statistics = $("#Statistics a>b");
        for (let i = 0; i < Statistics.length; i++) {
          Statistics[0].innerText = `${advance_payment_total}`;
          Statistics[1].innerText = `${cancel_collection_amount_total}`;
          Statistics[2].innerText = `${collection_amount_total}`;
          Statistics[3].innerText = `${order_amount_total}`;
          Statistics[4].innerText = `${second_payment_amount_total}`;
        }
        admin.adjustment();
      },
    });
    function callBack(status) {
      table.reload("LAY-user-back-order", {
        where: {
          order_status: status,
        },
        done: function (res, cur, count) {
          admin.adjustment();
        },
      });
    }
    //监听表格双击
    table.on("rowDouble(LAY-user-back-order)", function (obj) {
      var data = obj.data;
      var jump =
        data.order_status === "待修改"
          ? "order/modifyorder"
          : "order/editorder";
      admin.popup({
        title: "订单信息",
        area: ["99%", "99%"],
        id: "LAY-popup-user-add",
        success: function (layero, index) {
          view(this.id)
            .render(jump, data)
            .done(function () {
              form.on("submit(LAY-user-member-submit)", function (data) {
                var field = data.field;
                admin.req({
                  moduleurl: "Order/modify_do",
                  type: "POST",
                  data: { ...field },
                  done: function (res) {
                    admin.layer(res.msg);
                    layer.close(index);
                    layui.table.reload("LAY-user-back-order");
                  },
                });
              });
            });
        },
      });
    });

    //头工具栏事件
    table.on("toolbar(LAY-user-back-order)", function (obj) {
      var checkStatus = table.checkStatus(obj.config.id);
      switch (obj.event) {
        case "getCheckData":
          var data = checkStatus.data;

          // var huikuan_id='';
          isexist = 0;
          for (i = 0; i < data.length; i++) {
            // huikuan_id=huikuan_id+data[i]['id']+',';
            if (data[i]["order_status"].indexOf("待物流返款") != -1) {
              isexist = 1;
            }
          }
          if (isexist == 0) {
            layer.msg("至少选中一个待物流返款!");
            return;
          }

          // if (huikuan_id=='') {
          //   wintq('至少选择一项',2,1500,1,'');
          // }else {
          //   popload('处理回款信息',1000,600,"__APP__/Order/wuliufankuan/huikuan_id/"+huikuan_id);
          //   addDiv($('#iframe_pop'));
          //   popclose();

          // }
          const dataArr = [];
          data.map((item) => {
            dataArr.push(item.id);
          });

          admin.popup({
            title: "处理回款信息",
            area: ["80%", "80%"],
            id: "LAY-popup-user-add",
            success: function (layero, index) {
              view(this.id)
                .render("order/payback/payback_add", dataArr)
                .done(function () {
                  // form.on("submit(LAY-user-member-submit)", function (data) {
                  //   var field = data.field;
                  //   layui.table.reload("LAY-user-back-order");
                  //   layer.close(index);
                  // });
                });
            },
          });

          break;

        case "getCheckLength":
          var data = checkStatus.data;
          layer.msg("选中了：" + data.length + " 个");
          break;
        case "isAll":
          layer.msg(checkStatus.isAll ? "全选" : "未全选");
          break;
      }
    });

    //监听工具条
    table.on("tool(LAY-user-back-order)", function (obj) {
      var data = obj.data;
      var jump =
        data.order_status === "待修改"
          ? "order/modifyorder"
          : "order/editorder";
      if (obj.event === "edit") {
        admin.popup({
          title: "订单信息",
          area: ["99%", "99%"],
          id: "LAY-popup-user-add",
          success: function (layero, index) {
            view(this.id)
              .render(jump, data)
              .done(function () {
                form.on("submit(LAY-user-member-submit)", function (data) {
                  var field = data.field;
                  layui.table.reload("LAY-user-back-order");
                  layer.close(index);
                });
              });
          },
        });
      } else if (obj.event === "query") {
        const { order_name } = obj.data;
        admin.popup({
          title: `${order_name}快递查询信息`,
          area: ["650px", "600px"],
          id: "LAY-popup-user-add",
          success: function (layero, index) {
            view(this.id)
              .render("order/orderstatus/querydelivery", data)
              .done(function () {
                form.on("submit()", function (data) {
                  layui.table.reload("LAY-user-back-order"); //重载表格
                  layer.close(index); //执行关闭
                });
              });
          },
        });
      }
    });

    table.on("edtoolit(LAY-user-back-order)", function (obj) {
      //注：edit是固定事件名，test是table原始容器的属性 lay-filter="对应的值"
    });

    exports("orderlist", {});
  }
);
