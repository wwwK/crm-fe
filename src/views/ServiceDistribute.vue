<template>
  <div>
    <h1>服务分配</h1>
    <hr>
    <table class="layui-hide" id="test" lay-filter="test"></table>
    <br>
    <div id="btn">
      <a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="edit">预览</a>
      <button class="layui-btn layui-btn-xs" lay-event="dist">分配</button>
    </div>
    <!-- 分配框开始 -->
    <div id="distform"  style="display:none; padding: 50px; line-height: 22px; font-weight: 300;">
      <el-form :model="distForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="请选择">
          <el-select v-model="distForm.uid" placeholder="请选择客户经理分配">
            <el-option v-for="user in list" :key="user.uid" :value="user.uid" :label="user.username"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <!-- 分配框结束 -->


    <!-- 预览框开始 -->
    <div style="display:none;" id="previewform">
      <el-form :model="previewForm"  label-width="120px" class="demo-ruleForm">
        <el-form-item label="编号" prop="serId">
            <el-input v-model="previewForm.serId" class="abc"></el-input>
        </el-form-item>
        <el-form-item label="客户" prop="cusId">
            <el-input v-model="previewForm.cusId" class="abc"></el-input>
        </el-form-item>
        <el-form-item label="概要" prop="serHead">
            <el-input v-model="previewForm.serHead" class="abc"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="serType">
            <el-input v-model="previewForm.serType" class="abc"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="serStatus">
            <el-input v-model="previewForm.serStatus" class="abc"></el-input>
        </el-form-item>
        <el-form-item label="创建人" prop="uid">
            <el-input v-model="previewForm.uid" class="abc"></el-input>
        </el-form-item>
        <el-form-item label="被分配人" prop="distUid">
            <el-input v-model="previewForm.distUid" class="abc"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <!-- 预览框结束 --> 
    
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
      previewForm:{
        serId:"",
        cusId:"",
        serHead:"",
        serType:"",
        serStatus:"",
        uid: sessionStorage.getItem("user"),
        createTime:"",
        distUid:"",
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
                      ,{field:'cusId', title:'客户', width:130 }
                      ,{field:'serHead', title:'概要', width:225 }
                      ,{field:'serType', title:'类型', width:150}
                      ,{field:'serStatus', title:'状态', width:150}
                      ,{field:'uid', title:'创建人', width:150}
                      ,{field:'distUid', title:'被分配人', width:150}
                      ,{field: 'button', title:'操作', toolbar: '#btn', width:200}
                    ]]
                    ,page: true
                });
                //监听工具条
                table.on('tool(test)', function(obj){
                  var data = obj.data;
                  if(obj.event == "dist"){
                    // console.log(data.serStatus);
                    if(data.serStatus != '新创建'){
                        self.$message({
                        message:"该服务已分配，请选择新创建的服务分配！",
                        type:"error"
                        });
                    }else{
                      self.dist(data.serId);
                    }
                  }else if(obj.event == 'edit'){
                    self.previewUI(data);
                  }
                });
            });
        })
        .catch(err => {
            console.error(err); 
        });
      },
      dist(serId){
        this.$axios.post("users/findAll")
        .then(res => {
          let r = res.data;
          this.list = r.data;
        })
        .catch(err => {
          console.error(err); 
        });
        let self = this;
        layer.open({
          type: 1 
          ,title: '分配客户经理'
          ,area: ['400px', '300px']
          ,shade: 0
          ,offset: [ 
            ($(window).height()-300)/2
            ,($(window).width()-390)/2
          ] 
          ,content: $('#distform')
          ,btn: ['确认分配', '关闭窗口'] 
          ,yes: function(){
            self.confirmDist(self.distForm.uid,serId)
          }
          ,btn2: function(){
            layer.closeAll();
            $("#distform").css("display", "none");
          }
        });
      },
      previewUI(data){
        this.previewForm = data;
        let self = this;
        layer.open({
          type: 1 
          ,title: '预览服务记录'
          ,area: ['550px', '650px']
          ,shade: 0
          ,offset: [ 
            ($(window).height()-600)/2
            ,($(window).width()-500)/2
          ] 
          ,content: $('#previewform')
          ,btn: ['结束预览'] 
          ,yes: function(){
            layer.closeAll();
            $("#previewform").css("display", "none");
            // self.confirmPreview();
          }
        });
      },
       
      confirmPreview(){
        this.$axios.post("service/update",this.previewForm)
        .then(res => {
          let r = res.data;
          if (r.code == 200) {
            this.uid = sessionStorage.getItem("user");
            
            this.updateTable();
            layer.closeAll();
            $("#previewform").css("display", "none");
            this.$message({
              message:"预览结束！",
              type:"success"
            });
          }
        })
        .catch(err => {
          console.error(err); 
        })
      },
      confirmDist(uid,serId){
        console.log(uid);
        console.log(serId);
        this.$axios.post("service/dist",{serId:serId+"",uid:uid+""})
        .then(res => {
          let r = res.data;
          if (r.code == 200) {
            this.distTime = this.fmt(new Date());
            this.updateTable();
            layer.closeAll();
            $("#distform").css("display", "none");
            this.$message({
              message:"分配成功！",
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