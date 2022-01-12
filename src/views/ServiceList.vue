<template>
  <div>
    <table class="layui-hide" id="test" lay-filter="test"></table>
    <br>
    <div id="btn">
      <a class="layui-btn layui-btn-normal layui-btn-xs" lay-event="edit">编辑</a>
      <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>
    </div>

    <!-- 修改框开始 -->
    <div style="display:none;" id="updateform">
      <el-form :model="updateForm" class="demo-ruleForm" label-width="100px">
        <el-form-item label="编号" prop="serId">
            <el-input v-model="updateForm.serId" class="abc"></el-input>
        </el-form-item>
        <el-form-item label="客户" prop="cusId">
            <el-input v-model="updateForm.cusId" class="abc"></el-input>
        </el-form-item>
        <el-form-item label="概要" prop="serHead">
            <el-input v-model="updateForm.serHead" class="abc"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="serType">
            <el-input v-model="updateForm.serType" class="abc"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="serStatus">
            <el-input v-model="updateForm.serStatus" class="abc"></el-input>
        </el-form-item>
        <el-form-item label="创建人" prop="uid">
            <el-input v-model="updateForm.uid" class="abc"></el-input>
        </el-form-item>
        <el-form-item label="被分配人" prop="distUid">
            <el-input v-model="updateForm.distUid" class="abc"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <!-- 修改框结束 -->
    
  </div>
</template>
<script>

export default {
  data(){
    return{
      tableData:[],
      distForm:{
      },
      list:[],
      updateForm:{
        serId:"",
        cusId:"",
        serHead:"",
        serType:"",
        serStatus:"",
        distUid:"",
        uid: sessionStorage.getItem("user"),
        createTime:"",
        distTime:"",
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
                      ,{field:'cusId', title:'客户', width:150 }
                      ,{field:'serHead', title:'概要', width:200 }
                      ,{field:'serType', title:'类型', width:150}
                      ,{field:'serStatus', title:'状态', width:150}
                      ,{field:'uid', title:'创建人', width:150}
                      ,{field:'distUid', title:'被分配人', width:153}
                      ,{field: 'button', title:'操作', toolbar: '#btn', width:200}
                    ]]
                    ,page: true
                });
                //监听工具条
                table.on('tool(test)', function(obj){
                  var data = obj.data;
                  if(obj.event == 'del'){
                    self.confirmDelete(data.serId);
                  } else if(obj.event == 'edit'){
                    self.updateUI(data);
                  }
                });
            });
        })
        .catch(err => {
            console.error(err); 
        });
      },
      confirmDelete(serId){
        this.$confirm("此操作将永久删除该服务记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.del(serId)
          this.$message({
            type: "success",
            message: "删除成功!",
          });
           
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
      },
      del(serId){
        let config = {
          headers:{
              "Content-Type":"text/plain"
          }
        }
        this.$axios.post("service/delete",serId+"",config)
        .then(resp => {
          let r = resp.data;
          if(r.code == 200){
            this.updateTable();
          }
        })
        .catch(err => {
          console.error(err); 
        })
      },
      updateUI(data){
        this.updateForm = data;
        let self = this;
        layer.open({
          type: 1 
          ,title: '修改服务信息'
          ,area: ['560px', '650px']
          ,shade: 0
          ,offset: [ 
            ($(window).height()-600)/2
            ,($(window).width()-500)/2
          ] 
          ,content: $('#updateform')
          ,btn: ['确认修改', '关闭窗口'] 
          ,yes: function(){
            self.confirmUpdate();
          }
          ,btn2: function(){
            layer.closeAll();
            $("#updateform").css("display", "none");
          }
        });
      },
      confirmUpdate(){
        this.$axios.post("service/update",this.updateForm)
        .then(res => {
          let r = res.data;
          if (r.code == 200) {
            this.updateTable();
            layer.closeAll();
            $("#updateform").css("display", "none");
            this.$message({
              message:"修改成功！",
              type:"success"
            });
          }
        })
        .catch(err => {
          console.error(err); 
        })
      }
  }
}
</script>


<style scoped>
#btn{
  display: none;
}
.abc{
  width: 420px;
}
</style>