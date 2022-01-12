<template>
  <div id="d1">
        <table class="layui-hide" id="test" lay-filter="test"></table>
        <div id="btn">
            <a class="layui-btn layui-btn-xs" lay-event="archivedFormView">查看归档单</a>
        </div>


         <!-- 查看归档单开始 -->
        <el-dialog id="form2" title="归档单详情展示" :visible.sync="dialogFormVisible2" :append-to-body = "true" width="700px">
            <table  class="layui-table" id="check">
                <colgroup>
                    <col width="100px">
                    <col>
                </colgroup>
                <tbody>
                    <tr><td>编号</td><td>{{archiveForm.serId}}</td></tr>
                    <tr><td>客户</td><td>{{archiveForm.cusId}}</td></tr>
                    <tr><td>概要</td><td>{{archiveForm.serHead}}</td></tr>
                    <tr><td>类型</td><td>{{archiveForm.serType}}</td></tr>
                    <tr><td>状态</td><td>{{archiveForm.serStatus}}</td></tr>
                    <tr><td>评分</td><td>{{archiveForm.serSatisfaction}}</td></tr>
                    <tr><td>创建人</td><td>{{archiveForm.uid}}</td></tr>
                    <tr><td>创建时间</td><td>{{archiveForm.createTime}}</td></tr>
                    <tr><td>分配时间</td><td>{{archiveForm.distTime}}</td></tr>
                </tbody>
            </table>
            <div style="height:50px">
                <el-button type="button" class="btn2" @click="cancel">关闭</el-button>

            </div>
            
        </el-dialog>
        <!-- 查看归档单结束 -->
        
  </div>
</template>

<script>
export default {
    data(){
      return{
        tableData:[],
        list:[],
        dialogFormVisible:false,
        dialogFormVisible2:false,
        archiveForm:{
          serId:"",
          cusId:"",
          serHead:"",
          serType:"",
          serStatus:"",
          distUid:"",
          uid: sessionStorage.getItem("user"),
          createTime:"",
          distTime:"",
          serSatisfaction:"",
        },
        formLabelWidth: '120px',
        update2 : false,
        updContent:"",
        updDate:"",
        update3:false
      };
    },
    mounted(){
        this.findMyService();
    },
    methods:{
        findMyService(){
            let self = this;
            this.$axios.post("service/findAll")
            .then(res => {
                let r = res.data;
                this.tableData = r.data;
                layui.use('table', function(){
                var table = layui.table;
                table.render({
                    elem:'#test'
                    ,data:self.tableData
                    ,cellMinWidth: 80
                    ,cols: [[
                    {field:'serId', title: '编号'}
                    ,{field:'cusId', title: '客户'}
                    ,{field:'serHead', title: '概要'}
                    ,{field:'serType', title: '类型', minWidth: 80}
                    ,{field:'serStatus', title: '状态'}
                    ,{field:'serSatisfaction',  title: '评分'}
                    ,{field:'uid', title: '创建人'}
                    ,{field:'createTime',title: '创建时间'}
                    ,{field:'distTime',title: '分配时间'}
                    ,{field: 'button', title: '操作', width:160, toolbar:"#btn"}
                    ]]
                    ,page: true
                });
                //监听工具条
                table.on('tool(test)', function(obj){
                  var data = obj.data;
                  if(obj.event == 'archivedFormView'){
                    self.archiveForm = obj.data;
                    if(self.archiveForm.serStatus != '已归档'){
                        self.$message({
                        message:"该服务未归档，无法查看归档单！",
                        type:"error"
                        });
                    }else{
                      self.dialogFormVisible2 = true;
                    }
                  }
                });
              });
            }).catch(err => { console.error(err); })
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
      cancel(){
          this.dialogFormVisible2 = false;
      },
        
      
    }

}

</script>

<style scoped>
#btn{
  display: none;
}
#check{
    width: 600px;
    margin: 0 auto;
}
.btn2{
    float: right;
    margin-top: 20px;
    margin-right:10px ;
    margin-left: 0px;
}
</style>