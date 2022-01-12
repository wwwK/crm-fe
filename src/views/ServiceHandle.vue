<template>
  <div>
    <h1>服务处理</h1>
    <hr>
    <table class="layui-hide" id="test" lay-filter="test"></table>
    <div id="btn">
      <button class="layui-btn layui-btn-danger layui-btn-xs" lay-event="handle">处理</button>
    </div>
    <!-- 处理框开始 -->
    <div id="handleform"  style="display:none; padding: 50px; line-height: 22px; font-weight: 300;">
      <el-form :model="handleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="处理方法: " prop="handleMethod">
          <el-input type="textarea" v-model="handleForm.handleMethod"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <!-- 处理框结束 -->

    
  </div>
</template>
<script>

export default {
  data(){
    return{
      tableData:[],
      handleForm:{
      },
      list:[],
      handleform:{
        serId:"",
        cusId:"",
        serHead:"",
        serType:"",
        serStatus:"",
        distUid:"",
        uid:"",
        uname: sessionStorage.getItem("user"),
        createTime:"",
        distUid:"",
        distTime:"",
        handleMethod:"",
      }
    }
  },
  mounted(){
    this.updateTable();
  },
  methods:{
    updateTable(){
        let self = this;
        this.$axios.post("service/findAll")
        .then(resp => {
            let r = resp.data;
            this.tableData = r.data;
            layui.use('table', function(){
                var table = layui.table;
                table.render({
                    elem: '#test'
                    ,data:self.tableData
                    ,cellMinWidth: 80
                    ,cols: [[
                      ,{field:'serId', title:'编号', width:100}
                      ,{field:'cusId', title:'客户', width:110 }
                      ,{field:'serHead', title:'概要', width:200 }
                      ,{field:'serType', title:'类型', width:120}
                      ,{field:'distTime', title:'处理时间', width:215}
                      ,{field:'serStatus', title:'状态', width:130}
                      ,{field:'uid', title:'创建人', width:120}
                      ,{field:'distUid', title:'被分配人', width:110}
                      ,{field: 'button', title:'操作', toolbar: '#btn', width:148}
                    ]]
                    ,page: true
                });
                //监听工具条
                table.on('tool(test)', function(obj){
                  var data = obj.data;
                  if(obj.event == "handle"){
                    if(data.serStatus != '已分配'){
                        self.$message({
                        message:"该服务的状态是: "+ data.serStatus +"，请选择已分配的服务进行处理！",
                        type:"error"
                        });
                    }else{
                      self.handle(data.serId);
                    }
                  }
                });
            });
        })
        .catch(err => {
            console.error(err); 
        });
      },
      handle(serId){
        let self = this;
        layer.open({
          type: 1 
          ,title: '服务处理'
          ,area: ['400px', '300px']
          ,shade: 0
          ,offset: [ 
            ($(window).height()-300)/2
            ,($(window).width()-390)/2
          ] 
          ,content: $('#handleform')
          ,btn: ['确认处理', '关闭窗口'] 
          ,yes: function(){
            console.log(serId);
            self.confirmHandle(serId);
            $("#handleform").css("display", "none");
          }
          ,btn2: function(){
            layer.closeAll();
            $("#handleform").css("display", "none");
          }
        });
      },
      confirmHandle(serId){
        let distTime = this.fmt(new Date());
        this.$axios.post("service/handle",{serId:serId+"", distTime:distTime+""})
        .then(res => {
          let r = res.data;
          if (r.code == 200) {
            console.log(r.distTime);
            console.log(r.distTime);
            this.updateTable();
            layer.closeAll();
             $("#handleform").css("display", "none");
            this.$message({
              message:"处理成功！",
              type:"success"
            });
          }
        })
        .catch(err => {
          console.error(err); 
        })
      },
      fmt(date){
      let yy = date.getFullYear();
          let MM = date.getMonth() + 1;
          MM = MM < 10 ? "0" + MM : MM;
          let dd = date.getDate();
          dd = dd < 10 ? "0" + dd : dd;
          let h = date.getHours();
          h = h < 10 ? "0" + h : h;
          let m = date.getMinutes();
          m = m < 10 ? "0" + m : m;
          let s = date.getSeconds();
          s = s < 10 ? "0" + s : s;
          return yy + "年" + MM + "月" + dd + "日" + " " + h + ":" + m + ":" + s;
    },
  }
}
</script>


<style scoped>
#btn{
  display: none;
}
.abc{
  width: 400px;
}
</style>