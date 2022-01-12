<template>
  <div>
    <h1>服务反馈</h1>
    <hr>
    <table class="layui-hide" id="test" lay-filter="test"></table>
    <div id="btn">
      <button class="layui-btn layui-btn-warm layui-btn-xs" lay-event="feedback">反馈</button>
    </div>
    <!-- 反馈框开始 -->
    <div id="feedbackform"  style="display:none; padding: 50px; line-height: 22px; font-weight: 300;">
      <el-form :model="feedbackForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="请选择">
          <el-select v-model="feedbackForm.serSatisfaction" placeholder="请选择满意度">
            <el-option  :value="1" :label="1"></el-option>
            <el-option  :value="2" :label="2"></el-option>
            <el-option  :value="3" :label="3"></el-option>
            <el-option  :value="4" :label="4"></el-option>
            <el-option  :value="5" :label="5"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <!-- 反馈框结束 -->
    
  </div>
</template>
<script>

export default {
  data(){
    return{
      tableData:[],
      feedbackForm:{
      },
      feedbackform:{
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
        serSatisfaction:"",
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
                      ,{field:'serHead', title:'概要', width:200 }
                      ,{field:'serType', title:'类型', width:80}
                      ,{field:'distTime', title:'处理时间', width:215}
                      ,{field:'serStatus', title:'状态', width:80}
                      ,{field:'uid', title:'创建人', width:150}
                      ,{field:'distUid', title:'被分配人', width:150}
                      ,{field:'button', title:'操作', toolbar: '#btn', width:148}
                    ]]
                    ,page: true
                });
                //监听工具条
                table.on('tool(test)', function(obj){
                  var data = obj.data;
                  if(obj.event == "feedback"){
                    if(data.serStatus != '已处理'){
                        self.$message({
                        message:"该服务的状态是: "+ data.serStatus +"，请选择已处理的服务进行反馈！",
                        type:"error"
                        });
                    }else{
                      self.feedback(data.serId, data.uid);
                    }
                  }
                });
            });
        })
        .catch(err => {
            console.error(err); 
        });
      },
      feedback(serId, uid){
        let self = this;
        layer.open({
          type: 1 
          ,title: '服务反馈'
          ,area: ['400px', '300px']
          ,shade: 0
          ,offset: [ 
            ($(window).height()-300)/2
            ,($(window).width()-390)/2
          ] 
          ,content: $('#feedbackform')
          ,btn: ['确认反馈', '关闭窗口'] 
          ,yes: function(){
            if(self.feedbackForm.serSatisfaction >= 3){
              self.confirmArchive(serId,self.feedbackForm.serSatisfaction);
              $("#feedbackform").css("display", "none");
            }else if(self.feedbackForm.serSatisfaction < 3){
              console.log(uid);
              self.confirmDist(serId, uid);
              $("#feedbackform").css("display", "none");
            }
          }
          ,btn2: function(){
            layer.closeAll();
             $("#feedbackform").css("display", "none");
          }
        });
      },
      confirmArchive(serId,serSatisfaction){
        console.log(serId);
        this.$axios.post("service/archive",{serId:serId+"",serSatisfaction:serSatisfaction+""})
        .then(res => {
          let r = res.data;
          if (r.code == 200) {
            console.log(serSatisfaction);
            // console.log("r.serSatisfaction=" + r.serSatisfaction);
            // console.log("this.feedbackForm.serSatisfaction" + this.feedbackForm.serSatisfaction);
            r.serSatisfaction = serSatisfaction;
            // console.log("r.serSatisfaction=" + r.serSatisfaction);
            this.updateTable();
            layer.closeAll();
            $("#feedbackform").css("display", "none");
            this.$message({
              message:"反馈成功,已归档！",
              type:"success"
            });
          }
        })
        .catch(err => {
          console.error(err); 
        })
      },
      confirmDist(serId,uid){

        this.$axios.post("service/dist",{serId:serId+"",uid:uid+""})
        .then(res => {
          let r = res.data;
          if (r.code == 200) {
            this.updateTable();
            layer.closeAll();
            $("#feedbackform").css("display", "none");
            this.$message({
              message:"满意度过低,已重新分配,请及时处理！",
              type:"success"
            });
          }
        })
        .catch(err => {
          console.error(err); 
        })
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