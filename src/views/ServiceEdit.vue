<template>
  <div>
    <table class="layui-hide" id="test" lay-filter="test"></table>
    <div id="btn">
      <button class="layui-btn layui-btn-primary layui-btn-xs" lay-event="dist">指派</button>
      <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
      <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>
    </div>
    <!-- 指派框开始 -->
    <div id="distform"  style="display:none; padding: 50px; line-height: 22px; font-weight: 300;">
      <el-form :model="distForm" ref="addForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="请选择">
          <el-select v-model="distForm.uid" placeholder="请选择客户经理指派">
            <el-option v-for="user in list" :key="user.uid" :value="user.uid" :label="user.username"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <!-- 指派框结束 -->

    <!-- 修改框开始 -->
    <div style="display:none;" id="updateform">
      <el-form :model="updateForm" :rules="rules" ref="addForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="客户名称" prop="cusName">
            <el-input v-model="updateForm.cusName" class="abc"></el-input>
        </el-form-item>
        <el-form-item label="机会来源" prop="chanceSource">
            <el-input v-model="updateForm.chanceSource" class="abc"></el-input>
        </el-form-item>
        <el-form-item label="成功率" prop="successRatio">
            <el-input v-model.number="updateForm.successRatio" class="abc"></el-input>
        </el-form-item>
        <el-form-item label="概要" prop="chanceSummary">
            <el-input v-model="updateForm.chanceSummary" class="abc"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="conName">
            <el-input v-model="updateForm.conName" class="abc"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="conPhone">
            <el-input v-model="updateForm.conPhone" class="abc"></el-input>
        </el-form-item>
        <el-form-item label="机会描述" prop="chanceDescription">
            <el-input v-model="updateForm.chanceDescription" type="textarea" class="abc"></el-input>
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
          cusName:"",
          chanceSource:"",
          successRatio:"",
          chanceSummary:"",
          cusName:"",
          conPhone:"",
          chanceDescription:"",
          uid:"",
          createTime:"",
          chanceStatus:""
        },
        rules:{
          cusName:[
              {required:true,message: '请输入客户名称', trigger: 'blur' }
          ],
          successRatio:[
              {required:true,message:'请输入成功率',trigger: 'blur'},
              { type:"number" ,min: 0, max: 100, message: '大小要在0到100', trigger: 'blur' }
          ],
          chanceSummary:[
              {required:true,message: '请输入机会概要', trigger: 'blur' }
          ],
          chanceDescription:[
              {required:true,message: '请输入机会描述', trigger: 'blur' }
          ]
        }
      };
  },
  mounted(){
      this.updateTable();
  },
  methods:{
    updateTable(){
        let self = this;
        this.$axios.post("chance/findAll")
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
                    {type:'checkbox'}
                    ,{field:'chanceId', title: '机会编号'}
                    ,{field:'cusName', title: '客户名称'}
                    ,{field:'chanceSource', title: '机会来源'}
                    ,{field:'successRatio', title: '成功概率'}
                    ,{field:'chanceSummary', title: '机会概述', minWidth: 100}
                    ,{field:'conName', title: '联系人姓名'}
                    ,{field:'conPhone',  title: '联系电话'}
                    ,{field:'chanceDescription',title: '机会描述'}
                    ,{field:'uid', title: '创建人id'}
                    ,{field:'createTime',title: '创建时间'}
                    ,{field:'chanceStatus',title: '机会状态'}
                    ,{field:'distUid',title: '指派人id'}
                    ,{field: 'button', title: '操作', width:160, toolbar:"#btn"}
                    ]]
                    ,page: true
                });
                //监听表格复选框选择
                table.on('checkbox(test)', function(obj){
                  console.log(obj.data.chanceId);
                });
                //监听工具条
                table.on('tool(test)', function(obj){
                  var data = obj.data;
                  if(obj.event == "dist"){
                    self.dist(data.chanceId);
                  } else if(obj.event == 'del'){
                    self.confirmDelete(data.chanceId);
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
      confirmDelete(chanceId){
        this.$confirm("此操作将永久删除该销售机会, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.del(chanceId)
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
      del(chanceId){
        let config = {
          headers:{
              "Content-Type":"text/plain"
          }
        }
        this.$axios.post("chance/delete",chanceId+"",config)
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
      dist(chanceId){
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
          ,title: '指派机会'
          ,area: ['400px', '300px']
          ,shade: 0
          ,offset: [ 
            ($(window).height()-300)/2
            ,($(window).width()-390)/2
          ] 
          ,content: $('#distform')
          ,btn: ['确认指派', '关闭窗口'] 
          ,yes: function(){
            self.confirmDist(self.distForm.uid,chanceId)
            // console.log(self.distForm.uid);
            // console.log(chanceId)
          }
          ,btn2: function(){
            layer.closeAll();
          }
        });
      },
      confirmDist(uid,chanceId){
        console.log(uid);
        console.log(chanceId);
        this.$axios.post("chance/dist",{chanceId:chanceId+"",uid:uid+""})
        .then(res => {
          let r = res.data;
          if (r.code == 200) {
            this.updateTable();
            layer.closeAll();
            this.$message({
              message:"指派成功！",
              type:"success"
            });
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
          ,title: '修改机会'
          ,area: ['550px', '650px']
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
          }
        });
      },
      confirmUpdate(){
        this.$axios.post("chance/update",this.updateForm)
        .then(res => {
          let r = res.data;
          if (r.code == 200) {
            this.updateTable();
            layer.closeAll();
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
  width: 400px;
}
</style>